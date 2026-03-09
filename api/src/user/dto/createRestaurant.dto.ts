import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: '' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  restaurantName: string;

  @ApiProperty({ example: '' })
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  address: string;
}
