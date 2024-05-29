"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { ProductosColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { GlobalDataTable } from "@/components/ui/global-filter";

interface ProductosClientProps {
  data: ProductosColumn[];
}

export const ProductosClient: React.FC<ProductosClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const handleAddProductClick = () => {
    router.push(`/${params.storeId}/productos/new`);
  };

  console.log(params);

  return (
    <div className="h-auto">
      <div className="flex justify-between items-center px-6 py-4">
        <Heading
          title="Productos"
          description="Listado de productos registrados"
        />
        <Button
          variant="default"
          className="flex gap-4"
          onClick={handleAddProductClick}
        >
          <PlusIcon />
          Agregar Producto
        </Button>
      </div>
      <Separator />
      <div className="px-4">
        <DataTable columns={columns} data={data} searchKey="description" />
        {/* <GlobalDataTable columns={columns} data={data} searchKey="sku" /> */}
      </div>
    </div>
  );
};
