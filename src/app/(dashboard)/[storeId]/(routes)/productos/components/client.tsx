"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, Import, Sheet } from "lucide-react";
import { ProductosColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { ImportFileModal } from "@/components/modals/import-file-modal";

interface ProductosClientProps {
  data: ProductosColumn[];
}

export const ProductosClient: React.FC<ProductosClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddProductClick = () => {
    router.push(`/${params.storeId}/productos/new`);
  };

  const handleImportFileClick = () => {
    setIsModalOpen(true);
  };

  const HandleImportFileClose = () => {
    setIsModalOpen(false);
  };

  const handleImportConfirm = () => {
    console.log("importando archivo");
  };

  console.log(params);

  return (
    <>
      <div className="h-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-6 py-4">
          <Heading
            title="Productos"
            description="Listado de productos registrados"
          />
          <div className="w-full flex justify-end gap-2 mt-2">
            <Button
              variant="default"
              className="flex justify-between items-center gap-2 h-10 min-w-10 bg-blue-500"
              onClick={handleImportFileClick}
            >
              <Sheet style={{ height: "24px", width: "24px" }} />
              {/* <Import style={{ height: "24px", width: "24px" }} /> */}
              <span className="hidden md:flex items-center">
                Importar archivo
              </span>
              <span className="hidden items-center text-lg">Importar</span>
            </Button>
            <Button
              variant="default"
              className="flex justify-between items-center gap-2 h-10 min-w-10 bg-emerald-700"
              onClick={handleAddProductClick}
            >
              <PlusIcon style={{ height: "24px", width: "24px" }} />
              <span className="hidden md:flex items-center">
                Agregar productos
              </span>
              <span className="hidden items-center text-lg">Agregar</span>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="px-4">
          <DataTable columns={columns} data={data} searchKey="description" />
          {/* <GlobalDataTable columns={columns} data={data} searchKey="sku" /> */}
        </div>
      </div>
      <ImportFileModal
        isOpen={isModalOpen}
        onClose={HandleImportFileClose}
        onConfirm={handleImportConfirm}
      />
    </>
  );
};
