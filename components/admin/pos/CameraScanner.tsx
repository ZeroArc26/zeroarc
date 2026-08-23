"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { X } from "lucide-react";

interface CameraScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function CameraScanner({ onScan, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stopped = false;
    let controls: { stop: () => void } | null = null;

    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current!, (result, err, ctrls) => {
        controls = ctrls;
        if (result && !stopped) {
          stopped = true;
          onScan(result.getText());
          ctrls.stop();
        }
      })
      .catch((err) => {
        console.error("Camera scan error:", err);
        setError("Could not access the camera. Check browser permissions.");
      });

    return () => {
      stopped = true;
      controls?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <p className="mb-4 text-sm text-white/70">Point the camera at a barcode</p>

      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20">
        <video ref={videoRef} className="w-full" muted autoPlay playsInline />
      </div>

      {error && <p className="mt-4 max-w-sm text-center text-sm text-red-400">{error}</p>}
    </div>
  );
}
