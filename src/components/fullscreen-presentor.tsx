"use client";

import type { Slide } from "@/lib/supabase/actions";
import { clamp } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";

interface FullscreenPresentorProps {
  slides: Slide[];
  disableFullscreen?: () => void;
}

export function FullscreenPresentor({
  slides,
  disableFullscreen,
}: FullscreenPresentorProps) {
  const shadowRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState<number | undefined>(
    slides ? 0 : undefined
  );

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setCurrentSlide((prev) =>
          prev === undefined ? undefined : clamp(prev + 1, 0, slides.length - 1)
        );
      } else if (event.key === "ArrowLeft") {
        setCurrentSlide((prev) =>
          prev === undefined ? undefined : clamp(prev - 1, 0, slides.length - 1)
        );
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        disableFullscreen?.();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [slides, disableFullscreen]);

  useEffect(() => {
    if (shadowRef.current && currentSlide !== undefined) {
      const shadowRoot = shadowRef.current.shadowRoot
        ? shadowRef.current.shadowRoot
        : shadowRef.current.attachShadow({
            mode: "open",
          });
      shadowRoot.innerHTML = slides[currentSlide].html;
    }
  }, [currentSlide, slides]);

  return (
    <div className="fixed left-0 top-0 bg-black right-0 bottom-0 z-[100]">
      <AspectRatio ratio={16 / 9} ref={shadowRef} />
    </div>
  );
}
