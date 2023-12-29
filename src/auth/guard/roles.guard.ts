import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../../common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector permite leer el role que viene  como metadato en la ruta del auth.controller, en donde se crea un decorador personalizado como una constante que recibe una funcion callback, con el rol como parametro
  // Basicamente Reflector, lee los metadatos que se pasaron al decorador creado, el cual es creado mediante una función callback que recibe un parametro, para el caso el metadadto pasado al decorador y lo configura en la peticion, simil a localStorage del navegador.

  // Y acá lo esta leyendo, ósea, extrayendo desde la petición de request.
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Llamar a la request de express
    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    console.log('el user del guard => ', user.role);
    // Esta línea de código, dado que si la ruta en específico del controlador, no requiere el uso de rol, o no se considera el uso de rol, devueva true, para que la aplicación no se rompa y permita seguir el curso lógico del proceso.
    // Basicamente, estamos controlando el echo que si viene undefined, no rompa la aplicación, ya que si la ruta, no tiene el decorador personalizado que se creo para este guard, que es @Roles, no crachee la app.
    if (!role) {
      return true;
    }

    // Con esta línea, el usuario tendrá acceso a toda las rutas, incluidas las protegidas para el usuario
    if (user.role === Role.ADMIN) {
      return true;
    }

    // console.log(role);
    console.log(role === user.role);
    return role === user.role;
  }
}
