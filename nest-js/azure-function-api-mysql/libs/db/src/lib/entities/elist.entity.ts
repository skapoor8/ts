import {
  Collection,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  ref,
  Ref,
  Unique,
  wrap,
} from '@mikro-orm/core';
import { IElist } from '@azure-function-api-mysql/interfaces';
import { UserEntity } from './user.entity';
import { UuidType } from '../custom-types';

@Entity({ tableName: 'elists' })
@Unique({ properties: ['elistName', 'owner'] })
export class ElistEntity implements Omit<IElist, 'ownerId'> {
  @PrimaryKey({ type: UuidType, autoincrement: false })
  public id!: string;

  @Property({ fieldName: 'elist_name', length: 255 })
  public elistName!: string;

  @Property({ columnType: 'JSON', nullable: true })
  public settings?: object;

  @Property({
    fieldName: 'default_settings',
    columnType: 'JSON',
    nullable: true,
  })
  public defaultSettings?: object;

  @ManyToOne({
    entity: () => UserEntity,
    fieldName: 'owner_id',
    type: UuidType,
    // serializer: (value) => (wrap(value).isInitialized() ? value : null),
  })
  owner: Ref<UserEntity>;

  constructor(elist: Partial<IElist>) {
    const ownerId = elist.ownerId;

    // wrap owner in ref
    if (ownerId) {
      delete elist.ownerId;
      this.owner = ref(UserEntity, ownerId);
    }

    Object.assign(this, elist);
  }

  toJSON(...args: any[]): Record<string, any> {
    /** todo: too hacky */
    const { id, elistName, settings, defaultSettings } = this;

    const common = {
      id,
      elistName,
      settings,
      defaultSettings,
    };
    let obj;

    if (wrap(this.owner).isInitialized()) {
      obj = {
        ...common,
        owner: this.owner.toJSON(),
      };
    } else {
      obj = {
        ...common,
        ownerId: this.owner.id,
      };
    }

    return obj;
  }
}
