import { db } from "@/lib/db";
import { ProductosClient } from "./components/client";
import { ProductosColumn } from "./components/columns";
import { format } from "date-fns";

const ProductosPage = async () => {
  const productos = await db.product.findMany();

  const productosFormat: ProductosColumn[] = productos.map((item) => ({
    id: item.id,
    sku: item.sku,
    brand: item.brand,
    description: item.description,
    code: item.code,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="w-screen md:w-3/4 h-auto md:h-[75%] min-h-screen md:min-h-0 bg-white md:rounded-md md:shadow-md mb-10">
      <ProductosClient data={productosFormat} />
    </div>
  );
};

export default ProductosPage;
