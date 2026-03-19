import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  restaurantID: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsUUID()
  categoryID?: string;

  @ApiProperty({ example: '' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '' })
  @IsNumber()
  price: number;
}
