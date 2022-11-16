import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
// import { MySqlDriver } from '@mikro-orm/mysql';
import config from './mikro-orm.config';
import { toMySQLBinary } from './utilities/db.utils';


// import { v4 as uuid, parse, stringify } from 'uuid';

// script
try {
  await main();
} catch (e) {
  console.error(e);
  process.exit();
}

async function main() {

  const orm = await MikroORM.init<MySqlDriver>(config);
  const em = orm.em;
  console.log(em);

  const pamUserId = toMySQLBinary('f4a54ccc-642f-4477-bc00-204c25379c2b');
  const pamElistId = toMySQLBinary('e15a6b8b-ee22-4762-92cf-fa7848673f60');
  const pamSubId1 = toMySQLBinary('cfe46838-c42d-42cb-824b-c8b0895f2fb1');
  const pamSubId2 = toMySQLBinary('aa6e9ed8-fd73-48d0-bf9a-f133f7c85f3d');
  
  // CREATE
  

  // READ

  // UPDATE

  // DELETE

}