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

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.username, body.password);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(
    @Body() body: UpdateDto,
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
  @Get('me')
  getMe(@Request() req: any) {
    return req.user; // JwtStrategy validate()
  }
}
