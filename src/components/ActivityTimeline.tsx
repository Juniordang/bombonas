import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, Wrench, CheckCircle, Clock } from "lucide-react";

interface TimelineItem {
  id: string;
  tipo: "disponivel" | "em-uso" | "manutencao" | "entrega";
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
}

const mockTimeline: TimelineItem[] = [
  {
    id: "1",
    tipo: "em-uso",
    titulo: "Em Uso pelo Cliente",
    descricao: "Bombana entregue ao cliente em Rua das Flores, 123",
    data: "Hoje",
    hora: "14:30",
  },
  {
    id: "2",
    tipo: "entrega",
    titulo: "Em Transporte",
    descricao: "Saiu do depósito para entrega",
    data: "Hoje",
    hora: "13:45",
  },
  {
    id: "3",
    tipo: "disponivel",
    titulo: "Disponível no Depósito",
    descricao: "Bombana liberada após inspeção de qualidade",
    data: "Ontem",
    hora: "16:20",
  },
  {
    id: "4",
    tipo: "manutencao",
    titulo: "Manutenção Concluída",
    descricao: "Manutenção preventiva realizada com sucesso",
    data: "Há 2 dias",
    hora: "11:00",
  },
];

const getIcon = (tipo: TimelineItem["tipo"]) => {
  switch (tipo) {
    case "disponivel":
      return <Package className="h-4 w-4" />;
    case "em-uso":
      return <CheckCircle className="h-4 w-4" />;
    case "manutencao":
      return <Wrench className="h-4 w-4" />;
    case "entrega":
      return <Truck className="h-4 w-4" />;
  }
};

const getColor = (tipo: TimelineItem["tipo"]) => {
  switch (tipo) {
    case "disponivel":
      return "bg-success text-success-foreground";
    case "em-uso":
      return "bg-info text-info-foreground";
    case "manutencao":
      return "bg-warning text-warning-foreground";
    case "entrega":
      return "bg-primary text-primary-foreground";
  }
};

const ActivityTimeline = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Atividades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {mockTimeline.map((item, index) => (
            <div key={item.id} className="relative flex gap-4">
              {/* Linha vertical */}
              {index < mockTimeline.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
              )}
              
              {/* Ícone */}
              <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getColor(item.tipo)}`}>
                {getIcon(item.tipo)}
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{item.titulo}</h4>
                  <span className="text-xs text-muted-foreground">{item.data}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.descricao}</p>
                <p className="text-xs text-muted-foreground">{item.hora}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
