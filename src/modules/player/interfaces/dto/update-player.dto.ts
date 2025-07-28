import { IsString, IsOptional } from 'class-validator';

export class UpdatePlayerDto {
  @IsString()
  @IsOptional()
  username?: string;
}
