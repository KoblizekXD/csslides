"use client";

import { ArrowLeftToLine } from "lucide-react";
import React, { type MouseEventHandler, useEffect, useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

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
    <div
      onClick={onSelected}
      className={`rounded cursor-pointer hover:bg-muted transition-colors duration-200 p-1 select-none ${
        selected && "bg-muted"
      }`}
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
  open,
  onOpenChange,
  createSlide,
}: {
  children?: React.ReactNode;
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void;
  createSlide?: (name: string) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(open);
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

  useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            style={{
              width: hidden ? "0" : "default",
              display: removed ? "none" : "default",
            }}
            className="flex p-1 gap-y-1 transition-all duration-200 flex-col w-44 rounded border overflow-y-scroll">
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
        </ContextMenuTrigger>
        <ContextMenuContent>
          <DialogTrigger asChild>
            <ContextMenuItem>
              New Slide <ContextMenuShortcut>⌘N</ContextMenuShortcut>
            </ContextMenuItem>
          </DialogTrigger>
          <ContextMenuItem onClick={() => setHidden(!hidden)}>
            Hide
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <DialogContent>
        <form className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create New Slide</DialogTitle>
          </DialogHeader>
          <Input
            name="name"
            defaultValue={`Slide ${React.Children.count(children) + 1}`}
          />
          <DialogFooter>
            <Button
              formAction={(fd) => {
                createSlide?.(fd.get("name") as string);
                setDialogOpen(false);
              }}
              type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
