import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class tablesDto {
  @ApiProperty({ example: '' })
  @IsString()
  restaurantID: string;
}
