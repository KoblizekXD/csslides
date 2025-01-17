"use client";

import { ArrowLeftToLine } from "lucide-react";
import { type MouseEventHandler, useEffect, useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SlidePreviewProps {
  name: string;
  onSelected?: MouseEventHandler;
  selected?: boolean;
}

export const SlidePreview = ({
  name,
  onSelected,
  selected = false,
}: SlidePreviewProps) => {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
      onClick={onSelected}
      className={`rounded cursor-pointer hover:bg-muted transition-colors duration-200 p-1 select-none ${selected && "bg-muted"}`}
    >
      <AspectRatio ratio={16 / 9}>
        <Skeleton className="w-full h-full" />
      </AspectRatio>
      <span className="text-xs text-muted-foreground">{name}</span>
    </div>
  );
};

export const SlidePreviewBar = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (hidden) {
      setTimeout(() => {
        setRemoved(true);
      }, 200);
    } else {
      setRemoved(false);
    }
  }, [hidden]);

  return (
    <div
      style={{
        width: hidden ? "0" : "default",
        display: removed ? "none" : "default",
      }}
      className="flex p-1 transition-all duration-200 flex-col w-44 rounded border overflow-y-scroll"
    >
      <div className="flex items-center gap-x-1 p-1">
        <span className="font-bold text-sm">Slides</span>
        <span className="ml-auto" onKeyDown={() => setHidden(!hidden)}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ArrowLeftToLine size={16} strokeWidth={3} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Hide slides</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </div>
      {children}
    </div>
  );
};
