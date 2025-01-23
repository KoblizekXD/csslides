"use client";

import { Carousel } from "@/components/carousel";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Presentation } from "@/lib/supabase/actions";
import { clamp } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SharedPresentationPreview({
  presentation,
}: {
  presentation: Presentation;
}) {
  const [isPresenting, setIsPresenting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number | undefined>(
    presentation.slides.length === 0 ? undefined : 0
  );

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setCurrentSlide((prev) =>
          prev === undefined
            ? undefined
            : clamp(prev + 1, 0, presentation.slides.length - 1)
        );
      } else if (event.key === "ArrowLeft") {
        setCurrentSlide((prev) =>
          prev === undefined
            ? undefined
            : clamp(prev - 1, 0, presentation.slides.length - 1)
        );
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPresenting(false);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [presentation]);

  return (
    <main className="h-screen flex flex-col w-full p-2">
      {isPresenting && (
        <div className="fixed left-0 top-0 bg-black right-0 bottom-0 z-50">
          <AspectRatio
            ratio={16 / 9}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: presentation.slides[currentSlide ?? 0].html,
            }}
          />
        </div>
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
