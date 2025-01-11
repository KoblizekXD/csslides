"use client";

import { Editor } from "@/components/editor";
import { SlidePreview, SlidePreviewBar } from "@/components/slide-preview";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getById, replaceProject } from "@/lib/ls-util";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { PresentationInformation } from "../recent/recent";

export interface Slide {
  name: string;
  html: string;
  styles: string;
}

export default function App({ id }: { id: string }) {
  const [presentation, setPresentation] = useState<
    PresentationInformation | undefined
  >(undefined);
  const [html, setHtml] = useState("");

  useEffect(() => {
    setPresentation(getById(id));
  }, []);

  useEffect(() => {
    if (!presentation) return;
    replaceProject(presentation);
    setHtml(presentation.html);
  }, [presentation]);

  return (
    <main className="flex p-1 gap-y-1 flex-col h-screen bg-background">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Presentation <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>New Slide</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Print</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Close Presentation</MenubarItem>
            <MenubarItem className="text-red-400">Exit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Layout</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Help</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <div className="flex-1 max-h-full flex gap-x-1">
        <SlidePreviewBar>
          <SlidePreview name="Slide 1" />
        </SlidePreviewBar>
        <div className="h-full flex-1 flex w-full rounded border p-2">
          <Tabs defaultValue="html" className="w-1/2 h-full">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
            </TabsList>
            <TabsContent value="html">
              <Editor
                defaultValue={html}
                onChange={(text) => {
                  setPresentation((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      html: text,
                    };
                  });
                }}
              />
            </TabsContent>
            <TabsContent value="styles">
              <Editor />
            </TabsContent>
          </Tabs>
          <hr className="border-l stroke-muted-foreground h-full" />
          <div className="flex flex-1 px-2 flex-col">
            <div className="flex">
              <h1 className="text-2xl font-extrabold">Preview</h1>
              <Button className="ml-auto bg-green-600 hover:bg-muted text-white flex justify-center">
                <Play />
                Present
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <AspectRatio
                dangerouslySetInnerHTML={{ __html: html }}
                ratio={16 / 9}
                className="border rounded"
              ></AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
