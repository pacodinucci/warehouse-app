"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { DepositoColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";

interface DepositoClientProps {
  data: DepositoColumn[];
}

export const DepositoClient: React.FC<DepositoClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <div>
      <div className="flex justify-between items-center px-6 py-4">
        <Heading
          title="Depósito"
          description="Listado de productos registrados en este depósito"
        />
        <Button variant="default" className="flex gap-4">
          <PlusIcon />
          Agregar Producto al depósito
        </Button>
      </div>
      <Separator />
      <div className="px-4">
        <DataTable columns={columns} data={data} searchKey="name" />
      </div>
    </div>
  );
};
