import { Search, PackagePlus, SquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NavigateButton from "@/components/NavigationButton";
import { db } from "@/lib/db";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return (
    <div className="md:w-3/4 h-[90vh] md:h-full bg-white rounded-md">
      <h1 className="text-2xl font-semibold text-neutral-800 py-6 px-4">
        {store?.name}
      </h1>
      <Separator />
      <div className="p-4">
        <div className="flex flex-col gap-4 py-2">
          <h2 className="text-xl text-neutral-800">
            Buscar producto en depósito
          </h2>
          <p className="text-neutral-600">
            Buscar por nombre de producto, SKU o código de barras
          </p>
          <Button variant="outline" className="flex gap-4 md:w-1/2">
            <Search />
            Buscar en depósito
          </Button>
          <Separator />
        </div>
        <div className="flex flex-col gap-4 py-2">
          <h2 className="text-xl text-neutral-800">
            Agregar productos al depósito
          </h2>
          <p className="text-neutral-600">
            Cargar un producto al depósito, asignandole un sector.
          </p>
          <Button variant="outline" className="flex gap-4 md:w-1/2">
            <PackagePlus />
            Agregar producto
          </Button>
          <Separator />
        </div>
        <div className="flex flex-col gap-4 py-2">
          <h2 className="text-xl text-neutral-800">Crear un nuevo producto</h2>
          <p className="text-neutral-600">
            Cargar registro de un nuevo producto.
          </p>
          <Button variant="outline" className="flex gap-4 md:w-1/2">
            <SquarePlus />
            Crear producto
          </Button>
          <Separator />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
