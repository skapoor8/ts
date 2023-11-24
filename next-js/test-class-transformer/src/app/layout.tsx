import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex flex-col w-screen h-screen items-stretch divide-y`}
      >
        <div className="flex flex-row h-[3rem] p-2 items-center">linktree</div>
        <div className="flex-1 flex flex-col overflow-y-scroll">{children}</div>
      </body>
    </html>
  );
}