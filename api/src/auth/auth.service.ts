import {
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
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService, // to generate token
  ) {}

  async login(email: string, password: string, response: any) {
    const user = await this.userRepository.findOne({ where: { email } }); // find user by email

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong email or password');
    }

    // Generate token
    const payload = {
      sub: user.userID,
      email: user.email,
      username: user.username,
    };

    const token = this.jwtService.sign(payload); // generate token

    response.cookie('access_token', token, {
      httpOnly: true, // JS can't access
      secure: false, // true if using https
      sameSite: 'lax', // CSRF DEFENSE
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

    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return { message: 'Registered successfully!' };
  }

  async update(
    response: any,
    email?: string,
    username?: string,
    password?: string,
  ) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    if (email != null) user.email = email;
    if (username != null) user.username = username;
    if (password != null) user.password = await bcrypt.hash(password, 10);

    await this.userRepository.save(user);
    await this.logout(response);

    return { message: 'Updated successfully' };
  }

  async logout(response: any) {
    response.clearCookie('access_token');
    return { message: 'Successfull logout' };
  }
}
