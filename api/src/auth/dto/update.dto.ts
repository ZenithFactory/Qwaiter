import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email!' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Username must be more than 6 characters!' })
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'The password needs to be 8 character!' })
  password?: string;
}
