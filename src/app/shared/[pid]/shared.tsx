"use client";

import { Carousel } from "@/components/carousel";
import { FullscreenPresentor } from "@/components/fullscreen-presentor";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Presentation } from "@/lib/supabase/actions";
import { ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SharedPresentationPreview({
  presentation,
}: {
  presentation: Presentation;
}) {
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPresenting(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <main className="h-screen flex flex-col w-full p-2">
      {isPresenting && (
        <FullscreenPresentor
          slides={presentation.slides}
          disableFullscreen={() => setIsPresenting(false)}
        />
      )}
      <nav className="flex self-start w-full items-center justify-between">
        <Button
          onClick={() => {
            document.documentElement.requestFullscreen();
            setIsPresenting(true);
          }}
          className="flex"
        >
          <Play />
          Present
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="absolute top-4 left-1/2 -translate-x-1/2">
              {presentation.name}
            </TooltipTrigger>
            <TooltipContent>
              <p>{presentation.description || "No description provided."}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link
          href={"/"}
          className="text-gray-500 gap-x-2 underline flex items-center"
        >
          Home
          <ExternalLink size={16} />
        </Link>
      </nav>
      <Carousel items={presentation.slides} className="flex-1" />
    </main>
  );
}
