import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';

// El service es el que interactúa con la capa de negocio, en donde se realizan las inserciones a la base de datos
@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catsRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    try {
      const breed = await this.breedRepository.findOneBy({
        name: createCatDto.breed,
      });

      if (!breed) {
        throw new BadRequestException('Breed not Found.');
      }

      // const cat = this.catsRepository.create(createCatDto);

      return await this.catsRepository.save({ ...createCatDto, breed });
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    return await this.catsRepository.find();
  }

  async findOne(id: number) {
    const ifNotExist = await this.catsRepository.findOneBy({ id });

    if (!ifNotExist) {
      return {
        status: 404,
        message: 'Bad Request',
      };
    }
    return await this.catsRepository.findBy({ id });
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    try {
      const animal = await this.catsRepository.findOneBy({ id });
      console.log(animal);
      if (!animal) {
        return {
          status: 404,
          message: 'El animal no existe',
        };
      }
      return;
      // return this.catsRepository.update(id, updateCatDto);
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      const cat = await this.catsRepository.softDelete(id);

      if (!cat.raw[0]) {
        return {
          status: 404,
          message: 'Bad Request!',
        };
      }
      // A softDelete se le pasan id
      // A remove se le pasan entidades
      return await this.catsRepository.softDelete(id);
    } catch (error) {
      console.log(error);
    }
  }
}
