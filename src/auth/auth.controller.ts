import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

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

  @Get('profile')
  @UseGuards(AuthGuard)
  profile(@Request() request) {
    console.log(request.user);
    return 'profile';
  }
}
