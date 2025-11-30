// src/components/ui/QrCodeInput.tsx
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerKey, setScannerKey] = useState(0); // Key para forçar recriação do DOM

  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerIdRef = useRef(
    `qr-reader-${Math.random().toString(36).substr(2, 9)}`
  );

  const stopScanner = async () => {
    if (qrCodeRef.current && isScanning) {
      try {
        console.log("Parando scanner...");
        await qrCodeRef.current.stop();
        qrCodeRef.current.clear();
        console.log("Scanner parado com sucesso");
      } catch (error) {
        console.log("Erro ao parar scanner:", error);
      } finally {
        qrCodeRef.current = null;
        setIsScanning(false);
      }
    }
  };

  const resetScanner = () => {
    console.log("Reinicializando DOM do scanner...");
    setScannerKey((prev) => prev + 1); // Força recriação do elemento
    setCameraError(null);
    setIsScanning(false);
  };

  // Inicia/para a câmera sempre que o dialog abre/fecha
  useEffect(() => {
    if (!open) {
      // Quando fecha, para o scanner e reinicializa o DOM
      stopScanner().then(() => {
        resetScanner();
      });
      return;
    }

    setCameraError(null);
    setIsScanning(false);

    const startScanner = async () => {
      // Aguarda o DOM ser atualizado e o container estar disponível
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!containerRef.current) {
        console.error("Container ref não encontrado após delay");
        return;
      }

      try {
        // Para qualquer scanner existente antes de criar um novo
        await stopScanner();

        // Cria uma nova instância do scanner
        console.log("Criando novo scanner com ID:", scannerIdRef.current);
        qrCodeRef.current = new Html5Qrcode(scannerIdRef.current);

        await qrCodeRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Leu um código
            console.log("QR Code lido:", decodedText);
            onRead(decodedText);
            setOpen(false);
          },
          (errorMessage) => {
            // Erros de leitura são normais, não precisa logar tudo
            if (
              errorMessage.includes("No multi format readers configured") ||
              errorMessage.includes("NotFoundException")
            ) {
              return; // Ignora erros internos da biblioteca
            }
            console.log("Erro de leitura:", errorMessage);
          }
        );

        setIsScanning(true);
        console.log("Scanner iniciado com sucesso");
      } catch (err: any) {
        console.error("Erro ao iniciar Html5Qrcode:", err);
        const msg = String(err?.message ?? err);

        if (
          msg.includes("NotAllowedError") ||
          msg.includes("Permission denied")
        ) {
          setCameraError(
            "Não foi possível acessar a câmera. Verifique se o navegador tem permissão para este site."
          );
        } else if (
          msg.includes("NotFoundError") ||
          msg.includes("No camera found")
        ) {
          setCameraError("Nenhuma câmera foi encontrada neste dispositivo.");
        } else if (msg.includes("NotSupportedError")) {
          setCameraError("Seu navegador não suporta acesso à câmera.");
        } else {
          setCameraError(
            "Erro ao iniciar o leitor de QR Code. Tente recarregar a página."
          );
        }

        // Limpa a referência em caso de erro
        qrCodeRef.current = null;
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      // Cleanup para quando o componente desmontar ou o open mudar
      stopScanner();
    };
  }, [open, onRead, scannerKey]); // Adicionei scannerKey como dependência

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      // Quando fecha, reinicializa tudo
      stopScanner().then(() => {
        resetScanner();
      });
    }
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

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Escanear QR Code</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {/* Key força recriação completa do DOM */}
            <div
              key={scannerKey}
              id={scannerIdRef.current}
              ref={containerRef}
              className="h-[260px] w-full overflow-hidden rounded-md border bg-muted/20 flex items-center justify-center"
            >
              {!isScanning && !cameraError && (
                <p className="text-sm text-muted-foreground">
                  Iniciando câmera...
                </p>
              )}
            </div>
          </div>

          {cameraError ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-red-500 text-center">{cameraError}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="flex-1"
                >
                  Fechar
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    resetScanner();
                    setOpen(true);
                  }}
                  className="flex-1"
                >
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground text-center">
              Aponte a câmera para o QR Code. A leitura é automática.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QrCodeButton;
