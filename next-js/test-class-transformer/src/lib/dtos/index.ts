import { IUserDTO, IUserLink, IUserSerialized } from "./../interfaces/index";
import { Transform, plainToInstance, instanceToPlain } from "class-transformer";
import { ObjectId } from "bson";

export class UserDTO implements IUserDTO {
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  @Transform(({ value }) => new ObjectId(value), { toClassOnly: true })
  _id: ObjectId = new ObjectId();

  handle: string = "";

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  created: Date = new Date();

  links: IUserLink[] = [];

  static fromSerialized(serialized: IUserSerialized): UserDTO {
    return plainToInstance(UserDTO, serialized);
  }

  toSerialized(): IUserSerialized {
    return instanceToPlain(this) as IUserSerialized;
  }
}

// import { ICollaborator, IPostEntity } from '@berylion/readership-db';
// import { JSONContent } from '@tiptap/core';
// import { ObjectId } from 'bson';
// // import { BaseDTO } from './base';
// import {
//   Expose,
//   Transform,
//   Type,
//   instanceToPlain,
//   plainToClass,
// } from 'class-transformer';

// type Constructor<T> = { new (): T };

// export class PostSummaryDTO {
//   // @Expose({ name: 'id' })
//   @Transform(({ value }) => value.toString(), { toPlainOnly: true })
//   @Transform(({ value }) => new ObjectId(value), { toClassOnly: true })
//   _id: ObjectId = new ObjectId();

//   get id() {
//     return this._id.toString();
//   }

//   @Expose()
//   @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
//   get created() {
//     return (this._id ?? new ObjectId()).getTimestamp();
//   }

//   @Transform(({ value }) => new Date(value), { toClassOnly: true })
//   @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
//   updated!: Date;

//   @Transform(({ value }) => value.toString(), { toPlainOnly: true })
//   @Transform(({ value }) => new ObjectId(value), { toClassOnly: true })
//   authorId: ObjectId = new ObjectId();

//   // collaborators?: ICollaborator[] | undefined;

//   @Type(() => ObjectId)
//   @Transform(({ value }) => value.toString(), { toPlainOnly: true })
//   seriesId?: ObjectId | undefined;

//   @Transform(({ value }) => value.toString(), { toPlainOnly: true })
//   @Transform(({ value }) => new ObjectId(value), { toClassOnly: true })
//   publicationId?: string | undefined;

//   title: string = '';

//   // @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
//   // @Transform(({ value }) => JSON.stringify(value), { toPlainOnly: true })
//   body: any = { title: '', body: [] };

//   tags?: string[] | undefined;

//   coverImageUrl?: string | undefined;

//   /**
//    * Creates an array of instances of the DTO class from a deserialized object returned by JSON.parse
//    * @param data
//    * @returns
//    */
//   public static fromPlainArray(
//     this: Constructor<PostSummaryDTO>,
//     data: object[]
//   ): PostSummaryDTO[] {
//     return data.map((d) => PostSummaryDTO.fromPlain(d));
//   }

//   /**
//    * Creates an instance of DTO class from a deserialzied object returned by JSON.parse
//    * @param data
//    * @returns
//    */
//   public static fromPlain(
//     this: Constructor<PostSummaryDTO>,
//     data: object
//   ): PostSummaryDTO {
//     return plainToClass(this, data);
//   }

//   /* Converts class instance into a simple object that can be easily serialized by JSON.stringify
//    * @returns
//    */
//   public toPlain(): object {
//     return instanceToPlain(this);
//   }
// }
