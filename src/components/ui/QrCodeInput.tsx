"use client";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { QrCode, X } from "lucide-react";

type Props = {
  onRead: (qrText: string) => void;
};

export default function QrCodeButton({ onRead }: Props) {
  const [openScanner, setOpenScanner] = useState(false);

  return (
    <>
      {/* Botão que abre o leitor */}
      <Button
        type="button"
        variant="default"
        className="flex items-center gap-2"
        onClick={() => setOpenScanner(true)}
      >
        <QrCode className="w-5 h-5" />
        Ler QR Code
      </Button>

      {/* Modal do leitor de QR */}
      {openScanner && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 shadow-xl w-[90%] max-w-md relative">
            <button
              onClick={() => setOpenScanner(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-3 text-center">
              Escanear QR Code
            </h3>

            <Scanner
              onScan={(results) => {
                const text = results?.[0]?.rawValue;
                if (text) {
                  onRead(text.toUpperCase());
                  setOpenScanner(false);
                }
              }}
              onError={(err) => console.warn("Erro no scanner:", err)}
              constraints={{ facingMode: "environment" }}
              components={{
                finder: true, // mostra o retângulo central
                torch: true, // adiciona botão de flash (quando disponível)
              }}
              styles={{
                container: { width: "100%" },
                video: {
                  width: "100%",
                  maxHeight: 320,
                  borderRadius: "0.75rem",
                },
              }}
            />

            <p className="text-sm text-center text-gray-500 mt-2">
              Aponte a câmera para o QR Code
            </p>
          </div>
        </div>
      )}
    </>
  );
}
