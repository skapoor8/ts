import { ObjectId } from "bson";

export interface IUserLink {
  displayText: string;
  linkUrl: string;
}

export interface IUserSerialized {
  _id: string;
  handle: string;
  created: string;
  links: IUserLink[];
}

export interface IUserDTO {
  _id: ObjectId;
  handle: string;
  created: Date;
  links: IUserLink[];
}
