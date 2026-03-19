import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  restaurantID: string;

  @ApiProperty({ example: '' })
  @IsUUID()
  categoryID: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
