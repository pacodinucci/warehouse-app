"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Barcode, ScanBarcode } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BarcodeScannerModal from "@/components/modals/barcode-modal";

const formSchema = z.object({
  sku: z.string().min(1),
  brand: z.string().min(1),
  description: z.string().min(1),
  barCode: z.string().min(1),
});

type ProductFormValues = z.infer<typeof formSchema>;

const AddNewProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isReadingCodebar, setIsReadingCodebar] = useState<boolean>(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
      brand: "",
      description: "",
      barCode: "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      console.log(data);
      await axios.post(`/api/products`, data);
      router.refresh();
      router.push(`/${params.storeId}/productos`);
      toast.success("Producto creado!");
    } catch (error) {
      toast.error("El producto no se puedo crear.");
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeComplete = (code: string) => {
    form.setValue("barCode", code, { shouldValidate: false });
    form.clearErrors("barCode");
    setIsReadingCodebar(false);
  };

  const handleCloseModal = () => {
    setIsReadingCodebar(false);
    form.clearErrors();
  };

  return (
    <div className="w-full md:w-3/4 min-h-[70%] h-screen md:h-auto bg-white rounded-md shadow-md mb-6">
      <div className="flex justify-between items-center px-6 py-4">
        <Heading
          title="Agregar nuevo producto"
          description="Completa el formulario para agregar un nuevo producto"
        />
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full p-6 flex flex-col"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="barCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Código de barras</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Lee o introduce el código de barras..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="codeBar"
              className="flex self-end md:w-1/2 gap-6"
              onClick={() => setIsReadingCodebar(true)}
            >
              Leer código de barras
              <ScanBarcode />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Escribe el número SKU..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Marca del producto</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Escribe la marca del producto..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Descripción del producto</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Escribe la descripción del producto..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="md:w-1/4" type="submit">
            Agregar producto
          </Button>
        </form>
      </Form>
      <BarcodeScannerModal
        isOpen={isReadingCodebar}
        onClose={handleCloseModal}
        onComplete={handleBarcodeComplete}
        type="barcode"
      />
    </div>
  );
};

export default AddNewProductPage;
