import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1">
      <div className="flex flex-row gap-2">
        <input type="text" className="p-2" placeholder="Search..." />
        <button className="p-2 bg-green-700 text-white">Go</button>
      </div>
    </main>
  );
}
