import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  // Este modulo tendrá la potestad unica de poder crear-listar-actualizar-eliminar usuarios directamente desde la base de datos, no como se realizo enntre las entidades de cats y breeds, ya que para ese caso, la entidad Cat podrá tener referencias directas a la entidad Breed
  constructor(
    // InjectRepository viene desde TYPEORM
    // Se llama a la entidad
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Se inicializa un private readonly para que no se pueda manipular la clase, sea solo de lectura, Repository igualmente viene desde TYPEORM
    // Basicamente esta es una variable userRepository que es del tipo Repository y se debe comportar como el modelo o entidad User.
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  // mETODO PERSONALIZADO
  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
