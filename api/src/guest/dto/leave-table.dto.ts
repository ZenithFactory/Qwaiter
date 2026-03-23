import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class LeaveTableDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  @IsNotEmpty()
  tableID: string;

  @ApiProperty({ example: '' })
  @IsNotEmpty()
  authCode: string;
}
