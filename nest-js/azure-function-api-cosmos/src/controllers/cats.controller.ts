import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CatsRepository, CosmosNotFoundError } from 'src/respositories';
import { ICat } from '../entities';

const cats: ICat[] = [
  {
    id: '1',
    name: 'Bilbo Buresh-Kapoor',
    age: 2.5,
    breed: 'Hobbit',
  },
  // {
  //   id: '2',
  //   name: 'Honeybee Buresh-Kapoor',
  //   age: 2,
  //   breed: 'Tordy',
  // },
];

@Controller('cats')
export class CatsController {
  constructor(private _catsRepo: CatsRepository) {}

  @Post()
  async create(@Body() createCatDto: ICat) {
    try {
      const created = await this._catsRepo.addOne(createCatDto);
      return created;
    } catch (e) {
      throw new UnprocessableEntityException(e);
    }
  }

  @Get()
  async findAll(@Query() query) {
    try {
      const newcats = await this._catsRepo.index();
      return newcats;
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e, e.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const cat = await this._catsRepo.findOne(id);
      return cat;
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e, e.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: ICat) {
    try {
      const updated = await this._catsRepo.updateOne(id, updateCatDto);
      return updated;
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e, e.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this._catsRepo.deleteOne(id);
    } catch (e) {
      console.error(e);
      let message;
      switch (e.constructor) {
        case CosmosNotFoundError:
          message = `Entity with id ${id} was not found`;
          break;
        default:
          message = e.message;
          break;
      }
      throw new NotFoundException(message);
    }
  }
}
