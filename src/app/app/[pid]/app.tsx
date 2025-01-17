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
import { useToast } from "@/hooks/use-toast";
import { type Presentation, savePresentation } from "@/lib/supabase/actions";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";

export default function App({
  presentation: defaultPresentation,
}: {
  presentation: Presentation;
}) {
  const { toast } = useToast();
  const [presentation, setPresentation] = useState(defaultPresentation);
  const [currentSlide, setCurrentSlide] = useState<number | undefined>(0);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        savePresentation(presentation).then((res) => {
          if (res) {
            toast({
              title: "Error! 😢",
              description: res,
            });
          } else {
            toast({
              title: "Success! 🎉",
              description: "I have saved your presentation!",
            });
          }
        });
      }
    };

    window.addEventListener("keydown", onKeydown);

    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [presentation, toast]);

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
          {presentation.slides.map((slide, i) => (
            <SlidePreview
              selected={currentSlide === i}
              name={slide.name}
              key={slide.id}
            />
          ))}
        </SlidePreviewBar>
        <div className="h-full flex-1 flex w-full rounded border p-2">
          <Tabs defaultValue="html" className="w-1/2 h-full">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
            </TabsList>
            <TabsContent value="html">
              <Editor
                defaultValue={
                  currentSlide !== undefined
                    ? presentation.slides[currentSlide].html
                    : ""
                }
                onChange={(text) => {
                  if (currentSlide !== undefined) {
                    setPresentation((prev) => {
                      const slides = [...prev.slides];
                      slides[currentSlide] = {
                        ...slides[currentSlide],
                        html: text,
                      };
                      return { ...prev, slides };
                    });
                  }
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
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{
                  __html:
                    currentSlide !== undefined
                      ? presentation.slides[currentSlide].html
                      : "",
                }}
                ratio={16 / 9}
                className="border rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
