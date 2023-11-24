"use client";

import { ObjectId } from "bson";

export function ClientComponent() {
  return (
    <div>Client component with object id: {new ObjectId().toString()}</div>
  );
}
