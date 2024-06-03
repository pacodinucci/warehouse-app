"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, MinusIcon } from "lucide-react";
import { DepositoColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { AddProductToStoreModal } from "@/components/modals/add-product-to-store-modal";
import { RemoveProductFromStoreModal } from "@/components/modals/remove-product-from-store-modal";
import { toast } from "sonner";
import { db } from "@/lib/db";

interface DepositoClientProps {
  data: DepositoColumn[];
}

export const DepositoClient: React.FC<DepositoClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const response = await axios(`/api/stores/${params.storeId}`);
        const currentStore = await response.data;
        setStoreName(currentStore.name);
      } catch (error) {
        console.error("Error fetching store name:", error);
      }
    };

    fetchStoreName();
  }, [params.storeId]);

  const handleAddProductClick = () => {
    setIsAddModalOpen(true);
  };

  const handleRemoveProductClick = () => {
    setIsRemoveModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsRemoveModalOpen(false);
  };

  const handleConfirm = async (data: {
    code: {
      barCode: string | null;
      sku: string | null;
    };
    qrCode: string | null;
    quantity: number;
  }) => {
    console.log("Data confirmed:", data);
    try {
      await axios.post(`/api/stores/${params.storeId}`, data);
      toast.success("Producto agregado al depósito con éxito.");
      router.refresh();
    } catch (error) {
      console.error("Error al cargar el producto en el deposito", error);
      toast.error("No se pudo agregar el producto al depósito.");
    }
  };

  const handleConfirmRemove = async (data: {
    name: string | null;
    warehouseId: string;
    quantity: number;
  }) => {
    try {
      await axios.patch(
        `/api/stores/${params.storeId}/warehouse/${data.warehouseId}`,
        data
      );
      toast.success("Producto retirado del depósito con éxito.");
      router.refresh();
    } catch (error) {
      console.error("Error al retirar el producto del deposito", error);
      toast.error("No se pudo retirar el producto del depósito.");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
        <Heading
          title="Depósito"
          description={<>Listado de productos registrados en {storeName}</>}
        />
        <div className="w-full flex justify-end gap-2 mt-2">
          <Button
            variant="default"
            className="flex justify-between items-center gap-2 h-10 min-w-10 bg-emerald-700"
            onClick={handleAddProductClick}
          >
            <PlusIcon style={{ height: "24px", width: "24px" }} />
            <span className="hidden md:flex items-center">
              Agregar productos
            </span>
          </Button>
          <Button
            variant="default"
            className="flex justify-between items-center gap-2 h-10 min-w-10 bg-rose-800"
            onClick={handleRemoveProductClick}
          >
            <MinusIcon style={{ height: "24px", width: "24px" }} />
            <span className="hidden md:flex items-center">
              Retirar productos
            </span>
            <span className="hidden items-center text-lg">Retirar</span>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="px-4">
        <DataTable columns={columns} data={data} searchKey="description" />
      </div>
      <AddProductToStoreModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        loading={false}
      />
      <RemoveProductFromStoreModal
        isOpen={isRemoveModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRemove}
        loading={false}
      />
    </div>
  );
};
