import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json(
    {
      status: "success",
      message: "working",
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  const title = await req.json();

  if (!title) {
    return NextResponse.json(
      {
        status: "error",
        message: "field cannot be empty",
      },
      { status: 500 }
    );
  }

  const findFirst = await prisma.notes.findFirst({
    where: {
      title,
    },
  });
  console.log("note found", findFirst);
  // console.log(findFirst);

  return NextResponse.json(
    {
      status: "success",
      note: findFirst,
    },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { title } = body;
    console.log(title);

    if (!title) {
      return NextResponse.json(
        {
          status: false,
          message: "title cannot be empty",
        },
        { status: 400 }
      );
    }

    const note = await prisma.notes.findFirst({
      where: {
        title: {
          contains: title,
        },
      },
    });

    const deletedNote = await prisma.notes.delete({
      where: {
        id: note?.id,
      },
    });

    console.log(`${deletedNote.id} successfully deleted`);
    return NextResponse.json(
      {
        status: true,
        message: deletedNote,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
