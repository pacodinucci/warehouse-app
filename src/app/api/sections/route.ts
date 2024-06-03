import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, qrCode, storeId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!qrCode) {
      return new NextResponse("QR is required", { status: 400 });
    }

    const section = await db.section.create({
      data: {
        name,
        qrCode,
        storeId,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.log("[SECTION_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");

  if (!sectionId) {
    return new NextResponse("sectionId is required", { status: 400 });
  }

  try {
    const section = await db.section.findFirst({
      where: {
        id: sectionId,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Error fetching section:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");

  if (!sectionId) {
    return new NextResponse("sectionId is required", { status: 400 });
  }

  try {
    const sectionDeleted = await db.section.delete({
      where: {
        id: sectionId,
      },
    });

    if (!sectionDeleted) {
      return new NextResponse("Section could not be deleted", { status: 400 });
    }

    return new NextResponse("Section deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting section", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
