import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @MinLength(8, { message: 'Email must be at least 8 characters!' })
  @IsEmail({}, { message: 'Invalid email!' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'The password needs at least 8 character!' })
  password: string;
}
