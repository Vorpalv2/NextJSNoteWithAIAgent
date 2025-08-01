import { PrismaClient } from "@/app/generated/prisma";
import { NextResponse, NextRequest } from "next/server";
import { cors, handleCORS } from "@/app/api/cors";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  let body = await req.json();
  let title = body.title;
  let note = body.note;

  try {
    if (!title || !note) {
      return NextResponse.json(
        { status: "error", message: "field cannot be empty" },
        { status: 400, headers: cors(req) }
      );
    }

    const newNote = await prisma.notes.create({
      data: {
        title,
        note,
      },
    });
    return NextResponse.json(
      { status: "success", note: newNote },
      { status: 200, headers: cors(req) }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: (error as Error).message,
      },
      { status: 500, headers: cors(req) }
    );
  }
}
export async function GET(req: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const allNotes = await prisma.notes.findMany();

    console.log("fetched successfully");
    return NextResponse.json(
      {
        status: "success",
        message: allNotes,
      },
      { headers: cors(req) }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: (error as Error).message,
      },
      { headers: cors(req) }
    );
  }
}
export async function PUT(req: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    let body = await req.json();
    let id = body.id;
    let title = body.title;
    let note = body.note;

    if (!title || !note) {
      return NextResponse.json(
        {
          status: "error",
          message: "fields cannot be empty",
        },
        { status: 500, headers: cors(req) }
      );
    }

    const updatedData = await prisma.notes.update({
      where: {
        id,
      },
      data: {
        title,
        note,
      },
    });
    return NextResponse.json(
      {
        status: "success",
        message: updatedData,
      },
      { status: 200, headers: cors(req) }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: (error as Error).message,
      },
      { status: 500, headers: cors(req) }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        {
          status: "error",
          message: "id is required",
        },
        { status: 400, headers: cors(req) }
      );
    }

    const deletedNote = await prisma.notes.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        status: "success",
        message: deletedNote,
      },
      { status: 200, headers: cors(req) }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: (error as Error).message,
      },
      { status: 500, headers: cors(req) }
    );
  }
}
