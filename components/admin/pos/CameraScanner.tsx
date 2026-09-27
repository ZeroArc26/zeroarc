"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { DecodeHintType, BarcodeFormat } from "@zxing/library";
import { X, Flashlight, FlashlightOff } from "lucide-react";

interface CameraScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function CameraScanner({ onScan, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  useEffect(() => {
    // Restrict decoding to CODE128 only (the format every ZeroArc
    // barcode is generated in) — checking every possible symbology on
    // each frame is slower and, on a fuzzy/small live feed, sometimes
    // causes MORE misreads than a single targeted format.
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const codeReader = new BrowserMultiFormatReader(hints);
    let stopped = false;
    let controls: { stop: () => void } | null = null;

    // Explicitly request the REAR camera (mobile browsers otherwise
    // default to the front/selfie camera) at as high a resolution as
    // the device allows — small/dense printed barcodes need fine bar
    // resolution that a low-res stream simply can't capture.
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        advanced: [{ focusMode: "continuous" } as unknown as MediaTrackConstraintSet],
      },
    };

    codeReader
      .decodeFromConstraints(constraints, videoRef.current!, (result, err, ctrls) => {
        controls = ctrls;
        if (result && !stopped) {
          stopped = true;
          onScan(result.getText());
          ctrls.stop();
        }
      })
      .then(() => {
        // Check whether this camera supports a torch (flashlight) —
        // helps a lot scanning in dim in-store lighting.
        const stream = videoRef.current?.srcObject as MediaStream | undefined;
        if (stream) {
          streamRef.current = stream;
          const track = stream.getVideoTracks()[0];
          const capabilities = track?.getCapabilities?.() as
            | (MediaTrackCapabilities & { torch?: boolean })
            | undefined;
          if (capabilities?.torch) setTorchSupported(true);
        }
      })
      .catch((err) => {
        console.error("Camera scan error:", err);
        setError("Could not access the rear camera. Check browser permissions.");
      });

    return () => {
      stopped = true;
      controls?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleTorch() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    const next = !torchOn;
    track
      .applyConstraints({ advanced: [{ torch: next } as unknown as MediaTrackConstraintSet] })
      .then(() => setTorchOn(next))
      .catch((err) => console.error("Torch toggle failed:", err));
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {torchSupported && (
        <button
          onClick={toggleTorch}
          className="absolute right-4 top-16 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/20"
        >
          {torchOn ? <FlashlightOff className="h-4 w-4" /> : <Flashlight className="h-4 w-4" />}
          {torchOn ? "Off" : "Light"}
        </button>
      )}

      <p className="mb-4 text-sm text-white/70">
        Hold steady, ~10-15cm away, good light on the tag
      </p>

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20">
        <video ref={videoRef} className="w-full" muted autoPlay playsInline />
        {/* Scan-guide frame — helps the cashier find the right
            distance/angle; doesn't affect decoding itself. */}
        <div className="pointer-events-none absolute inset-x-8 top-1/2 h-24 -translate-y-1/2 rounded-lg border-2 border-violet-400/80" />
      </div>

      {error && <p className="mt-4 max-w-sm text-center text-sm text-red-400">{error}</p>}
    </div>
  );
}
