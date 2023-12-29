import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { Request } from 'express';
import { Roles } from './decorators/role.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';

// Se crea esta interface que extiende de la Requeste de Express, que agrega un elemento más que es el usuario junto con el email y el role
interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  // 8Para usar el servicio, se debe utilizar el servicio se debe crear un injectable
  constructor(private readonly authService: AuthService) {}

  // Esto crea un metodo directamente en la ruta auth
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    // console.log(registerDto);
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() logingDto: LoginDto) {
    return this.authService.login(logingDto);
  }

  // Ruta con decoradores unitarios
  // @Get('profile')
  // @Roles(Role.ADMIN)
  // @UseGuards(AuthGuard, RolesGuard)
  // // Para la request, que es una interface que extiende de Request de Express, se pasa el objeto que viene en la request, el cual trae el email y el role, para que quede con tipado.
  // profile(@Req() request: RequestWithUser) {
  //   return this.authService.profile(request.user);
  // }

  // ruta con decorador unificado
  @Get('profile')
  // Este decorador personalizado recibe como parametro el rol del usuario, el cual se define en el service de la creación de usuario
  @Auth(Role.USER)
  profile(@ActiveUser() user: UserActiveInterface) {
    return this.authService.profile(user);
  }
}
