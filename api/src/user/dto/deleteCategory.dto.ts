import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteCategoryDto {
  @ApiProperty({ example: '' })
  @IsUUID()
  restaurantID: string;

  @ApiProperty({ example: '' })
  @IsUUID()
  categoryID: string;
}
