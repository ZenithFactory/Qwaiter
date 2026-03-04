import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @MinLength(8, { message: 'Email must be at least 8 characters long!' })
  @IsEmail({}, { message: 'Invalid email!' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Username must be at least 6 characters long!' })
  username: string;

  @IsString()
  @MinLength(8, {
    message: 'The password must be at least 8 characters long!',
  })
  password: string;
}
