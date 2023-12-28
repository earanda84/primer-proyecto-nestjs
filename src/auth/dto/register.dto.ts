import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @Transform((name) => name.value.trim())
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @Transform((password) => password.value.trim())
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;
}
