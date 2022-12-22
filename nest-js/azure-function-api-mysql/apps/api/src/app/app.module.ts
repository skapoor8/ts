import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import {
  UserEntity,
  ElistEntity,
  SubscriptionEntity,
  UserService,
  ElistService,
} from '@azure-function-api-mysql/db';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ElistController } from './controllers/elist.controller';
import { PopulateHint } from '@mikro-orm/core';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      debug: true,
      type: 'mysql',
      user: 'root',
      password: '',
      dbName: 'azure_function_api_mysql',
      entities: [UserEntity, SubscriptionEntity, ElistEntity],
      populateWhere: PopulateHint.INFER, // prevent auto population
    }),
    MikroOrmModule.forFeature([UserEntity, SubscriptionEntity, ElistEntity]),
  ],
  providers: [AppService, UserService, ElistService],
  controllers: [AppController, UserController, ElistController],
})
export class AppModule {}
