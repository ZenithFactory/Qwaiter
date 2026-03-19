import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class UpdateMenuItemDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  restaurantID: string;

  @ApiProperty({ example: '' })
  @IsUUID()
  menuItemID: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsUUID()
  categoryID?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsNumber()
  price?: number;
}
