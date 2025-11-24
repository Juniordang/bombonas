import { useParams, Link } from "react-router-dom";
import {
  Package,
  MapPin,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  QrCode,
  Activity,
} from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BombanaMap from "@/components/BombanaMap";
import ActivityTimeline from "@/components/ActivityTimeline";
import BombanaFormDialog from "@/components/BombanaFormDialog";
import { toast } from "sonner";

const BombanaDetails = () => {
  const { id } = useParams();

  // Dados mockados - em produção isso viria de uma API ou banco
  const bombana = {
    id: id || "1",
    qrCode: "BOM001",
    status: "disponivel" as const,
    localizacao: "Unipar cianorte",
    ultimaAtualizacao: "Hoje às 14:30",
    capacidade: "13kg",
    lat: -23.653139,
    lng: -52.613303,
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      disponivel: "Disponível",
      "em-uso": "Em Uso",
      manutencao: "Manutenção",
    };
    return labels[status] || status;
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      disponivel: "default",
      "em-uso": "secondary",
      manutencao: "destructive",
    };
    return variants[status] || "default";
  };

  const handleDisable = () => {
    toast.error("Tem certeza que deseja excluir esta bombana?");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/bombanas">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={handleDisable}>
              <Trash2 className="h-4 w-4 mr-2" />
              Desativar
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">QR Code</span>
                <span className="font-semibold">{bombana.qrCode}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Capacidade
                </span>
                <span className="font-semibold">{bombana.capacidade}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusVariant(bombana.status)}>
                  {getStatusLabel(bombana.status)}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Última atualização
                </span>
                <p className="text-sm font-medium">
                  {bombana.ultimaAtualizacao}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <BombanaMap
              localizacao={bombana.localizacao}
              lat={bombana.lat}
              lng={bombana.lng}
              accuracy={12}
            />
          </div>
        </div>

        <div className="mt-6">
          <ActivityTimeline />
        </div>
      </main>
    </div>
  );
};

export default BombanaDetails;
