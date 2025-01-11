"use client";

import { ArrowLeftToLine } from "lucide-react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useEffect, useState } from "react";

interface SlidePreviewProps {
  name: string;
}

export const SlidePreview = ({ name }: SlidePreviewProps) => {
  return (
    <div className="rounded cursor-pointer hover:bg-muted transition-colors duration-200 p-1 select-none">
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
    <div style={{
      width: hidden ? "0" : "default",
      display: removed ? "none" : "default",
    }} className="flex p-1 transition-all duration-200 flex-col w-44 rounded border overflow-y-scroll">
      <div className="flex items-center gap-x-1 p-1">
        <span className="font-bold text-sm">Slides</span>
        <span className="ml-auto" onClick={() => setHidden(!hidden)}>
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
