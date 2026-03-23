import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class MyOrdersDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  @IsNotEmpty()
  tableID: string;

  @ApiProperty({ example: 'A1' })
  @IsNotEmpty()
  authCode: string;
}
