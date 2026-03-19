import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { StaffRole } from '../../entities/staff.entity';

export class UpdateWorkerDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  restaurantID: string;

  @ApiProperty({ example: '' })
  @IsUUID()
  workerID: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  username: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional({ enum: StaffRole, example: StaffRole.WAITER })
  @IsOptional()
  @IsEnum(StaffRole)
  role: StaffRole;
}
