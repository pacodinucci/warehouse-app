import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, qrCode } = body;

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
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.log("[SECTION_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
