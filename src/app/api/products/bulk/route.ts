import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Product {
  sku: string;
  brand: string;
  description: string;
  code: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    console.log(body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!Array.isArray(body) || body.length === 0) {
      return new NextResponse("Request body must be a non-empty array", {
        status: 400,
      });
    }

    const errors: {
      sku: string;
      brand: string;
      description: string;
      code: string;
      error: string;
    }[] = [];

    const products: Product[] = body.reduce((acc: Product[], item: Product) => {
      const { sku, brand, description, code } = item;

      if (!sku || !brand || !description || !code) {
        errors.push({
          sku,
          brand,
          description,
          code,
          error: "Missing required fields",
        });
      } else {
        acc.push({ sku, brand, description, code });
      }

      return acc;
    }, []);

    if (errors.length > 0) {
      return new NextResponse(JSON.stringify({ errors }), { status: 400 });
    }

    const createdProducts = await db.product.createMany({
      data: products,
    });

    return NextResponse.json(createdProducts);
  } catch (error) {
    console.log("[PRODUCT_BULK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
