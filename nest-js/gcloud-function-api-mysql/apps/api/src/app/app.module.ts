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
  SubscriptionService,
} from '@azure-function-api-mysql/db';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ElistController } from './controllers/elist.controller';
import { PopulateHint } from '@mikro-orm/core';
import { SubscriptionController } from './controllers/subscription.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/../../../apps/api/src/environments/.env`],
      isGlobal: true, // make it available everywhere without need for import
    }),
    MikroOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        console.log(
          'config:',
          config.get('MYSQL_DB_ENDPOINT'),
          config.get('MYSQL_USERNAME'),
          config.get('MYSQL_PASSWORD')
        );
        return {
          debug: true,
          type: 'mysql',
          clientUrl: config.get('MYSQL_DB_ENDPOINT'),
          user: config.get('MYSQL_USERNAME'),
          password: config.get('MYSQL_PASSWORD'),
          dbName: config.get('MYSQL_DB_NAME'),
          entities: [UserEntity, SubscriptionEntity, ElistEntity],
          populateWhere: PopulateHint.INFER, // prevent auto population
        };
      },
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([UserEntity, SubscriptionEntity, ElistEntity]),
  ],
  providers: [AppService, UserService, ElistService, SubscriptionService],
  controllers: [
    AppController,
    UserController,
    ElistController,
    SubscriptionController,
  ],
})
export class AppModule {}
