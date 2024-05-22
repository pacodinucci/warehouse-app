import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { barCode, qrCode, quantity } = body;

    if (!params.storeId)
      return new NextResponse("storeId is required.", { status: 400 });

    if (!barCode)
      return new NextResponse("barCode is required.", { status: 400 });

    if (!qrCode)
      return new NextResponse("qrCode is required.", { status: 400 });

    if (!quantity)
      return new NextResponse("quantity is required.", { status: 400 });

    const product = await db.product.findUnique({
      where: {
        code: barCode,
      },
    });

    if (!product) {
      return new NextResponse("Product not found.", { status: 404 });
    }

    const section = await db.section.findUnique({
      where: {
        name: qrCode,
      },
    });

    if (!section) {
      return new NextResponse("Section not found.", { status: 404 });
    }

    const productInWarehouse = await db.warehouse.create({
      data: {
        storeId: params.storeId,
        sectionId: section.id,
        productId: product.id,
        quantity,
      },
    });

    return NextResponse.json({ productInWarehouse });
  } catch (error) {
    console.log("[WAREHOUSE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
