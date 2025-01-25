"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  type PresentationPreview,
  enableSharing,
} from "@/lib/supabase/actions";
import { Button } from "./ui/button";

export function ShareDialog({
  presentation,
  onSuccess,
}: {
  presentation: PresentationPreview;
  onSuccess?: () => void;
}) {
  const { toast } = useToast();

  return (
    <Dialog>
      <DialogTrigger className="flex px-2 text-sm font-medium text-black cursor-pointer rounded-md justify-center items-center gap-x-2 bg-white">
        Share
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable sharing</DialogTitle>
          <DialogDescription>
            You can enable sharing for this presentation. This will allow others
            to view it(but not edit it). The results will be always
            up-to-date(once you save your changes).
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(fd) => {
            fd.preventDefault();
            enableSharing(presentation.id).then((data) => {
              if (data) {
                toast({ title: "Error", description: data });
              } else {
                toast({
                  title: "Success!",
                  description: `Your presentation can now be shared with others at /shared/${presentation.path_id}`,
                });
                onSuccess?.();
              }
            });
          }}
          className="flex flex-col gap-y-2">
          <DialogClose asChild>
            <Button type="submit" className="w-1/6">
              Yes please!
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
