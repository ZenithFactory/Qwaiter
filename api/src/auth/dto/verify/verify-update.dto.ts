import { Length } from 'class-validator';

export class verifyUpdateDto {
  @Length(6)
  code: string;
}
