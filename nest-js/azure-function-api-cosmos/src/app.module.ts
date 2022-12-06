import { CatModel } from '@app/models';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${__dirname}/../../src/environments/.development.env`,
        `${__dirname}/../../src/environments/.local.env`,
      ],
      isGlobal: true, // make it available everywhere without need for import
    }),
    AzureCosmosDbModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        // console.log(
        //   __dirname,
        //   'endpoint:',
        //   configService.get('AZURE_COSMOS_DB_ENDPOINT'),
        // );
        return {
          dbName: configService.get('AZURE_COSMOS_DB_NAME'),
          endpoint: configService.get('AZURE_COSMOS_DB_ENDPOINT'),
          key: configService.get('AZURE_COSMOS_DB_KEY'),
        };
      },
      inject: [ConfigService],
    }),
    ControllersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
