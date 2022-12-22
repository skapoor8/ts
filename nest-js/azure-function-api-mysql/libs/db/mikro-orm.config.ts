import { Options, PopulateHint } from '@mikro-orm/core';
import { ElistEntity } from './src/lib/entities/elist.entity';
import { SubscriptionEntity } from './src/lib/entities/subscription.entity';
import { UserEntity } from './src/lib/entities/user.entity';

const options: Options = {
  entities: [UserEntity, ElistEntity, SubscriptionEntity], // no need for `entitiesTs` this way
  dbName: 'azure_function_api_mysql',
  type: 'mysql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`
  populateWhere: PopulateHint.INFER, // prevent auto population
  migrations: {
    path: 'src/lib/migrations',
    pathTs: 'src/lib/migrations',
    transactional: false, // mysql doesn't support transactions for schema statements
  },
  seeder: {
    path: 'src/lib/seeders',
    pathTs: 'src/lib/seeders',
  },
  user: 'root',
  password: '',
};

export default options;
