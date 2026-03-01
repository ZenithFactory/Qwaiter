import { Injectable, UnauthorizedException } from '@nestjs/common';
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
}
