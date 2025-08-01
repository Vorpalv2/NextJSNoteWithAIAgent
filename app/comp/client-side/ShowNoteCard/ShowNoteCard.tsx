"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Edit, Minus, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { NoteCardType } from "@/app/types/notecard.type";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function ShowNoteCard({ props }: { props: NoteCardType }) {
  const constraintRef = useRef(null);

  const router = useRouter();
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [isTextDisabled, setIsTextDisabled] = useState<boolean>(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isCheckButtonDisabled, setIsCheckButtonDisabled] =
    useState<boolean>(true);
  const [updatedNote, setUpdatedNote] = useState<{
    title: string;
    note: string;
  }>({
    title: "test",
    note: "test",
  });

  function onEditChange(note: NoteCardType) {
    setEditingNoteId(note.id ?? null);
    setUpdatedNote({ title: note.title, note: note.note });
    setIsButtonDisabled(true);
    setIsTextDisabled(false);
    setIsCheckButtonDisabled(false);
  }

  async function onDeleteHandler() {
    try {
      const response = await fetch("/api/v1/notes", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id: props.id }),
      });
      // Optionally: Remove this note from the UI or refresh the page

      if (response.ok) {
        router.refresh();
        console.log(`Deleted note with ID: ${props.id}`);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  function onChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setUpdatedNote((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }

  async function updateHandler(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setIsButtonDisabled(false);
      setIsTextDisabled(true);
      setIsCheckButtonDisabled(true);
      const Response = await fetch("/api/v1/notes", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id: props.id, ...updatedNote }),
      });

      if (!Response.ok) {
        throw new Error("something went wrong while trying to update the note");
      } else {
        console.log("page refreshed");

        router.refresh();
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  const isEditing = editingNoteId === props.id;

  useEffect(() => {
    if (isEditing) {
      setUpdatedNote({ title: props.title, note: props.note });
    }
  }, [isEditing, props.title, props.note]);

  return (
    <motion.div ref={constraintRef}>
      <motion.div
        key={props.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        drag
        dragConstraints={constraintRef}
        dragElastic={0.5}
      >
        <form onSubmit={updateHandler}>
          <Card className="w-[16vw] h-[40vh] bg-white border-2 border-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-200 ease-in-out rounded-2xl overflow-hidden">
            {/* macOS-style buttons */}
            <div className="flex items-center pl-2">
              <Button
                // onSubmit={onDeleteHandler}
                size="sm"
                type="button"
                value={"close"}
                name="action"
                onClick={onDeleteHandler}
                className="w-6 h-6 rounded-full bg-red-400 hover:bg-red-500 border-0 p-0 min-w-0"
              >
                <X className="w-2 h-2 text-red-800" />
              </Button>

              <Button
                size="sm"
                className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 border-0 p-0 min-w-0"
              >
                <Minus className="w-2 h-2 text-yellow-800" />
              </Button>
              <Button
                onClick={() => onEditChange(props)}
                disabled={isButtonDisabled}
                size="sm"
                className="w-6 h-6 rounded-full bg-green-400 hover:bg-green-500 border-0 p-0 min-w-0"
              >
                <Edit className="w-2 h-2 text-green-800" />
              </Button>
              <Button
                size="sm"
                className="w-8 h-8 rounded-full bg-white border-0 p-0 min-w-0"
              >
                <input
                  disabled
                  className="w-4 h-4 text-black"
                  value={props.id}
                />
              </Button>
              {isEditing && !isCheckButtonDisabled && (
                <Button
                  type="submit"
                  name="action"
                  value="edit"
                  className="w-6 h-6 ml-18 rounded-full bg-blue-400 hover:bg-blue-500 border-0 p-0 min-w-0"
                >
                  <Check className="w-2 h-2 text-blue-800" />
                </Button>
              )}
            </div>

            <CardContent className="h-full flex flex-col">
              <div>
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  disabled={isTextDisabled}
                  type="text"
                  onChange={onChange}
                  value={!isEditing ? props.title : updatedNote.title}
                  placeholder="Enter title..."
                  className={` ${
                    !isEditing || isTextDisabled
                      ? `bg-gray-900 text-white`
                      : `bg-yellow-100`
                  } border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500`}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <Label
                  htmlFor="note"
                  className="text-sm font-medium text-gray-700"
                >
                  Note
                </Label>
                <textarea
                  id="note"
                  name="note"
                  disabled={isTextDisabled}
                  placeholder="Enter note..."
                  value={!isEditing ? props.note : updatedNote.note}
                  onChange={onChange}
                  className={`flex-1 w-full placeholder:pl-2 ${
                    !isEditing || isTextDisabled
                      ? `bg-gray-400 text-white`
                      : `bg-white`
                  } border-2 border-gray-300 rounded-md focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none resize-none`}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </motion.div>
  );
}
