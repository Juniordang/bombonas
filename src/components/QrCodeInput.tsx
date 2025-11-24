"use client";

import { useState } from "react";
import QrScanner from "react-qr-scanner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QrCodeButtonProps {
  onRead: (value: string) => void;
}

const QrCodeButton = ({ onRead }: QrCodeButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleScan = (data: { text?: string } | string | null) => {
    if (!data) return;

    const text = typeof data === "string" ? data : data.text;

    if (text) {
      onRead(text);
      setOpen(false);
    }
  };

  const handleError = (err: any) => {
    console.error("QR error:", err);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full justify-start"
      >
        Ler QR Code
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Escanear QR Code</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QrCodeButton;
