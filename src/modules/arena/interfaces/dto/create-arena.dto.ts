import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateArenaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  players?: string[];

  @IsString()
  @IsOptional()
  createdBy?: string;
}
