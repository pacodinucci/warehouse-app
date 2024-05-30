import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("storeId is required.", { status: 400 });
    }

    const sections = await db.section.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    if (!sections) {
      return new NextResponse("No sections found.", { status: 404 });
    }

    return NextResponse.json(sections);
  } catch (error) {
    console.error("[SECTION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
