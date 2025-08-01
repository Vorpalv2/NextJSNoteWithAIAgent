"use server";

import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function NoteAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const note = formData.get("note") as string;

    if (!title || !note) {
      throw new Error("Title and note are required");
    }

    const newNote = await prisma.notes.create({
      data: {
        title,
        note,
      },
    });

    console.log("Note created:", newNote);
    return { success: true, data: newNote };
  } catch (error) {
    console.error("Error creating note:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export { NoteAction };

export async function GetAllNotes() {
  try {
    const allNotes = await prisma.notes.findMany();

    return {
      success: true,
      message: allNotes,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to fetch Notes",
    };
  }
}
