"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getProjects, saveProject } from "@/lib/ls-util";
import { randomId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface PresentationInformation {
  title: string;
  description?: string;
  lastEdited: string;
  path?: string;
  slides: Slide[];
}

export interface Slide {
  name: string;
  html: string;
  styles: string;
}

export function Card({
  title,
  description,
  lastEdited,
  path,
}: PresentationInformation) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-2 bg-background border p-4 rounded shadow-md">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
      <p className="text-sm text-gray-500">Last edited: {lastEdited}</p>
      <div className="flex gap-x-2">
        <Button
          onClick={() => router.push(`/app/${path}`)}
          className="flex justify-center"
        >
          Open
        </Button>
        <Button className="flex justify-center">Share</Button>
      </div>
    </div>
  );
}

export function RecentPage() {

  useEffect(() => {
    // <-- or here?
  }, []);

  return (
    <main className="min-h-screen p-20 flex flex-col gap-y-4 bg-background">
      <h1 className="text-3xl font-bold">Recent presentations</h1>
      <hr className="w-full" />
      <div className="flex gap-y-4 flex-col">
        <div className="flex gap-x-2">
          <Input placeholder="Search" />
          <Dialog>
            <DialogTrigger className="flex text-black font-semibold rounded-lg p-2 justify-center items-center gap-x-2 min-w-fit bg-white">
              <Plus />
              Create New
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Presentation</DialogTitle>
                <DialogDescription>
                  You can create a new one from a template or start from
                  scratch. You're the boss!
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(fd) => {
                  const formData = new FormData(fd.currentTarget);
                  saveProject({
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    lastEdited: new Date().toISOString(),
                    path: randomId(),
                    slides: [],
                  });
                }}
                className="flex flex-col gap-y-2"
              >
                <Input name="title" required placeholder="Title" />
                <Input name="description" placeholder="Description" />
                <Button type="submit" className="w-1/6">
                  Create
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {getProjects().map((project) => (
            <Card key={project.path} {...project} />
          ))}
        </div>
      </div>
    </main>
  );
}
