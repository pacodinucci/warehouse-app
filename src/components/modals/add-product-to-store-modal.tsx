"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AddProductToStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    barCode: string | null;
    qrCode: string;
    quantity: number;
  }) => void;
  loading: boolean;
}

export const AddProductToStoreModal: React.FC<AddProductToStoreModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [barCode, setBarCode] = useState<string | null>(null);
  const [sku, setSku] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningQr, setIsScanningQr] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isCodebarManual, setIsCodebarManual] = useState(true);
  const [isSkuManual, setIsSkuManual] = useState(false);
  const [showProductDescription, setShowProductDescription] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      isScanningQr ? handleScanQr : handleScan,
      1000
    );
    return () => clearInterval(interval);
  }, [isScanningQr]);

  const handleScan = async () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decodeFromImage(
            undefined,
            screenshot
          );
          setBarCode(result.getText());
          setIsLoading(true);
          fetchProduct(result.getText());
          clearInterval(intervalId!);
        } catch (err) {
          if (err instanceof NotFoundException) {
            // No barcode found, continue scanning
          } else {
            console.error("Error al escanear el código:", err);
          }
        }
      }
    }
  };

  const handleScanQr = async () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decodeFromImage(
            undefined,
            screenshot
          );
          setQrCode(result.getText());
          clearInterval(intervalId!);
          onConfirm({ barCode, qrCode: result.getText(), quantity });
          handleClose();
        } catch (err) {
          if (err instanceof NotFoundException) {
            // No QR code found, continue scanning
          } else {
            console.error("Error al escanear el código QR:", err);
          }
        }
      }
    }
  };

  const fetchProduct = async (barCode: string) => {
    try {
      const response = await axios.get(`/api/products/${barCode}`);
      setProduct(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al buscar el producto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onBarcodeClick = () => {
    console.log(barCode);
    setIsLoading(true);
    if (barCode) {
      fetchProduct(barCode);
    }
    setShowProductDescription(true);
  };

  const onSkuClick = () => {
    console.log("click sku");
  };

  const handleClose = () => {
    setBarCode(null);
    setProduct(null);
    setQuantity(1);
    setQrCode(null);
    setIsScanningQr(false);
    setIsManualEntry(false);
    setIsCodebarManual(true);
    setIsSkuManual(false);
    setProduct(null);
    setShowProductDescription(false);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={
        isScanningQr ? "Escanear QR del sector" : "Agregar producto al depósito"
      }
      description="Sigue las instrucciones"
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="flex flex-col items-center">
        {isManualEntry ? (
          <div className="my-4 w-full">
            <div className={`flex gap-4 ${showProductDescription && "hidden"}`}>
              <Button
                variant="manualEntry"
                className={`${isCodebarManual ? "bg-blue-600 text-white" : ""}`}
                onClick={() => {
                  setIsCodebarManual(true);
                  setIsSkuManual(false);
                }}
              >
                Código de barras
              </Button>
              <Button
                variant="manualEntry"
                className={`${isSkuManual ? "bg-blue-600 text-white" : ""}`}
                onClick={() => {
                  setIsSkuManual(true);
                  setIsCodebarManual(false);
                }}
              >
                Número SKU
              </Button>
            </div>
            <div>
              {showProductDescription ? (
                <div>
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : product ? (
                    isScanningQr ? (
                      <div className="my-4">
                        <p>Escanea el código QR del sector.</p>
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="flex gap-12 text-2xl">
                          <p className="font-semibold">{product.sku}</p>
                          <p className="text-slate-600 font-bold">
                            {product.brand}
                          </p>
                        </div>
                        <p>{product.description}</p>
                        <div className="my-4 flex flex-col gap-2">
                          <label
                            htmlFor="quantity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Cantidad
                          </label>
                          <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(Number(e.target.value))
                            }
                            className="mt-1 block w-1/4 rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                            min={1}
                          />
                        </div>

                        <div className="flex justify-between w-full mt-12">
                          <Button onClick={handleClose} disabled={loading}>
                            Volver
                          </Button>
                          <Button
                            onClick={() => setIsScanningQr(true)}
                            disabled={loading}
                          >
                            Confirmar
                          </Button>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="mt-2 text-red-600">Producto no encontrado.</p>
                  )}
                </div>
              ) : (
                <>
                  {isCodebarManual ? (
                    <div className="my-6 flex flex-col gap-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Código de barras
                      </label>
                      <input
                        type="text"
                        name="barCode"
                        // value={barCode}
                        onChange={(e) => setBarCode(e.target.value)}
                        className="mt-1 p-2 block w-3/4 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                        min={1}
                      />
                    </div>
                  ) : (
                    <div className="my-6 flex flex-col gap-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Número SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        // value={barCode}
                        onChange={(e) => setBarCode(e.target.value)}
                        className="mt-1 p-2 block w-3/4 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                        min={1}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`flex justify-between w-full mt-12 ${
                showProductDescription && "hidden"
              }`}
            >
              <Button
                onClick={() => setIsManualEntry(false)}
                disabled={loading}
              >
                Volver
              </Button>
              <Button
                disabled={loading}
                onClick={() => {
                  isCodebarManual ? onBarcodeClick() : onSkuClick();
                }}
              >
                Confirmar
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!barCode ? (
              <>
                <div className="my-4">
                  <p>Escanea el código de barras del producto.</p>
                </div>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                />
                <div className="pt-6 pb-4 w-full flex justify-center">
                  <Button
                    variant="outline"
                    className="flex gap-4 items-center"
                    onClick={() => setIsManualEntry(true)}
                  >
                    Ingresar manualmente
                  </Button>
                </div>
              </>
            ) : (
              <div className="my-4 w-full">
                {isLoading ? (
                  <p>Loading...</p>
                ) : product ? (
                  isScanningQr ? (
                    <div className="my-4">
                      <p>Escanea el código QR del sector.</p>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                      />
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="flex gap-12 text-2xl">
                        <p className="font-semibold">{product.sku}</p>
                        <p className="text-slate-600 font-bold">
                          {product.brand}
                        </p>
                      </div>
                      <p>{product.description}</p>
                      <div className="my-4 flex flex-col gap-2">
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cantidad
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="mt-1 block w-1/4 rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                          min={1}
                        />
                      </div>
                      <div className="flex justify-between w-full mt-12">
                        <Button onClick={handleClose} disabled={loading}>
                          Volver
                        </Button>
                        <Button
                          onClick={() => setIsScanningQr(true)}
                          disabled={loading}
                        >
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="mt-2 text-red-600">Producto no encontrado.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default AddProductToStoreModal;
