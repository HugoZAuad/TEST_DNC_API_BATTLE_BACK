import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDefined } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsNumber()
  @IsDefined()
  winners?: number | null;

  @IsOptional()
  @IsNumber()
  @IsDefined()
  losses?: number | null;
}
