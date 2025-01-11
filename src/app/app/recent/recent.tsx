"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export interface PresentationInformation {
  title: string;
  description?: string;
  lastEdited: string;
  path?: string;
}

export function Card({ title, description, lastEdited }: PresentationInformation) {
  return (
    <div className="flex flex-col gap-y-2 bg-background border p-4 rounded shadow-md">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
      <p className="text-sm text-gray-500">Last edited 2 days ago</p>
      <div className="flex gap-x-2">
        <Button className="flex justify-center">Open</Button>
        <Button className="flex justify-center">Share</Button>
      </div>
    </div>
  );
}

export function RecentPage() {
  return (
    <main className="min-h-screen p-20 flex flex-col gap-y-4 bg-background">
      <h1 className="text-3xl font-bold">Recent presentations</h1>
      <hr className="w-full" />
      <div className="flex gap-y-4 flex-col">
        <div className="flex gap-x-2">
          <Input placeholder="Search" />
          <Button className="flex justify-center">
            <Plus />
            Create New
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card title="Hehe" lastEdited="kys" description="Cus" />
        </div>
      </div>
    </main>
  );
}
