import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Warehouse } from "lucide-react";
import SectorSelector from "./sector-popover";

interface ProductDescriptionProps {
  product: {
    sku: string;
    brand: string;
    description: string;
    Warehouse: Warehouse[];
  } | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    warehouseId: string;
    quantity: number;
  }) => void;
  barCode: string | null;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
}

interface Warehouse {
  id: string;
  storeId: string;
  productId: string;
  sectionId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  Section: {
    id: string;
    name: string;
  };
}

interface SelectedSection {
  name: string;
  warehouseId: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  product,
  loading,
  onClose,
  onConfirm,
  barCode,
  quantity,
  setQuantity,
}) => {
  const [selectedSection, setSelectedSection] =
    useState<SelectedSection | null>(null);

  useEffect(() => {
    console.log(product);
  }, [product]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="text-slate-600 font-bold text-xl">{product?.brand}</p>
          <p className="text-lg">{product?.description}</p>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-600">
              Selecciona sector y cantidad a retirar:
            </p>
          </div>
          <div>
            {/* <label htmlFor="sector" className="block text-lg text-gray-700">
              Sector
            </label> */}
            <SectorSelector
              product={product}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
            />
            {/* <div className="flex gap-6 items-center">
              {product?.Warehouse.length && product?.Warehouse.length > 1 ? (
                product?.Warehouse.map((warehouse) => (
                  <div key={warehouse.id}>
                    <p
                      className={`font-semibold cursor-pointer ${
                        selectedSection.name === warehouse.Section.name
                          ? "text-black text-2xl"
                          : "text-gray-500 text-xl"
                      }`}
                      onClick={() =>
                        setSelectedSection({
                          name: warehouse.Section.name,
                          warehouseId: warehouse.id,
                        })
                      }
                    >
                      {warehouse.Section.name}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-lg font-semibold">
                  {product?.Warehouse[0].Section.name}
                </p>
              )}
            </div> */}
          </div>
          <div className="flex gap-4 justify-between items-center">
            <label htmlFor="quantity" className="block text-lg text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-[180px] md:w-3/4 rounded-md border-gray-200 border py-1 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
              min={1}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full mt-12">
        <Button onClick={onClose} disabled={loading}>
          Volver
        </Button>
        <Button
          onClick={() => {
            console.log({
              name: selectedSection?.name,
              warehouseId: selectedSection?.warehouseId,
              quantity: quantity,
            });
            onConfirm({
              name: selectedSection?.name || "",
              warehouseId: selectedSection?.warehouseId || "",
              quantity: quantity,
            });
            onClose();
          }}
          disabled={loading}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
};
