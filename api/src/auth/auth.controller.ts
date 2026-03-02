import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(body.email, body.password, response);
  }

  @Post('register')
  async register(
    @Body() body: { email: string; username: string; password: string },
  ) {
    return this.authService.register(body.email, body.username, body.password);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(
    @Body() body: { email?: string; username?: string; password?: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.update(
      response,
      body.email,
      body.username,
      body.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  getMe(@Request() req: any) {
    return req.user; // JwtStrategy validate()
  }
}
