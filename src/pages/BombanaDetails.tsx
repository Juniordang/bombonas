import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Package, History, Edit } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const BombanaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dados de exemplo
  const bombana = {
    id: "1",
    qrCode: "BOM001",
    status: "disponivel",
    localizacao: "Depósito A - Setor 1",
    ultimaAtualizacao: "Hoje às 14:30",
    capacidade: "13kg",
    dataAquisicao: "15/01/2024",
    proximaManutencao: "15/07/2024",
  };

  const historico = [
    {
      data: "25/03/2024 14:30",
      acao: "Retorno ao depósito",
      localizacao: "Depósito A - Setor 1",
      responsavel: "João Silva",
    },
    {
      data: "20/03/2024 09:15",
      acao: "Entrega ao cliente",
      localizacao: "Rua das Flores, 123",
      responsavel: "Maria Santos",
    },
    {
      data: "15/03/2024 16:00",
      acao: "Manutenção concluída",
      localizacao: "Oficina - Setor Manutenção",
      responsavel: "Pedro Costa",
    },
  ];

  const statusConfig = {
    disponivel: {
      label: "Disponível",
      color: "bg-accent text-accent-foreground",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">#{bombana.qrCode}</CardTitle>
                    <p className="text-muted-foreground">Capacidade: {bombana.capacidade}</p>
                  </div>
                  <Badge className={statusConfig[bombana.status].color}>
                    {statusConfig[bombana.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Localização Atual</p>
                    <p className="font-medium">{bombana.localizacao}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Última Atualização</p>
                    <p className="font-medium">{bombana.ultimaAtualizacao}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data de Aquisição</p>
                    <p className="font-medium">{bombana.dataAquisicao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Próxima Manutenção</p>
                    <p className="font-medium">{bombana.proximaManutencao}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Movimentações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historico.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        {index < historico.length - 1 && (
                          <div className="w-px h-full bg-border mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="font-medium mb-1">{item.acao}</p>
                        <p className="text-sm text-muted-foreground mb-1">{item.data}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.localizacao} • {item.responsavel}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full gap-2">
                  <Edit className="h-4 w-4" />
                  Editar Informações
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Package className="h-4 w-4" />
                  Registrar Movimentação
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Calendar className="h-4 w-4" />
                  Agendar Manutenção
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-white rounded-lg p-4 flex items-center justify-center border">
                  <div className="text-center">
                    <Package className="h-20 w-20 mx-auto mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground">QR Code Visual</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Baixar QR Code
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BombanaDetails;
