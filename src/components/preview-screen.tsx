"use client";

import type { Presentation } from "@/lib/supabase/actions";
import { clamp, cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, GripVertical, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FullscreenPresentor } from "./fullscreen-presentor";

interface PreviewScreenProps {
  className?: string;
  onClose?: () => void;
  presentation: Presentation;
  startAt?: number;
}

export function PreviewScreen({
  className,
  onClose,
  presentation,
  startAt = 0,
}: PreviewScreenProps) {
  const [startAtSlide, setStartAtSlide] = useState(startAt);
  const [fsPresenting, setFsPresenting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      const shadowRoot = previewRef.current.shadowRoot
        ? previewRef.current.shadowRoot
        : previewRef.current.attachShadow({
            mode: "open",
          });
      shadowRoot.innerHTML = presentation.slides[startAtSlide].html;
    }
  }, [startAtSlide, presentation]);

  return (
    <>
      {fsPresenting && (
        <FullscreenPresentor
          slides={presentation.slides}
          disableFullscreen={() => {
            setFsPresenting(false);
          }}
        />
      )}
      <div className="fixed inset-0 bg-black bg-opacity-90 z-40" />
      <div className="absolute text-muted-foreground gap-x-2 flex p-1 border brightness-50 border-muted left-1/2 top-3 items-center -translate-x-1/2 rounded bg-background z-60">
        <GripVertical
          size={20}
          className="stroke-muted-foreground brightness-75"
        />
        <span className="cursor-pointer" title="Start presentation">
          <Play
            size={20}
            onClick={() => {
              document.documentElement.requestFullscreen();
              setFsPresenting(true);
            }}
          />
        </span>
        <X
          onClick={onClose}
          className="hover:bg-muted cursor-pointer stroke-muted-foreground rounded brightness-75 transition-colors"
          size={28}
        />
        <span className="brightness-75">
          Slide: {presentation.slides[startAtSlide].name}
        </span>
      </div>
      <div
        className={cn(
          "absolute transition-opacity flex w-5/6 border-muted border top-1/2 left-1/2 rounded-xl shadow-sm -translate-x-1/2 -translate-y-1/2 aspect-video bg-black z-50",
          className,
        )}>
        <div
          onClick={() =>
            setStartAtSlide((prev) =>
              clamp(prev - 1, 0, presentation.slides.length - 1),
            )
          }
          title="Previous slide"
          className="absolute transition-colors p-1 hover:bg-muted top-1/2 rounded-full cursor-pointer -left-16 bg-background border border-muted">
          <ArrowLeft size={28} className="stroke-muted-foreground" />
        </div>
        <div ref={previewRef} className="flex-1 m-1" />
        <div
          onClick={() =>
            setStartAtSlide((prev) =>
              clamp(prev + 1, 0, presentation.slides.length - 1),
            )
          }
          title="Next slide"
          className="absolute transition-colors p-1 hover:bg-muted top-1/2 rounded-full cursor-pointer -right-16 bg-background border border-muted">
          <ArrowRight size={28} className="stroke-muted-foreground" />
        </div>
      </div>
    </>
  );
}
