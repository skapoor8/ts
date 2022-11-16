import { Entity, ManyToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { IElist } from "../types/elist";
import { UsersEntity } from "./users.entity";

@Entity({tableName: 'elists'})
@Unique({properties: ['elistName', 'ownerId']})
export class ElistsEntity implements IElist {

  @PrimaryKey({columnType: 'BINARY(16)', autoincrement: false}) 
  public id!: number;

  @Property({fieldName: 'elist_name', length: 255})
  public elistName!: string;

  @Property({columnType: 'JSON', nullable: true}) 
  public settings?: object;

  @Property({fieldName: 'default_settings', columnType: 'JSON', nullable: true}) 
  public deafultSettings?: object;

  @ManyToOne({entity: () => UsersEntity, fieldName: 'owner_id', columnType: 'BINARY(16)'}) 
  ownerId!: number;


  constructor(elist: IElist) {
    Object.assign(this, elist);
  }



}