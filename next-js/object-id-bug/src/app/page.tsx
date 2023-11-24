import { ObjectId } from "bson";
import Image from "next/image";
import { ClientComponent } from "./ClientComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div>
        {`Here's object id generated in server component ${new ObjectId().toString()}`}
      </div>
      <ClientComponent></ClientComponent>
    </main>
  );
}
