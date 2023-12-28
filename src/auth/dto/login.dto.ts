import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @Transform((password) => password.value.trim())
  @IsString()
  @IsStrongPassword()
  @MinLength(6)
  password: string;
}
