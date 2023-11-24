"use client";

import { ObjectId } from "bson";
import { UserDTO } from "../dtos";
import { IUserSerialized } from "../interfaces";

export function UserSummary({ summary }: { summary: IUserSerialized }) {
  // let try deserializing here
  // const deserialized = UserDTO.fromSerialized(summary);
  const id = new ObjectId();

  return <div>{JSON.stringify(summary, null, 8)}</div>;
}
