import { Breed } from '../../breeds/entities/breed.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Cat {
  // @PrimaryGeneratedColumn()
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @DeleteDateColumn()
  deletedAt: Date;

  // El many to one, no ncesariamente requiere de un one to many
  @ManyToOne(() => Breed, (breed) => breed.id, { eager: true })
  breed: Breed;

  // Relacion con el usuario, sin que exista fisicamente la columna en la tabla de usuario y viceversa, pero puede tener solo la referencia
  // Esto es como una relación automática
  @ManyToOne(() => User)

  // Esta referencia une la entidad Cat con la Entidad User mediante el email y la referencia en la tabla de muchos, que para esta caso es Cat, la clave foránea será la columna userEmail.
  // Basicamente, lo que esta realizando acá es que el gato puede tener un usuario, pero un usuario puede tener muchos gatos, entonces la referencia es en la tabla uno, que es la de usuario hacia la tabla gatos, uniendolos mediante la referencia o foreingKey que es el email, en la columna userEmail en la tabla de gatos.

  // esta es solo la unión, por lo que se debe crear igualmente una columna con el dato, para que cuando se cree el gato, se le pase el email de usuario que creo el gato.
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: User;

  // 8
  @Column()
  userEmail: string;
}
