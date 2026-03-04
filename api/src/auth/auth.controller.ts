/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateDto } from './dto/update.dto';
import { VerifyCodeDto } from './dto/verify/verify-code.dto';
import { ForgotPasswordDto } from './dto/verify/forgot-password.dto';
import { ResetPasswordDto } from './dto/verify/reset-password.dto';
import { verifyUpdateDto } from './dto/verify/verify-update.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(body.email, body.password, response);
  }

  @Post('verify-login')
  async verifyLogin(
    @Body() body: VerifyCodeDto,
    @Res({ passthrough: true }) response: any,
  ) {
    return this.authService.verifyLogin(body.email, body.code, response);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.username, body.password);
  }

  @Post('verify-register')
  async registerVerify(@Body() body: VerifyCodeDto) {
    return this.authService.verifyRegister(body.email, body.code);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(@Request() req: any, @Body() body: UpdateDto) {
    return this.authService.update(req.user.email, {
      email: body.email,
      username: body.username,
      password: body.password,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-update')
  async updateVerify(
    @Request() req: any,
    @Body() body: verifyUpdateDto,
    @Res({ passthrough: true }) response: any,
  ) {
    return this.authService.verifyUpdate(req.user.email, body.code, response);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.verifyForgotPassword(
      body.email,
      body.code,
      body.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: any) {
    return {
      email: req.user.email,
      username: req.user.username,
    }; // JwtStrategy validate()
  }
}
