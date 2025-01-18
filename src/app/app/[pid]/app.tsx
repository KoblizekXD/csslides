"use client";

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
import Editor from "@monaco-editor/react";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";

export default function App({
  presentation: defaultPresentation,
}: {
  presentation: Presentation;
}) {
  const { toast } = useToast();
  const [presentation, setPresentation] = useState(defaultPresentation);
  const [currentSlide, setCurrentSlide] = useState<number | undefined>(
    defaultPresentation.slides.length ? 0 : undefined
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
            <MenubarItem onClick={() => savePresentation(presentation)}>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
            <MenubarSeparator />
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
          <Tabs
            defaultValue="html"
            className="w-1/2 overflow-y-auto flex flex-col h-full"
          >
            <TabsList className="self-start">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
            </TabsList>
            <TabsContent className="flex-1" value="html">
              <Editor
                options={{
                  fontFamily: "JetBrains Mono",
                  autoClosingBrackets: "always",
                  minimap: { enabled: false },
                  fontSize: 14,
                  mouseWheelZoom: true,
                }}
                theme="vs-dark"
                defaultLanguage="html"
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
                        html: text || "",
                      };
                      return { ...prev, slides };
                    });
                  }
                }}
              />
            </TabsContent>
            <TabsContent value="styles">
              <Editor
                options={{
                  fontFamily: "JetBrains Mono",
                  autoClosingBrackets: "always",
                  minimap: { enabled: false },
                  fontSize: 14,
                  mouseWheelZoom: true,
                }}
                theme="vs-dark"
                defaultLanguage="html"
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
                        html: text || "",
                      };
                      return { ...prev, slides };
                    });
                  }
                }}
              />
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
