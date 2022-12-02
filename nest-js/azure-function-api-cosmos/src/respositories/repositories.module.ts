import { CatModel } from '@app/models';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CatsRepository } from './cats.respository';

@Module({
  imports: [
    AzureCosmosDbModule.forFeature([{ dto: CatModel, collection: 'Cat' }]),
  ],
  providers: [CatsRepository],
  exports: [CatsRepository],
})
export class RepositoriesModule {}
