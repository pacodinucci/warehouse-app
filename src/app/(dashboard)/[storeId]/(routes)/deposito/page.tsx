import { db } from "@/lib/db";
import { DepositoClient } from "./components/client";
import { DepositoColumn } from "./components/columns";
import { AddProductToStoreModal } from "@/components/modals/add-product-to-store-modal";
import { format } from "date-fns";

const DepositoPage = async () => {
  const depositos = await db.warehouse.findMany({
    include: {
      Product: true,
      Section: true,
    },
  });

  const depositoFormat: DepositoColumn[] = depositos.map((item) => ({
    id: item.id,
    name: item.Product.name,
    brand: item.Product.brand,
    quantity: item.quantity,
    section: item.Section.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="w-3/4 h-[75%] bg-white rounded-md shadow-md mb-6">
      <DepositoClient data={depositoFormat} />
    </div>
  );
};

export default DepositoPage;
