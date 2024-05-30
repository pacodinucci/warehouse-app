import { db } from "@/lib/db";
import { DepositoClient } from "./components/client";
import { DepositoColumn } from "./components/columns";
import { format } from "date-fns";

const DepositoPage = async () => {
  const depositos = await db.warehouse.findMany({
    where: {
      isActive: true,
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
    <div className="w-screen md:w-3/4 h-[82vh] md:h-[75%] bg-white md:rounded-md md:shadow-md">
      <DepositoClient data={depositoFormat} />
    </div>
  );
};

export default DepositoPage;
