import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsNumber()
  winners?: number;

  @IsOptional()
  @IsNumber()
  losses?: number;
}
