// para crear una nueva entidad o Dto como se llama en TYPE ORM nest g res users --no-spec

import { Role } from '../../common/enums/rol.enum';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  // Esta sentencia genera una columna con una primary KEY mediante primary y Autogenerado mediante generated
  //   @Column({ primary: true, generated: true })

  // Esto realiza exactamente que la sentencia de la parte superior
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  //  El campo unique: implica que que es un campo unico y el campo nullable: no puede estar el campo vacío.
  @Column({ unique: true, nullable: false })
  email: string;

  // el atributo select, se setea por defecto en true, si se configura en false, es para que cuando se llame al usuario, en este caso la entidad USER, no mostrará el elemento que contenga el atributo select: false en el decorador.
  @Column({ nullable: false, select: false })
  password: string;

  // El type: enum => considera una array con enumeradores para la base de datos
  // EL default: Role.USER => invoca el enum de roles para esta caso el usuario.
  // El enum: Rol => invoca al enum definido en el rol.enum.ts
  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  // @DeleteDateColumn() => elimina columnas pero no de manera física en la base de datos, solo las elimina entregando una fecha pero no eliminando propiamente tal el elemento en la BASE DE DATOS.
  //   Por ejemplo si se siguen ventas y se requiere eliminar facturas, el registro sigue estando igualmente en el registro, es una pseudo eliminación
  @DeleteDateColumn()
  deletedAt: Date;
}
