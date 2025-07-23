import { IsString } from 'class-validator';

export class UpdateMonsterNameDto {
  @IsString({ message: 'O nome deve ser uma string válida' })
  name: string;
}
