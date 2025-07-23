import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateMonsterDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1, { message: 'HP deve ser no mínimo 1' })
  @Max(100, { message: 'HP deve ser no máximo 100' })
  hp: number;

  @IsInt()
  @Min(1, { message: 'Ataque deve ser no mínimo 1' })
  @Max(20, { message: 'Ataque deve ser no máximo 20' })
  attack: number;

  @IsInt()
  @Min(1, { message: 'Defesa deve ser no mínimo 1' })
  @Max(10, { message: 'Defesa deve ser no máximo 10' })
  defense: number;

  @IsInt()
  @Min(1, { message: 'Velocidade deve ser no mínimo 1' })
  @Max(10, { message: 'Velocidade deve ser no máximo 10' })
  speed: number;

  @IsString()
  specialAbility: string;
}
