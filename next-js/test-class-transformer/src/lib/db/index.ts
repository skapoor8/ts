import { ObjectId } from "bson";
import { UserDTO } from "../dtos";
import { IUserSerialized } from "../interfaces";

const data: IUserSerialized[] = [
  {
    // _id: new ObjectId().toString(),
    handle: "dustandsepia",
    created: "2023-11-21T21:42:31.057Z",
    links: [
      {
        displayText: "instagram",
        linkUrl: "https://www.instagram.com",
      },
    ],
  },
];

export const db = data.map((d) => UserDTO.fromSerialized(d));
