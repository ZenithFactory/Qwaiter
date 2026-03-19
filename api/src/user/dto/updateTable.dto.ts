import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class updateTableDto {
  @ApiPropertyOptional({ example: '' })
  @IsString()
  restaurantID: string;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  tableID: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  tableName: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  authCode: string;
}
