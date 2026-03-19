import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class deleteTableDto {
  @ApiProperty({ example: '' })
  @IsString()
  restaurantID: string;

  @ApiProperty({ example: '' })
  @IsString()
  tableID: string;
}
