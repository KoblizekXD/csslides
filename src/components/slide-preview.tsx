"use client";

import { ArrowLeftToLine, X } from "lucide-react";
import React, {
  type MouseEventHandler,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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
  DialogClose,
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
  preview?: HTMLCanvasElement;
}

export const SlidePreview = ({
  name,
  onSelected,
  selected = false,
  preview,
}: SlidePreviewProps) => {
  return (
    <div
      onClick={onSelected}
      className={`rounded cursor-pointer hover:bg-muted transition-colors duration-200 p-1 select-none ${
        selected && "bg-muted"
      }`}
    >
      <AspectRatio ratio={16 / 9}>
        {!preview && <Skeleton className="w-full h-full" />}
        {preview && <img src={preview.toDataURL()} alt="Wow" />}
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
  ref,
}: {
  children?: React.ReactNode;
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void;
  createSlide?: (name: string) => void;
  ref: React.Ref<{ toggle: () => void }>;
}) => {
  const [dialogOpen, setDialogOpen] = useState(open);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!hidden) {
      setTimeout(() => {
        setRemoved(false);
      }, 200);
    }
  }, [hidden]);

  useEffect(() => {
    if (removed) {
      setTimeout(() => {
        setHidden(true);
      }, 200);
    }
  }, [removed]);

  useImperativeHandle(
    ref,
    () => {
      return {
        toggle() {
          if (!removed) setRemoved(true);
          else setHidden(false);
        },
      };
    },
    [removed]
  );

  useEffect(() => {
    setDialogOpen(open);
  }, [open]);

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            style={{
              width: removed ? "0" : "11rem",
              display: hidden ? "none" : "block",
            }}
            className="flex p-1 gap-y-1 transition-all duration-200 flex-col w-44 rounded border overflow-y-scroll"
          >
            <div className="flex items-center gap-x-1 p-1">
              <span className="font-bold text-sm">Slides</span>
              <span className="ml-auto" onClick={() => setRemoved(true)}>
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
          <DialogTrigger onClick={() => setDialogOpen(true)} asChild>
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
        <DialogClose
          onClick={() => setDialogOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
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
              type="submit"
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
