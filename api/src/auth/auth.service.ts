/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/mail.service';

type PendingAction = {
  code: string;
  expiresAt: Date;
  data: any;
};
@Injectable()
export class AuthService {
  [x: string]: any;
  private pendingActions = new Map<string, PendingAction>();
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService, // to generate token
    private mailService: MailService,
  ) {
    setInterval(
      () => {
        const now = new Date();
        this.pendingActions.forEach((value, key) => {
          if (value.expiresAt < now) this.pendingActions.delete(key);
        });
      },
      5 * 60 * 1000,
    );
  }

  private generateCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }

  private async createVerification(email: string, type: string, data?: any) {
    const code = this.generateCode();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const key = `${email}:${type}`;
    this.pendingActions.set(key, { code, expiresAt, data });

    await this.mailService.sendVerificationCodeMail(email, code);
    return { message: 'Verification code sent to your email.' };
  }

  private verifyAndGetData(email: string, type: string, code: string) {
    const key = `${email}:${type}`;
    const action = this.pendingActions.get(key);

    if (!action)
      throw new BadRequestException('Code expired or invalid request.');
    if (action.code !== code)
      throw new BadRequestException('Invalid verification code.');
    if (action.expiresAt < new Date()) {
      this.pendingActions.delete(key);
      throw new BadRequestException('Verification code expired.');
    }

    this.pendingActions.delete(key);
    return action.data;
  }

  async login(email: string, password: string, response: Response) {
    const user = await this.userRepository.findOne({ where: { email } }); // find user by email

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong email or password');
    }

    return this.createVerification(email, 'login', { userID: user.userID });
  }

  async verifyLogin(email: string, code: string, response: any) {
    const data = this.verifyAndGetData(email, 'login', code);

    // data was stored with userID (uppercase D); use the same key
    const user = await this.userRepository.findOne({
      where: { userID: data.userID },
    });
    if (!user) throw new NotFoundException('User not found!');

    // Generate token
    const payload = {
      sub: user.userID,
      email: user.email,
      username: user.username,
    };
    const token = this.jwtService.sign(payload); // generate token

    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('access_token', token, {
      httpOnly: true, // JS can't access
      secure: isProduction, // enforce HTTPS in production, allow HTTP in dev
      sameSite: 'strict', // CSRF DEFENSE
      maxAge: 1000 * 60 * 60 * 24, // 1 DAY
    });

    return { message: 'Login success' };
  }

  async register(email: string, username: string, password: string) {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('This email is already registered!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.createVerification(email, 'register', {
      username,
      password: hashedPassword,
    });
  }

  async verifyRegister(email: string, code: string) {
    const data = this.verifyAndGetData(email, 'register', code);

    const user = this.userRepository.create({
      email: email,
      username: data.username,
      password: data.password,
    });

    await this.userRepository.save(user);
    return { message: 'Registered successfully!' };
  }

  async update(currentEmail: string, updateData: any) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.createVerification(currentEmail, 'update', updateData);
  }

  async verifyUpdate(currentEmail: string, code: string, response: any) {
    const changes = this.verifyAndGetData(currentEmail, 'update', code);

    const user = await this.userRepository.findOne({
      where: { email: currentEmail },
    });

    if (!user) throw new NotFoundException('User not found');

    if (changes.email != null) user.email = changes.email;
    if (changes.username != null) user.username = changes.username;
    if (changes.password != null) user.password = changes.password;

    await this.userRepository.save(user);
    await this.logout(response);

    return { message: 'Updated successfully! Please login again!' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return { message: 'If email exists, code sent.' };

    return this.createVerification(email, 'forgot-password', {
      userId: user.userID,
    });
  }

  async verifyForgotPassword(email: string, code: string, newPassword: string) {
    this.verifyAndGetData(email, 'forgot-password', code);

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found!');

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password reset successfully!' };
  }

  async logout(response: any) {
    response.clearCookie('access_token');
    return { message: 'Successfull logout' };
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
