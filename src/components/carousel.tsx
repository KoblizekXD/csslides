"use client";

import type { Slide } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Button } from "./ui/button";

export function Carousel({
  className,
  slide,
  onSlideChange,
  items = [],
}: {
  className?: string;
  items?: Slide[];
  slide?: number;
  onSlideChange?: (slide: number) => void;
}) {
  const [currentSlide, setCurrentSlide] = useState<number | undefined>(
    items.length === 0 ? undefined : 0
  );

  useEffect(() => {
    if (slide !== undefined) {
      setCurrentSlide(slide);
    }
  }, [slide]);

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentSlide ?? 0);
    }
  }, [currentSlide, onSlideChange]);

  return (
    <div
      className={cn(
        "w-full gap-x-4 p-2 flex items-center justify-center",
        className
      )}
    >
      <Button
        title="Previous slide"
        className="max-w-fit rounded-full"
        onClick={() => {
          setCurrentSlide((prev) =>
            prev === undefined ? undefined : prev - 1
          );
        }}
        disabled={currentSlide === 0 || items.length === 0}
      >
        <ArrowLeft />
      </Button>
      <div className="shadow-xl flex flex-nowrap w-3/4 overflow-x-hidden items-center rounded-xl border">
        {currentSlide === undefined ? (
          <AspectRatio ratio={16 / 9}>
            <div className="flex items-center justify-center h-full text-gray-500">
              No slides
            </div>
          </AspectRatio>
        ) : (
          <AspectRatio
            ratio={16 / 9}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: items[currentSlide].html,
            }}
          />
        )}
      </div>
      <Button
        title="Previous slide"
        className="max-w-fit rounded-full"
        onClick={() => {
          setCurrentSlide((prev) =>
            prev === undefined ? undefined : prev + 1
          );
        }}
        disabled={currentSlide === items.length - 1 || items.length === 0}
      >
        <ArrowRight />
      </Button>
    </div>
  );
}
