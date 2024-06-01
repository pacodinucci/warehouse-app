"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Modal } from "../ui/modal";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

interface ProductData {
  sku: string;
  description: string;
  brand: string;
  code: string;
}

interface ImportFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ProductData[]) => void;
}

export const ImportFileModal: React.FC<ImportFileModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: unknown[] = XLSX.utils.sheet_to_json(sheet);
        const data = jsonData as ProductData[];
        setData(data);
        await handleUpload(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData: unknown[] = XLSX.utils.sheet_to_json(sheet);
        const data = jsonData as ProductData[];
        await handleUpload(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleUpload = async (data: ProductData[]) => {
    setLoading(true);
    try {
      const transformedData = data.map((item) => ({
        ...item,
        sku: String(item.sku),
        code: String(item.code),
      }));
      console.log(transformedData);
      await axios.post("/api/products/bulk", transformedData);
      toast.success("Los productos se agregaron a la base de datos.");
    } catch (error) {
      console.error("Error uploading data:", error);
      toast.error("No se pudo agregar los productos.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/vnd.ms-excel": [],
    },
  });

  return (
    <Modal
      title="Importar archivo de Excel"
      description="Importa o arrasta un archivo de xsls"
      isOpen={isOpen}
      onClose={onClose}
      className="h-[95vh] md:h-auto flex flex-col"
    >
      <Separator />
      <div className="flex flex-col items-center justify-center py-12 md:py-2">
        <div
          {...getRootProps()}
          className="flex flex-col gap-6 justify-center items-center border-2 border-dashed border-gray-400 rounded p-6 text-center cursor-pointer min-h-48 w-full"
        >
          <input {...getInputProps()} />
          <p>
            Arrastra y suelta o selecciona un archivo .xlsx o .csv. Debe tener
            como columnas sku, description, brand y code.
          </p>
          <Button className="cursor-pointer w-full">Seleccionar archivo</Button>
        </div>
      </div>
    </Modal>
  );
};
