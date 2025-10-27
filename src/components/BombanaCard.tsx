import { Link } from "react-router-dom";
import { MapPin, Calendar, QrCode } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export interface Bombana {
  id: string;
  qrCode: string;
  status: "disponivel" | "em-uso" | "manutencao";
  localizacao: string;
  ultimaAtualizacao: string;
  capacidade: string;
}

interface BombanaCardProps {
  bombana: Bombana;
}

const statusConfig = {
  disponivel: {
    label: "Disponível",
    variant: "default" as const,
    color: "bg-accent text-accent-foreground",
  },
  "em-uso": {
    label: "Em Uso",
    variant: "secondary" as const,
    color: "bg-blue-500 text-white",
  },
  manutencao: {
    label: "Manutenção",
    variant: "destructive" as const,
    color: "bg-orange-500 text-white",
  },
};

const BombanaCard = ({ bombana }: BombanaCardProps) => {
  const status = statusConfig[bombana.status];

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">#{bombana.qrCode}</h3>
              <p className="text-sm text-muted-foreground">{bombana.capacidade}</p>
            </div>
          </div>
          <Badge className={status.color}>
            {status.label}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{bombana.localizacao}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Atualizado: {bombana.ultimaAtualizacao}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link to={`/bombanas/${bombana.id}`}>
            Ver Detalhes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BombanaCard;
