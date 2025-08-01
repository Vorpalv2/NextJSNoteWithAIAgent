"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save } from "lucide-react";
import type { NoteCardType } from "@/app/types/notecard.type";

interface NoteCardProps {
  onSuccess?: () => void;
}

const NoteCard = ({ onSuccess }: NoteCardProps) => {
  const [noteData, setNoteData] = useState<NoteCardType>({
    title: "",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error("failed to save note");
      }

      const data = await response.json();
      setNoteData({ title: "", note: "" });

      // Call onSuccess callback to close modal
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function onChangeHandler(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNoteData((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <Card className="w-96 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-center justify-center">
          <PlusCircle className="h-5 w-5" />
          Create New Note
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              type="text"
              placeholder="Enter note title..."
              onChange={onChangeHandler}
              id="title"
              name="title"
              value={noteData.title}
              className="focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium">
              Note Content
            </Label>
            <Textarea
              name="note"
              rows={6}
              onChange={onChangeHandler}
              id="note"
              value={noteData.note}
              placeholder="Write your note here..."
              className="resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={
                isLoading || !noteData.title.trim() || !noteData.note.trim()
              }
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Note
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
