"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (code: string) => void;
  type: "barcode" | "qr";
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  type,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanBarcode = async () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decodeFromImage(
            undefined,
            screenshot
          );
          onComplete(result.getText());
          onClose();
          setError(null);
        } catch (err) {
          if (err instanceof NotFoundException) {
            setError("Escaneando...");
          } else {
            setError(
              type === "barcode"
                ? "Error al escanear el código de barras."
                : "Error al escanear el código QR."
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(scanBarcode, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setBarcode(null);
      setError(null);
    }
  }, [isOpen]);

  return (
    <Modal
      title={`Escáner de Código ${type === "barcode" ? "de Barras" : "QR"}`}
      description={`Apunta la cámara al código ${
        type === "barcode" ? "de barras" : "QR"
      } para escanear.`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
        />
        <div className="mt-4">
          {barcode ? (
            <p>Resultado del código de barras: {barcode}</p>
          ) : (
            <p>{error || "Escaneando..."}</p>
          )}
        </div>
        <Button onClick={onClose} className="mt-4">
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};

export default BarcodeScannerModal;
