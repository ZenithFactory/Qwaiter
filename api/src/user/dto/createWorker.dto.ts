import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { StaffRole } from '../../entities/staff.entity';

export class CreateWorkerDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  restaurantID: string;

  @ApiProperty({ example: '' })
  @IsString()
  name: string;

  @ApiProperty({ example: '' })
  @IsString()
  username: string;

  @ApiProperty({ example: '' })
  @IsString()
  password: string;

  @ApiProperty({ enum: StaffRole, example: StaffRole.WAITER })
  @IsEnum(StaffRole)
  role: StaffRole;
}
