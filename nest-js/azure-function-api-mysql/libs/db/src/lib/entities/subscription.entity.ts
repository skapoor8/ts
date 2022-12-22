import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ISubscription } from '@azure-function-api-mysql/interfaces';
import { ElistEntity } from './elist.entity';
import { UuidType } from '../custom-types';

@Entity({ tableName: 'subscriptions' })
@Unique({ properties: ['email', 'elistId'] })
export class SubscriptionEntity implements ISubscription {
  @PrimaryKey({ type: UuidType, autoincrement: false })
  public id!: string;

  @Property({ fieldName: 'first_name', length: 100 })
  public firstName?: string;

  @Property({ fieldName: 'last_name', length: 100 })
  public lastName?: string;

  @Property({ fieldName: 'company' })
  public company?: string;

  @Property({ nullable: false })
  public email!: string;

  @Property({ fieldName: 'phone_number', length: 10 })
  public phoneNumber?: string;

  @Property({ fieldName: 'phone_country_code', length: 10 })
  public phoneCountryCode?: string;

  @Property({ fieldName: 'user_did_consent', columnType: 'BOOLEAN' })
  public userDidConsent = false;

  @Property({ columnType: 'JSON' })
  public settings?: object;

  @ManyToOne({
    entity: () => ElistEntity,
    fieldName: 'elist_id',
    type: UuidType,
  })
  public elistId!: string;

  constructor(sub: ISubscription) {
    Object.assign(this, sub);
  }
}
