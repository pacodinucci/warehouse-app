"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Modal } from "@/components//ui/modal";
import { Button } from "@/components/ui/button";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  qrCodeUrl: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  qrCodeUrl,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handlePrint = () => {
    const printWindow = window.open(qrCodeUrl, "_blank");
    if (printWindow) {
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "QRCode.png";
    link.click();
  };

  return (
    <Modal
      title="Código QR"
      description="Detalles del código QR"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex justify-center my-4">
        <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} />
      </div>
      <div className="pt-6 space-x-2 items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={handlePrint}>
          Imprimir
        </Button>
        <Button disabled={loading} variant="default" onClick={handleDownload}>
          Descargar
        </Button>
      </div>
    </Modal>
  );
};
