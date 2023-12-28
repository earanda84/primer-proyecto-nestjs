import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.findOneByEmail(registerDto.email);
    // Verificar exeptions en NESTJS para enviar las respuestas
    if (user) {
      throw new BadRequestException('Use Already exists');
    }

    const passwordHash = await bcryptjs.hash(registerDto.password, 10);

    return await this.usersService.create({
      ...registerDto,
      password: passwordHash,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const validatePassword = await bcryptjs.compare(
      loginDto.password,
      user.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('Email / Password Invalid');
    }

    const payload = { email: user.email };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email: user.email,
    };
  }
}
