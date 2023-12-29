import { Cat } from '../../cats/entities/cat.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Breed {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ length: 255 })
  name: string;

  // El one to many no puede existir sin el many to one
  @OneToMany(() => Cat, (cat) => cat.breed)
  cats: Cat[];
}
