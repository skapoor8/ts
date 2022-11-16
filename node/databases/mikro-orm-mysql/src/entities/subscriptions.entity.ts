import { Entity, ManyToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { ISubscription } from "../types/subscription";
import { ElistsEntity } from "./elists.entity";

@Entity({tableName: 'subscriptions'})
@Unique({properties: ['email', 'elistId']})
export class SubscriptionsEntity implements ISubscription {

  @PrimaryKey({columnType: 'BINARY(16)', autoincrement: false}) 
  public id!: number;

  @Property({fieldName: 'first_name', length: 100})
  public firstName?: string;

  @Property({fieldName: 'last_name', length: 100})
  public lastName?: string;

  @Property({fieldName: 'company'})
  public company?: string;

  @Property({nullable: false})
  public email!: string;

  @Property({fieldName: 'phone_number', length: 10})
  public phoneNumber?: string;

  @Property({fieldName: 'phone_country_code', length: 10})
  public phoneCountryCode?: string;

  @Property({fieldName: 'user_did_consent'})
  public userDidConsent: boolean = false;

  @Property({columnType: 'JSON'})
  public settings?: object;

  @ManyToOne({entity: () => ElistsEntity, fieldName: 'elist_id', columnType: 'BINARY(16)'})
  public elistId!: number;

  constructor(sub: ISubscription) {
    Object.assign(this, sub);
  }
}