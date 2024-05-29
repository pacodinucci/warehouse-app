import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { sku, brand, description, barCode } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!sku) {
      return new NextResponse("SKU is required", { status: 400 });
    }

    if (!brand) {
      return new NextResponse("Brand is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!barCode) {
      return new NextResponse("Bar code is required", { status: 400 });
    }

    const product = await db.product.create({
      data: {
        sku,
        brand,
        description,
        code: barCode,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
