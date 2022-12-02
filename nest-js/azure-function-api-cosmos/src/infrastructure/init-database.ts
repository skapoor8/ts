import { CosmosClient } from '@azure/cosmos';
import * as dotenv from 'dotenv';
import path from 'path';

console.warn('This script requires the file environments/.local.env');
// TODO: check file exists

async function main() {
  dotenv.config({
    path: path.join(__dirname, '../environments/.local.env'),
  });

  const key = process.env.AZURE_COSMOS_DB_KEY;
  const endpoint = process.env.AZURE_COSMOS_DB_ENDPOINT;
  console.log('key:', key, 'endpoint:', endpoint);

  // connect to cosmos
  const cosmosClient = new CosmosClient({ endpoint, key });

  // create default database
  const { database } = await cosmosClient.databases.createIfNotExists({
    id: 'CatsDatabase',
  });
  console.log(`${database.id} database ready`);

  // create default container
  const { container } = await database.containers.createIfNotExists({
    id: 'Cats',
    partitionKey: {
      paths: ['/id'],
    },
  });
  console.log(`${container.id} container ready`);
}

main();
