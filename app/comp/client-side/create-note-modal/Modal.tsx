"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NoteCard from "@/app/comp/client-side/NoteCard/page";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";

export default function CreateNoteModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
          Create Note
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-fit overflow-visible">
        <VisuallyHidden>
          <DialogTitle>Notes App</DialogTitle>
        </VisuallyHidden>
        <NoteCard onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
