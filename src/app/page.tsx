"use client";

import { Button } from "@/components/ui/button";
import { Presentation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="max-h-screen overflow-y-hidden flex flex-col w-full">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" />
      <nav className="border-b gap-x-4 flex border-muted backdrop-blur-sm p-4">
        <Link
          href={"/"}
          className="text-2xl flex items-center justify-center gap-x-2 font-semibold font-[Cabin]"
        >
          <Presentation />
          <span className="-translate-y-0.5">csslides</span>
        </Link>
        <div className="ml-auto flex items-center justify-center gap-x-4">
          <Link
            href={"/login"}
            className="hover:scale-105 transition-transform"
          >
            Sign in
          </Link>
          <Link
            href={"/signup"}
            className="text-emerald-400 transition-transform hover:scale-105 font-semibold"
          >
            Sign up
          </Link>
          <Link
            target="_blank"
            className="hover:scale-105 transition-transform"
            href={"https://github.com/KoblizekXD/csslides"}
          >
            <svg
              width={24}
              height={24}
              className="fill-foreground"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Link>
        </div>
      </nav>
      <div className="flex-1 px-20 flex flex-col font-[Cabin]">
        <div className="mt-44 flex flex-col gap-y-3">
          <h1 className="text-6xl font-semibold">
            Create elegant persentations
          </h1>
          <h1 className="text-4xl font-semibold">
            Using html, css and tailwind*
          </h1>
          <h2 className="text-gray-500">*Tailwind support soon</h2>
        </div>
        <div className="mt-36 flex-1 p-2 overflow-y-hidden flex flex-col font-sans">
          <Button
            onClick={() => {
              router.push("/app");
            }}
            className="cursor-pointer absolute w-32 hover:scale-110 transition-transform rounded-lg"
          >
            Let me in!
          </Button>
          <Image
            className="ml-auto border scale-90 rounded-xl overflow-y-hidden"
            src={"/image.png"}
            alt="this"
            width={1360}
            height={720}
          />
        </div>
      </div>
    </main>
  );
}
