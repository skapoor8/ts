import { Options } from "@mikro-orm/core";
import { ElistsEntity } from "./entities/elists.entity";
import { SubscriptionsEntity } from "./entities/subscriptions.entity";
import { UsersEntity } from "./entities/users.entity";

const options: Options = {
  entities: [UsersEntity, ElistsEntity, SubscriptionsEntity], // no need for `entitiesTs` this way
  dbName: 'node_mikro_mysql_elist_manager',
  type: "mysql", // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  migrations: {
    path: 'build/migrations',
    pathTs: 'src/migrations',
    transactional: false // mysql doesn't support transactions for schema statements
  },
  seeder: {
    path: 'build/seeders',
    pathTs: 'src/seeders'
  }
};

export default options;