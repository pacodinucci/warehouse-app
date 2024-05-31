"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ProductDescription } from "./product-description";
import { number } from "zod";
import { Separator } from "../ui/separator";

interface RemoveProductFromStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    warehouseId: string;
    quantity: number;
  }) => void;
  loading: boolean;
}

interface FetchProductParams {
  barCode: string | null;
  sku: string | null;
}

export const RemoveProductFromStoreModal: React.FC<
  RemoveProductFromStoreModalProps
> = ({ isOpen, onClose, onConfirm, loading }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [barCode, setBarCode] = useState<string | null>(null);
  const [sku, setSku] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<any | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCodebarManual, setIsCodebarManual] = useState(true);
  const [isSkuManual, setIsSkuManual] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(handleScan, 1000);
    return () => clearInterval(interval);
  }, []);

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
          fetchProduct({ barCode: result.getText(), sku: null });
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

  const fetchProduct = async ({ barCode, sku }: FetchProductParams) => {
    try {
      let url = "";

      if (barCode) {
        url = `/api/products/${barCode}`;
      } else if (sku) {
        url = `/api/products?sku=${sku}`;
      } else {
        throw new Error("Either barCode or sku must be provided");
      }
      const response = await axios.get(url);
      setProduct(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al buscar el producto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //   const onBarcodeClick = () => {
  //     console.log(barCode);
  //     setIsLoading(true);
  //     if (barCode) {
  //       fetchProduct(barCode);
  //     }
  //     setShowProductDescription(true);
  //   };

  const handleClose = () => {
    setBarCode(null);
    setProduct(null);
    setIsManualEntry(false);
    setIsSkuManual(false);
    setIsCodebarManual(true);
    setQuantity(1);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Retirar productos del depósito"
      description="Sigue las instrucciones"
      isOpen={isOpen}
      onClose={handleClose}
      className="h-[95vh] md:h-auto flex flex-col"
    >
      <Separator />
      <div>
        {isManualEntry ? (
          <div className="w-full h-full mt-6">
            {!product ? (
              <>
                <div className="flex gap-4">
                  <Button
                    variant="manualEntry"
                    className={`${
                      isCodebarManual ? "bg-blue-600 text-white" : ""
                    }`}
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
                <div className="my-6 flex flex-col gap-2">
                  {isCodebarManual && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Código de barras
                      </label>
                      <input
                        type="text"
                        name="barCode"
                        onChange={(e) => setBarCode(e.target.value)}
                        className="mt-1 p-2 block w-3/4 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                        min={1}
                      />
                    </div>
                  )}
                  {isSkuManual && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Número SKU
                      </label>
                      <input
                        type="text"
                        name="sku"
                        onChange={(e) => setSku(e.target.value)}
                        className="mt-1 p-2 block w-3/4 rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                        min={1}
                      />
                    </div>
                  )}
                  <div className="flex justify-between w-full mt-12">
                    <Button
                      onClick={() => setIsManualEntry(false)}
                      disabled={loading}
                    >
                      Volver
                    </Button>
                    <Button
                      onClick={() => {
                        if (barCode) fetchProduct({ barCode, sku: null });
                        else if (sku) fetchProduct({ barCode: null, sku });
                      }}
                      disabled={loading || (!barCode && !sku)}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <ProductDescription
                product={product}
                loading={loading}
                onClose={handleClose}
                onConfirm={onConfirm}
                barCode={barCode}
                quantity={quantity}
                setQuantity={setQuantity}
              />
            )}
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
                  <ProductDescription
                    product={product}
                    loading={loading}
                    onClose={handleClose}
                    onConfirm={onConfirm}
                    barCode={barCode}
                    quantity={quantity}
                    setQuantity={setQuantity}
                  />
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

export default RemoveProductFromStoreModal;
