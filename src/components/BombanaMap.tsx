import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface BombanaMapProps {
  localizacao: string;
}

const BombanaMap = ({ localizacao }: BombanaMapProps) => {
  // Simulação de mapa - em produção, integrar com Google Maps, Mapbox, etc
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localização GPS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden">
          {/* Placeholder do mapa */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{localizacao}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Lat: -23.550520, Long: -46.633308
                </p>
              </div>
            </div>
          </div>
          {/* Grid de fundo para parecer um mapa */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BombanaMap;
