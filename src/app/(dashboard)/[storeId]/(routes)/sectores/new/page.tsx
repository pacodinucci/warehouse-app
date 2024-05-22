"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QrCode } from "lucide-react";
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
import Image from "next/image";
import QrCodeWithText from "@/components/QrCodeWithText";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

const formSchema = z.object({
  name: z.string().min(1),
  qrCode: z.string().min(1),
});

type SectionFormValues = z.infer<typeof formSchema>;

const AddNewSectionPage = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const [sectionName, setSectionName] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      qrCode: "",
    },
  });

  const onSubmit = async (data: SectionFormValues) => {
    try {
      setLoading(true);

      // Subir imagen a Cloudinary
      if (canvasRef.current) {
        const imageData = canvasRef.current.toDataURL("image/png");
        const imageBlob = await fetch(imageData).then((res) => res.blob());
        const imageUrl = await uploadToCloudinary(imageBlob);
        data.qrCode = imageUrl;
      }

      // Enviar datos a la API
      await axios.post(`/api/sections`, data);
      router.refresh();
      router.push(`/${params.storeId}/sectores`);
      toast.success("Sector creado!");
    } catch (error) {
      toast.error("El producto no se pudo crear.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQr = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const sectionName = form.getValues("name");
    setSectionName(sectionName);
    if (!sectionName) {
      toast.error("Debe ingresar un nombre del nuevo sector.");
      return;
    }
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${sectionName}`;
    setQrCodeUrl(qrUrl);
    form.setValue("qrCode", qrUrl, { shouldValidate: false });
  };

  const handleUploadImage = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const data = form.getValues();
    console.log(data);
    try {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL("image/png");
        const imageBlob = await fetch(imageData).then((res) => res.blob());
        const imageUrl = await uploadToCloudinary(imageBlob);
        data.qrCode = imageUrl;
      }
    } catch (error) {
      toast.error("No se pudo subir la imagen");
      console.log(error);
    }
  };

  return (
    <div className="w-3/4 min-h-[70%] h-auto bg-white rounded-md shadow-md mb-6">
      <div className="flex justify-between items-center px-6 py-4">
        <Heading
          title="Agregar nuevo sector"
          description="Genera un código QR para agregar un nuevo sector"
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
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nombre del nuevo sector</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Escribe el nombre del sector..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="codeBar"
              className="flex self-end w-1/2 gap-6"
              onClick={handleGenerateQr}
            >
              Generar código QR
              <QrCode />
            </Button>
          </div>
          {qrCodeUrl && (
            <div className="flex flex-row-reverse justify-end px-12 mt-4">
              <QrCodeWithText
                text={sectionName}
                qrValue={qrCodeUrl}
                canvasRef={canvasRef}
              />
              <canvas ref={canvasRef} width={200} height={200} />
            </div>
          )}
          <Button className="w-1/4" type="submit" disabled={!qrCodeUrl}>
            Agregar sector
          </Button>
          {/* <Button
            className="w-1/4"
            variant="outline"
            onClick={(event) => handleUploadImage(event)}
          >
            Cloudinary
          </Button> */}
        </form>
      </Form>
    </div>
  );
};

export default AddNewSectionPage;
