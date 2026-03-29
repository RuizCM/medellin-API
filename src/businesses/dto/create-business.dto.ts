import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateBusinessDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}