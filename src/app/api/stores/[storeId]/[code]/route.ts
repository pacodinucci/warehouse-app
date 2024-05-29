import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    if (!params.code) {
      return new NextResponse("Code is required", { status: 400 });
    }

    const product = await db.product.findUnique({
      where: {
        code: params.code,
      },
      include: {
        Warehouse: {
          include: {
            Section: true,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
