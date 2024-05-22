import React, { useRef, useEffect } from "react";
import QRCode from "qrcode.react";

interface QrCodeWithTextProps {
  text: string;
  qrValue: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const QrCodeWithText: React.FC<QrCodeWithTextProps> = ({
  text,
  qrValue,
  canvasRef,
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const qrCanvas = document.querySelector("canvas") as HTMLCanvasElement;

    if (canvas && qrCanvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, 20);
        ctx.drawImage(qrCanvas, 0, 30);
      }
    }
  }, [text, qrValue]);

  return (
    <>
      <QRCode
        value={text}
        size={150}
        includeMargin={true}
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} width={200} height={200} />
    </>
  );
};

export default QrCodeWithText;
