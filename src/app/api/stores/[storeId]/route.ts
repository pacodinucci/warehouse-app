import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   try {
//     const body = await req.json();
//     const { barCode, qrCode, quantity } = body;

//     if (!params.storeId)
//       return new NextResponse("storeId is required.", { status: 400 });

//     if (!barCode)
//       return new NextResponse("barCode is required.", { status: 400 });

//     if (!qrCode)
//       return new NextResponse("qrCode is required.", { status: 400 });

//     if (!quantity)
//       return new NextResponse("quantity is required.", { status: 400 });

//     const product = await db.product.findUnique({
//       where: {
//         code: barCode,
//       },
//     });

//     if (!product) {
//       return new NextResponse("Product not found.", { status: 404 });
//     }

//     const section = await db.section.findUnique({
//       where: {
//         name: qrCode,
//       },
//     });

//     if (!section) {
//       return new NextResponse("Section not found.", { status: 404 });
//     }

//     const productInWarehouse = await db.warehouse.create({
//       data: {
//         storeId: params.storeId,
//         sectionId: section.id,
//         productId: product.id,
//         quantity,
//       },
//     });

//     return NextResponse.json({ productInWarehouse });
//   } catch (error) {
//     console.log("[WAREHOUSE_POST]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const body = await req.json();
  const { barCode, qrCode, quantity } = body;

  try {
    const product = await db.product.findUnique({
      where: {
        code: barCode,
      },
    });

    if (!product)
      return new NextResponse(
        JSON.stringify({ message: "No se encontró el producto." }),
        { status: 404 }
      );

    const section = await db.section.findUnique({
      where: {
        name: qrCode,
      },
    });

    if (!section)
      return new NextResponse(
        JSON.stringify({ message: "No se encontró el sector." }),
        { status: 404 }
      );

    const existingRecord = await db.warehouse.findFirst({
      where: {
        productId: product.id,
        sectionId: section.id,
        storeId: params.storeId,
      },
    });

    if (existingRecord) {
      const updatedRecord = await db.warehouse.update({
        where: {
          id: existingRecord.id,
        },
        data: {
          quantity: existingRecord.quantity + quantity,
          isActive: true,
        },
      });

      return new NextResponse(JSON.stringify(updatedRecord), { status: 200 });
    } else {
      const newRecord = await db.warehouse.create({
        data: {
          productId: product.id,
          sectionId: section.id,
          storeId: params.storeId,
          quantity,
        },
      });
      return new NextResponse(JSON.stringify(newRecord), { status: 201 });
    }
  } catch (error) {
    console.error("Error al manejar la solicitud:", error);
    return new Response(
      JSON.stringify({ message: "Error interno del servidor." }),
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
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

    const productInWarehouse = await db.warehouse.findFirst({
      where: {
        storeId: params.storeId,
        sectionId: section.id,
        productId: product.id,
      },
    });

    if (!productInWarehouse) {
      return new NextResponse("Product in warehouse not found.", {
        status: 404,
      });
    }

    const updatedProductInWarehouse = await db.warehouse.update({
      where: {
        id: productInWarehouse.id,
      },
      data: {
        quantity,
      },
    });

    return NextResponse.json({ updatedProductInWarehouse });
  } catch (error) {
    console.log("[WAREHOUSE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
