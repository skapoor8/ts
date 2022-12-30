import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ElistService, UserService } from '@azure-function-api-mysql/db';
import { IUser } from '@azure-function-api-mysql/interfaces';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly elistService: ElistService
  ) {}

  @Get()
  public async index() {
    try {
      return await this.userService.findAll();
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Get('/:id')
  public async read(@Param('id') id) {
    try {
      return await this.userService.findOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Post()
  public async create(@Body() body: Omit<IUser, 'id'>) {
    console.log('body:', body);
    try {
      await this.userService.createOne(body);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Put('/:id')
  public async update(@Param('id') id: string, @Body() body: IUser) {
    console.log('body:', body);

    if (id !== body.id) {
      throw new BadRequestException('id in request body does not match route');
    }

    try {
      const updated = await this.userService.updateOne(id, body);
      return updated;
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Delete('/:id')
  public async destroy(@Param('id') id: string) {
    try {
      await this.userService.deleteOne(id);
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  @Get('/:id/elists')
  public async getElists(@Param('id') userId: string) {
    try {
      return await this.elistService.findByOwnerId(userId);
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }
}
