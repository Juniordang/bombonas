// src/components/ui/QrCodeInput.tsx
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
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
  const [containerReady, setContainerReady] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Só tenta iniciar o scanner quando:
    // - o Dialog está aberto
    // - o div#qr-reader já foi montado (containerReady = true)
    if (!open || !containerReady) return;
    if (scannerRef.current) return; // já inicializado

    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader", // id do <div>
        {
          fps: 10,
          qrbox: 250,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          console.log("QR LIDO:", decodedText);
          onRead(decodedText);
          scanner.clear().catch(() => {});
          scannerRef.current = null;
          setOpen(false);
        },
        (err) => {
          // erros de leitura são normais, então ignora
          // console.log("scanner error:", err);
        }
      );

      scannerRef.current = scanner;
    } catch (err) {
      console.error("Erro ao iniciar Html5QrcodeScanner:", err);
    }

    // cleanup ao fechar / desmontar
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [open, containerReady, onRead]);

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

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            setContainerReady(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Escanear QR Code</DialogTitle>
          </DialogHeader>

          {/* Quando esse div monta, avisamos que o container está pronto */}
          <div
            id="qr-reader"
            className="mt-4"
            ref={() => {
              setContainerReady(true);
            }}
          />

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Aponte a câmera para o QR Code
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QrCodeButton;
