import { SlidePreview, SlidePreviewBar } from "@/components/slide-preview";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeftToLine, Presentation } from "lucide-react";

export default function Page() {
  return (
    <main className="flex p-1 gap-y-1 flex-col h-screen bg-background">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Print</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="flex-1 max-h-full flex gap-x-1">
        <SlidePreviewBar>
          <SlidePreview name="Slide 1" />
        </SlidePreviewBar>
        <div className="flex-1">
          <div className="h-full w-full rounded border"></div>
        </div>
      </div>
    </main>
  );
}
