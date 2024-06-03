import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { warehouseId: string } }
) {
  const body = await req.json();
  const { quantity } = body;

  const warehouse = await db.warehouse.findFirst({
    where: {
      id: params.warehouseId,
    },
  });

  if (!warehouse) {
    return new NextResponse(
      JSON.stringify({ message: "No se encontró el producto." }),
      { status: 404 }
    );
  }

  if (quantity > warehouse.quantity) {
    return new NextResponse(
      JSON.stringify({
        message: "La cantidad que se pide retirar supera el stock.",
      }),
      { status: 400 }
    );
  } else if (quantity === warehouse.quantity) {
    await db.warehouse.update({
      where: {
        id: params.warehouseId,
      },
      data: {
        isActive: false,
        quantity: 0,
      },
    });
    return new NextResponse(
      JSON.stringify({
        message: "El producto ha sido retirado completamente del sector.",
      }),
      { status: 200 }
    );
  } else {
    await db.warehouse.update({
      where: {
        id: params.warehouseId,
      },
      data: {
        quantity: warehouse.quantity - quantity,
      },
    });
    return new NextResponse(
      JSON.stringify({
        message: "El producto ha sido retirado del sector.",
      }),
      { status: 200 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { warehouseId: string } }
) {
  try {
    const warehouseDeleted = await db.warehouse.delete({
      where: {
        id: params.warehouseId,
      },
    });

    if (!warehouseDeleted) {
      return new NextResponse("warehouse could not be deleted.", {
        status: 400,
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "El registro ha sido eliminado.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
