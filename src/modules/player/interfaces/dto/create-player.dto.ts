import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber()
  wins?: number;

  @IsOptional()
  @IsNumber()
  losses?: number;
}
