"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { DepositoColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import AddProductToStoreModal from "@/components/modals/add-product-to-store-modal";

interface DepositoClientProps {
  data: DepositoColumn[];
}

export const DepositoClient: React.FC<DepositoClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddProductClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = (data: {
    barCode: string | null;
    qrCode: string;
    quantity: number;
  }) => {
    console.log("Data confirmed:", data);
    // Handle confirmed data here
  };

  return (
    <div>
      <div className="flex justify-between items-center px-6 py-4">
        <Heading
          title="Depósito"
          description="Listado de productos registrados en este depósito"
        />
        <Button
          variant="default"
          className="flex gap-4"
          onClick={handleAddProductClick}
        >
          <PlusIcon />
          Agregar Producto al depósito
        </Button>
      </div>
      <Separator />
      <div className="px-4">
        <DataTable columns={columns} data={data} searchKey="name" />
      </div>
      <AddProductToStoreModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        loading={false}
      />
    </div>
  );
};
