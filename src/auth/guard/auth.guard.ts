import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtConstants } from '../constants/jwt.constants';
import { JwtService } from '@nestjs/jwt';

// Este metodo es una implementación, que devuelve un valor boolean, es una especie de middleware, que se ejecuta antes de llamar a una ruta que puede estar protegida.
// Este metodo implementa una INTERFACE DE TYPESCRIPT
@Injectable()
export class AuthGuard implements CanActivate {
  // siempre que se requiera inyectar una propiedad se debe crear un constructor.
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // console.log(request.headers.authorization);

    // Recuperar desde el metodo privado extractTokenFrmomHeader el token
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Aca se agrega a la request el usuario
      request['user'] = payload;
      // console.log('El payload de la request => ', payload);
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  // Metodo que extrae el token desde el header, enviado en la peticion http
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}

// Este metodo es el que verifica si existe un token
