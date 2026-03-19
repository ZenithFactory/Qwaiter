import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  restaurantID: string;

  @ApiProperty({ example: '' })
  @IsString()
  @MaxLength(50)
  categoryName: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
