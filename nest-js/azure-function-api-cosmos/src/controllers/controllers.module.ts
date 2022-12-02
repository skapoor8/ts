import { CatModel } from '@app/models';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Module } from '@nestjs/common';
import { RepositoriesModule } from 'src/respositories';
import { CatsController } from './cats.controller';

@Module({
  imports: [RepositoriesModule],
  controllers: [CatsController],
})
export class ControllersModule {}
