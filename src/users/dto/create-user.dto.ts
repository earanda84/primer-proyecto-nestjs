export class CreateUserDto {
  email: string;
  password: string;
  name?: string;
}
// sino se utiliza el controlador, las validaciones no son necesarias, dado que el servicio será quién realizar las validaciones al ingresar los datos del usuario que se creará
