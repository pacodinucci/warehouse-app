"use client";

import { Store } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  CheckIcon,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const [currentStore, setCurrentStore] = useState(() =>
    formattedItems.find((item) => item.value === params.storeId)
  );

  useEffect(() => {
    const newCurrentStore = formattedItems.find(
      (item) => item.value === params.storeId
    );
    if (currentStore?.value !== newCurrentStore?.value) {
      setCurrentStore(newCurrentStore);
    }
  }, [params.storeId, formattedItems, currentStore?.value]);

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a Store"
          className={cn("justify-center md:justify-between", className)}
        >
          <div className="flex flex-col md:flex-row items-center gap-2">
            <StoreIcon className="md:mr-2 md:h-4 md:w-4" />
            <p className="hidden md:block">{currentStore?.label}</p>
            <p className="block md:hidden">
              {currentStore?.label.split(" ")[0]}
            </p>
          </div>
          <ChevronsUpDown className="hidden md:block ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen h-[82.5vh] md:min-h-0 md:w-[200px] md:h-auto p-2 md:p-0 mb-6 md:mb-0 rounded-none md:rounded-md shadow-none md:shadow-md">
        <Command>
          <CommandList>
            <CommandInput placeholder="Buscar depósito..." />
            <CommandEmpty>No se encontraron depósitos.</CommandEmpty>
            <CommandGroup heading="Depósitos">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Nuevo Depósito
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
