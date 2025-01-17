"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  type PresentationPreview,
  createPresentation,
  getPresentations,
} from "@/lib/supabase/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export function Card(preview: PresentationPreview) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-2 bg-background border p-4 rounded shadow-md">
      <h2 className="text-lg font-bold">{preview.name}</h2>
      <p className="text-sm text-gray-500">
        {preview.description || "No description provided."}
      </p>
      <p className="text-sm text-gray-500">
        Last edited: {new Date(preview.created_at).toUTCString()}
      </p>
      <div className="flex gap-x-2">
        <Button
          onClick={() => router.push(`/app/${preview.path_id}`)}
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
  const [previews, setPreviews] = useState<PresentationPreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPresentations().then((data) => {
      if (typeof data === "string") {
        setError(data);
        return;
      }
      setPreviews(data);
    });
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
                  fd.preventDefault();
                  const formData = new FormData(fd.currentTarget);
                  createPresentation(
                    formData.get("title") as string,
                    formData.get("description") as string
                  ).then((data) => {
                    if (data) {
                      setError(data);
                    }
                  });
                }}
                className="flex flex-col gap-y-2"
              >
                <Input name="title" required placeholder="Title" />
                <Input name="description" placeholder="Description" />
                <DialogClose asChild>
                  <Button type="submit" className="w-1/6">
                    Create
                  </Button>
                </DialogClose>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-3 gap-4">
          {previews.map((preview) => (
            <Card key={preview.path_id} {...preview} />
          ))}
        </div>
      </div>
    </main>
  );
}
