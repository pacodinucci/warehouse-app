import React from "react";
import { format } from "date-fns";

import { db } from "@/lib/db";
import { DepositoClient } from "./components/client";
import { DepositoColumn } from "./components/columns";

const DepositoPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;
  console.log(storeId);
  const depositos = await db.warehouse.findMany({
    where: {
      isActive: true,
      storeId: storeId,
    },
    include: {
      Product: true,
      Section: true,
    },
  });

  const depositoFormat: DepositoColumn[] = depositos.map((item) => ({
    id: item.id,
    sku: item.Product.sku,
    brand: item.Product.brand,
    description: item.Product.description,
    quantity: item.quantity,
    section: item.Section.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="w-screen md:w-3/4 h-auto md:h-[75%] min-h-screen md:min-h-0 bg-white md:rounded-md md:shadow-md mb-10">
      <DepositoClient data={depositoFormat} />
    </div>
  );
};

export default DepositoPage;
