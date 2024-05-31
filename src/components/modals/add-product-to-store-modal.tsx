"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";
import { QrCode } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Separator } from "../ui/separator";

interface AddProductToStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    code: {
      barCode: string | null;
      sku: string | null;
    };
    qrCode: string | null;
    quantity: number;
  }) => void;
  loading: boolean;
}

interface FetchProductParams {
  barCode: string | null;
  sku: string | null;
}

export const AddProductToStoreModal: React.FC<AddProductToStoreModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);
  const [barCode, setBarCode] = useState<string | null>(null);
  const [sku, setSku] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrMode, setQrMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningQr, setIsScanningQr] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isCodebarManual, setIsCodebarManual] = useState(true);
  const [isSkuManual, setIsSkuManual] = useState(false);
  const [showProductDescription, setShowProductDescription] = useState(false);
  const [sectorQuery, setSectorQuery] = useState<string>("");
  const [sectorResults, setSectorResults] = useState<any[]>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [allSectors, setAllSectors] = useState<any[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchAllSectors();
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
          fetchProduct({ barCode: result.getText(), sku: null });
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
          onConfirm({
            code: { barCode, sku },
            qrCode: result.getText(),
            quantity,
          });
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

  const onBarcodeClick = () => {
    console.log(barCode);
    setIsLoading(true);
    if (barCode) {
      fetchProduct({ barCode, sku: null });
    }
    setShowProductDescription(true);
  };

  const onSkuClick = () => {
    console.log(sku);
    setIsLoading(true);
    if (sku) {
      fetchProduct({ barCode: null, sku });
    }
    setShowProductDescription(true);
  };

  const fetchAllSectors = async () => {
    try {
      const response = await axios.get(`/api/sections/${params.storeId}`);
      setAllSectors(response.data);
    } catch (error) {
      console.error("Error al cargar los sectores:", error);
    }
  };

  const handleSectorQueryChange = (query: string) => {
    setSectorQuery(query);
    if (query.length) {
      const filteredSectors = allSectors.filter((sector) =>
        sector.name.toLowerCase().includes(query.toLowerCase())
      );
      setSectorResults(filteredSectors);
    } else {
      setSectorResults([]);
    }
  };

  const handleSectorSelect = (sector: any) => {
    setSelectedSector(sector.name);
    setQrCode(sector.name);
    setSectorQuery(sector.name);
    setSectorResults([]);
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
    setQrMode(false);
    setSectorResults([]);
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
      className="h-[95vh] md:h-auto flex flex-col"
    >
      <Separator />
      <div className="flex flex-col items-center mt-6 md:mt-0">
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
                        <div>
                          <label htmlFor="sectionName">
                            Ingrese el nombre del sector
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={sectorQuery}
                              onChange={(e) =>
                                handleSectorQueryChange(e.target.value)
                              }
                              className="relative mt-1 p-2 block w-full rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <Button
                              className="h-10"
                              onClick={() => {
                                console.log({ barCode, qrCode, quantity });
                                onConfirm({
                                  code: { barCode, sku },
                                  qrCode,
                                  quantity,
                                });
                                handleClose();
                              }}
                            >
                              Guardar
                            </Button>
                          </div>
                          {sectorResults.length > 0 && (
                            <ul className="absolute top-46 left-7 z-10 mt-2 bg-slate-50 border border-gray-300 rounded-md w-[90%] max-h-40 overflow-y-auto">
                              {sectorResults.map((sector) => (
                                <li
                                  key={sector.id}
                                  className="p-2 hover:bg-gray-300 cursor-pointer"
                                  onClick={() => handleSectorSelect(sector)}
                                >
                                  {sector.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {!qrMode && (
                          <Button
                            variant="default"
                            className="w-full mt-4 flex gap-6 bg-blue-500"
                            onClick={() => setQrMode(true)}
                          >
                            Escanear código QR
                            <QrCode />
                          </Button>
                        )}
                        {qrMode && (
                          <>
                            <p className="mt-6">
                              Escanea el código QR del sector.
                            </p>
                            <Webcam
                              audio={false}
                              ref={webcamRef}
                              screenshotFormat="image/jpeg"
                              videoConstraints={{
                                facingMode: { ideal: "environment" },
                              }}
                            />
                          </>
                        )}
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
                        onChange={(e) => setSku(e.target.value)}
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
                  videoConstraints={{
                    facingMode: { ideal: "environment" },
                  }}
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
                      <div>
                        <label htmlFor="sectionName">
                          Ingrese el nombre del sector
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={sectorQuery}
                            onChange={(e) =>
                              handleSectorQueryChange(e.target.value)
                            }
                            className="relative mt-1 p-2 block w-full rounded-md border-2 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                          <Button
                            className="h-10"
                            onClick={() => {
                              console.log({ barCode, qrCode, quantity });
                              onConfirm({
                                code: { barCode, sku },
                                qrCode,
                                quantity,
                              });
                              handleClose();
                            }}
                          >
                            Guardar
                          </Button>
                        </div>
                        {sectorResults.length > 0 && (
                          <ul className="absolute top-46 left-7 z-10 mt-2 bg-slate-50 border border-gray-300 rounded-md w-[90%] max-h-40 overflow-y-auto">
                            {sectorResults.map((sector) => (
                              <li
                                key={sector.id}
                                className="p-2 hover:bg-gray-300 cursor-pointer"
                                onClick={() => handleSectorSelect(sector)}
                              >
                                {sector.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {!qrMode && (
                        <Button
                          variant="default"
                          className="w-full mt-4 flex gap-6 bg-blue-500"
                          onClick={() => setQrMode(true)}
                        >
                          Escanear código QR
                          <QrCode />
                        </Button>
                      )}
                      {qrMode && (
                        <>
                          <p className="mt-6">
                            Escanea el código QR del sector.
                          </p>
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                              facingMode: { ideal: "environment" },
                            }}
                          />
                        </>
                      )}
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
