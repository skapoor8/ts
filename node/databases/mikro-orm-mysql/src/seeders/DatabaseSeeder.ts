import type { EntityManager } from '@mikro-orm/mysql';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Seeder } from '@mikro-orm/seeder';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager<MySqlDriver>): Promise<void> {

    await em.execute(/* sql */`
    INSERT IGNORE INTO users (id, first_name, last_name, email) 
    VALUES
      (UUID_TO_BIN(UUID()), 'Michael', 'Scott', 'greatscott@dundermifflin.com'),
      (UUID_TO_BIN(UUID()), 'Dwight', 'Schrute', 'aarm@dundermifflin.com'),
      (UUID_TO_BIN(UUID()), 'James', 'Halpert', 'jim@athleap.com'),
      (UUID_TO_BIN(UUID()), 'Andrew', 'Bernard', 'narddog@dundermifflin.com'),
      (UUID_TO_BIN(UUID()), 'Stanley', 'Hudson', 'stanley@dundermifflin.com'), 
      (UUID_TO_BIN(UUID()), 'Phyllis', 'Vance', 'phyllis@dundermifflin.com');
    `);

    await em.execute(/* sql */`
    INSERT IGNORE INTO elists (id, elist_name, owner_id) 
    VALUES 
      (
        UUID_TO_BIN(UUID()), 
        'Whales', 
        (SELECT id FROM users WHERE email = 'greatscott@dundermifflin.com')
      ),
      (
        UUID_TO_BIN(UUID()), 
        'Prince Family Paper References', 
        (SELECT id FROM users WHERE email = 'aarm@dundermifflin.com')
      ),
      (
        UUID_TO_BIN(UUID()), 
        'Prospects', 
        (SELECT id FROM users WHERE email = 'jim@athleap.com')
      ),
      (
        UUID_TO_BIN(UUID()), 
        'Sails', 
        (SELECT id FROM users WHERE email = 'narddog@dundermifflin.com')
      );
    `);

    await em.execute(/* sql */`
    INSERT IGNORE INTO subscriptions (id, first_name, last_name, company, email, user_did_consent, elist_id) 
    VALUES 
      (
        UUID_TO_BIN(UUID()),
        'Christian',
        '-',
        'Lackawanna County',
        'chris@lackawanna.gov',
        true,
        ( 
          SELECT e.id FROM 
            (elists e LEFT JOIN users u ON u.id = e.owner_id )
          WHERE u.email = 'greatscott@dundermifflin.com' and e.elist_name = 'Whales'
        )
      ),
      (
        UUID_TO_BIN(UUID()),
        'Jim',
        'Janson',
        'Dunmore High School',
        'jjanson@dunmore.edu',
        true,
        ( 
          SELECT e.id FROM 
            (elists e LEFT JOIN users u ON u.id = e.owner_id )
          WHERE u.email = 'narddog@dundermifflin.com' and e.elist_name = 'Sails'
        )
      ),
      (
        UUID_TO_BIN(UUID()),
        'Aaron',
        'Grandy',
        'Stone, Cooper, and Grandy: Attorneys at Law',
        'agrandy@scglaw.com',
        true,
        ( SELECT e.id FROM 
            (elists e LEFT JOIN users u ON u.id = e.owner_id )
          WHERE u.email = 'greatscott@dundermifflin.com' and e.elist_name = 'Whales'
        )
      ),
      (
        UUID_TO_BIN(UUID()),
        'Daniel',
        'Schofield',
        'Harper Collins',
        'danschofield@harpercollins.com',
        true,
        ( SELECT e.id FROM 
            (elists e LEFT JOIN users u ON u.id = e.owner_id )
          WHERE u.email = 'greatscott@dundermifflin.com' and e.elist_name = 'Whales'
        )
      ),
      (
        UUID_TO_BIN(UUID()),
        'Gina',
        'Rogers',
        'Apex Technology',
        'grogers@apex.tech',
        true,
        ( SELECT e.id FROM 
            (elists e LEFT JOIN users u ON u.id = e.owner_id )
          WHERE u.email = 'aarm@dundermifflin.com' and e.elist_name = 'Prince Family Paper References'
        )
      ),
      (
        UUID_TO_BIN(UUID()),
        'Jan',
        'Levinson',
        'Scranton White Pages',
        'jlevinson@scrantonwhitepages.com',
        true,
        ( SELECT e.id FROM 
            (elists e LEFT JOIN users u ON u.id = e.owner_id )
          WHERE u.email = 'aarm@dundermifflin.com' and e.elist_name = 'Prince Family Paper References'
        )
      ),
      (
        UUID_TO_BIN(UUID()),
        'Richard',
        'Stone',
        'Stone & Son Suit Warehouse',
        'stoneandsons@gmail.com',
        true,
        ( SELECT e.id FROM 
            (elists e LEFT JOIN users u ON u.id = e.owner_id )
          WHERE u.email = 'aarm@dundermifflin.com' and e.elist_name = 'Prince Family Paper References'
        )
      ),
      (
        UUID_TO_BIN(UUID()),
        'Ryan',
        'Howard',
        NULL,
        'ryanhoward@gmail.com',
        true,
        ( SELECT e.id FROM 
            (elists e LEFT JOIN users u ON u.id = e.owner_id )
          WHERE u.email = 'jim@athleap.com' and e.elist_name = 'Prospects'
        )
      ),
      (
        UUID_TO_BIN(UUID()),
        'Julius',
        'Erving',
        NULL,
        'juliuserving@gmail.com',
        true,
        ( SELECT e.id FROM 
            (elists e LEFT JOIN users u ON u.id = e.owner_id )
          WHERE u.email = 'jim@athleap.com' and e.elist_name = 'Prospects'
        )
      );
    `);
  }

}
