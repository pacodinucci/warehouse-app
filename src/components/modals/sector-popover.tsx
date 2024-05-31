import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";

interface Section {
  id: string;
  name: string;
}

interface Warehouse {
  id: string;
  Section: Section;
}

interface Product {
  Warehouse: Warehouse[];
}

interface SelectedSection {
  name: string;
  warehouseId: string;
}

interface SectorSelectorProps {
  product: Product | null;
  selectedSection: SelectedSection | null;
  setSelectedSection: Dispatch<SetStateAction<SelectedSection | null>>;
}

const SectorSelector: React.FC<SectorSelectorProps> = ({
  product,
  selectedSection,
  setSelectedSection,
}) => {
  //   const [selectedSection, setSelectedSection] = useState({
  //     name: product?.Warehouse[0]?.Section.name,
  //     warehouseId: product?.Warehouse[0]?.id,
  //   });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (product?.Warehouse.length && product?.Warehouse.length > 0) {
      setSelectedSection({
        name: product.Warehouse[0].Section.name,
        warehouseId: product.Warehouse[0].id,
      });
    }
  }, [product, setSelectedSection]);

  const handleSelectSection = (warehouse: Warehouse) => {
    setSelectedSection({
      name: warehouse.Section.name,
      warehouseId: warehouse.id,
    });
    setIsPopoverOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor="sector" className="block text-lg text-gray-700">
        Sector
      </label>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="flex gap-2 text-slate-700 w-[180px] md:w-[47%]"
          >
            {selectedSection?.name}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] md:w-full p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Buscar sector..." />
              <CommandEmpty>No se encontró el sector.</CommandEmpty>
              <CommandGroup>
                {product?.Warehouse.map((warehouse) => (
                  <CommandItem
                    key={warehouse.id}
                    className={`cursor-pointer p-2 ${
                      selectedSection?.name === warehouse.Section.name
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onSelect={() => {
                      handleSelectSection(warehouse);
                    }}
                  >
                    {warehouse.Section.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SectorSelector;
