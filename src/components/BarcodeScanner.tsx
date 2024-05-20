import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

const BarcodeScanner = () => {
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
          setBarcode(result.getText());
          setError(null);
        } catch (err) {
          if (err instanceof NotFoundException) {
            setError("No se encontró un código de barras.");
          } else {
            setError("Error al escanear el código de barras.");
          }
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(scanBarcode, 1000); // Escanear cada segundo
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Escáner de Código de Barras</h2>
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
    </div>
  );
};

export default BarcodeScanner;
