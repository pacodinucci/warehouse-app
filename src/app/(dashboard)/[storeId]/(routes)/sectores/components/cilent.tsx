"use client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { SectoresColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";

interface SectoresClientProps {
  data: SectoresColumn[];
}

export const SectoresClient: React.FC<SectoresClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const handleAddSectorClick = () => {
    router.push(`/${params.storeId}/sectores/new`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4">
        <div className="self-start">
          <Heading title="Sectores" description="Listado de sectores" />
        </div>
        <div className="self-end">
          <Button
            variant="default"
            className="flex gap-4"
            onClick={handleAddSectorClick}
          >
            <PlusIcon />
            <span className="hidden md:flex items-center">Agregar sector</span>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="px-4">
        <DataTable columns={columns} data={data} searchKey="name" />
      </div>
    </div>
  );
};
