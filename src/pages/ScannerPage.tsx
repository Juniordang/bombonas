import { useState } from "react";
import { QrCode, Camera, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ScannerPage = () => {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const navigate = useNavigate();

  const handleStartScan = () => {
    setScanning(true);
    // Simula escaneamento após 2 segundos
    setTimeout(() => {
      const mockCode = "BOM001";
      toast.success(`QR Code escaneado: ${mockCode}`);
      setScanning(false);
      navigate(`/bombanas/1`);
    }, 2000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      toast.success(`Código inserido: ${manualCode}`);
      // Aqui você buscaria a bombana pelo código
      navigate(`/bombanas/1`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Scanner de QR Code</h1>
            <p className="text-muted-foreground">
              Escaneie o QR Code da bombana ou insira o código manualmente
            </p>
          </div>

          {/* Scanner Card */}
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                {scanning ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 border-4 border-primary/30 rounded-xl animate-pulse"></div>
                      <div className="relative z-10 h-64 w-64 border-4 border-primary rounded-xl flex items-center justify-center">
                        <Camera className="h-24 w-24 text-primary animate-pulse" />
                      </div>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-primary animate-scan"></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="h-32 w-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-primary-foreground" />
                    </div>
                    <p className="text-lg font-medium text-muted-foreground mb-6">
                      Clique no botão abaixo para iniciar o escaneamento
                    </p>
                    <Button
                      size="lg"
                      onClick={handleStartScan}
                      className="gap-2"
                    >
                      <Camera className="h-5 w-5" />
                      Iniciar Scanner
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {scanning && (
            <Button
              variant="outline"
              onClick={() => setScanning(false)}
              className="w-full gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar Escaneamento
            </Button>
          )}

          {/* Manual Input */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Inserir Código Manualmente</h3>
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <Input
                  placeholder="Digite o código da bombana..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">Buscar</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ScannerPage;
