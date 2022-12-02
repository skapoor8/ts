import { ICat } from '@app/interfaces';
import { CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('id')
export class CatModel implements ICat {
  id: string;
  name: string;
  age: number;
  breed: string;
}
