import { UserSummary } from "@/lib/components/user-summary";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

function getData(handle: string) {
  try {
    console.log("searching for handle:", handle);
    const data = db.find((item) => item.handle === handle);
    // const serialized = PostSummaryDTO.fromPlainArray(data);
    // return serialized;
    if (!data) notFound();
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default function Page({
  params: { handle },
}: {
  params: { handle: string };
}) {
  const user = getData(handle);
  return (
    <main className="flex flex-col items-center justify-center flex-1">
      <div className="flex flex-row gap-2">This is user page</div>
      <UserSummary summary={user.toSerialized()}></UserSummary>
    </main>
  );
}
