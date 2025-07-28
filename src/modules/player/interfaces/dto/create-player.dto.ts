import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  wins?: number;
  losses?: number;
}
