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

  // delete db
  const res = await cosmosClient.database('CatsDatabase').delete();
  console.log('Deleted database:', res);
}

main();
