import { db } from "@/lib/db";
import { ProductosClient } from "./components/client";
import { ProductosColumn } from "./components/columns";
import { format } from "date-fns";

const ProductosPage = async () => {
  const productos = await db.product.findMany();

  const productosFormat: ProductosColumn[] = productos.map((item) => ({
    id: item.id,
    name: item.name,
    brand: item.brand,
    description: item.description,
    code: item.code,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="w-3/4 h-[70%] bg-white rounded-md shadow-md mb-12">
      <ProductosClient data={productosFormat} />
    </div>
  );
};

export default ProductosPage;
