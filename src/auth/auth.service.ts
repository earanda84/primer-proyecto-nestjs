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

    await this.usersService.create({
      ...registerDto,
      password: passwordHash,
    });

    return {
      name: registerDto.name,
      email: registerDto.email,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );

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

    const payload = { email: user.email, role: user.role };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email: user.email,
    };
  }

  async profile({ email, role }: { email: string; role: string }) {
    // Esto es un poco perezoso, ya que si se tiene una cantidad importante de rutas, se tendrá que evaluar la cantidad como tantas rutas existan
    // if (role !== 'admin') {
    //   throw new UnauthorizedException(
    //     'Your are not authorized to access this resource',
    //   );
    // }

    return await this.usersService.findOneByEmail(email);
  }
}
