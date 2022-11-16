import { Entity, Index, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { IUser } from "../types/user";

@Entity({tableName: 'users'})
export class UsersEntity implements IUser {

  @PrimaryKey({columnType: 'BINARY(16)', autoincrement: false})
  public id!: number;

  @Property({fieldName: 'first_name', length: 100, nullable: true})
  public firstName?: string;

  @Property({fieldName: 'last_name', length: 100, nullable: true})
  public lastName?: string;

  @Property({fieldName: 'phone_number', length: 20, nullable: true})
  public phoneNumber?: string;

  @Property({fieldName: 'phone_country_code', length: 10, nullable: true})
  public countryCode?: string;

  @Property({length: 255})
  @Unique()
  @Index()
  public email!: string;

  constructor(user: IUser) {
    Object.assign(this, user);
  }
}