import { Controller, Get, Query, Post, Body, Put, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { ICat } from '../entities';

const cats: ICat[] = [
  {
    id: '1',
    name: 'Bilbo Buresh-Kapoor',
    age: 2.5,
    breed: 'Hobbit',
  },
  {
    id: '2',
    name: 'Honeybee Buresh-Kapoor',
    age: 2,
    breed: 'Tordy',
  },
];

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: ICat) {
    const newCat = { ...createCatDto, id: `${cats.length+1}` };
    cats.push(newCat);
    return;
  }

  @Get()
  findAll(@Query() query) {
    return cats;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const cat = cats.find(c => c.id === id);
    if (cat === undefined) throw new BadRequestException('Invalid ID');
    return cat;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: ICat) {
    const cat = cats.find(c => c.id === id);
    if (cat === undefined) throw new BadRequestException('Invalid ID');
    Object.assign(cat, { ...updateCatDto, id });
    return cat;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (id) {
      const index = cats.findIndex(c => c.id === id);
      if (index === -1) throw new NotFoundException();
      cats.splice(index, 1);
    }
    return;
  }
}