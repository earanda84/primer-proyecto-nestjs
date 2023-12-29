import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from '../breeds/entities/breed.entity';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';

// El service es el que interactúa con la capa de negocio, en donde se realizan las inserciones a la base de datos
@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catsRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto, user: UserActiveInterface) {
    try {
      const breed = await this.validateBreed(createCatDto.breed);

      return await this.catsRepository.save({
        ...createCatDto,
        breed,
        userEmail: user.email,
      });
    } catch (error) {
      return error;
    }
  }

  async findAll(user: UserActiveInterface) {
    if (user.role === Role.ADMIN) {
      return await this.catsRepository.find();
    }
    return await this.catsRepository.find({
      where: { userEmail: user.email },
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const cat = await this.catsRepository.findOneBy({ id });

    this.catNotFound(cat);

    this.validateOwnership(cat, user);

    return cat;
  }

  async update(
    id: number,
    updateCatDto: UpdateCatDto,
    user: UserActiveInterface,
  ) {
    try {
      await this.findOne(id, user);

      return await this.catsRepository.update(id, {
        ...updateCatDto,
        breed: updateCatDto.breed
          ? await this.validateBreed(updateCatDto.breed)
          : undefined,
        userEmail: user.email,
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async remove(id: number, user: UserActiveInterface) {
    try {
      await this.findOne(id, user);

      return await this.catsRepository.softDelete({ id });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // Sección Métodos privados
  private async validateBreed(breed: string) {
    const breedEntity = await this.breedRepository.findOneBy({ name: breed });

    if (!breedEntity) {
      throw new NotFoundException('Breed not Found');
    }

    return breedEntity;
  }

  private validateOwnership(cat: Cat, user: UserActiveInterface) {
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException();
    }
  }

  private catNotFound(cat: Cat) {
    if (!cat) {
      throw new NotFoundException();
    }
  }

  // private catNotFoundToUpdate(cat: Cat) {
  //   if (!cat) {
  //     return {
  //       status: 404,
  //       message: 'El animal no existe',
  //     };
  //   }
  // }
}
