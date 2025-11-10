"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";

import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface BombanaMapProps {
  localizacao: string; // label/descrição (ex.: "Filial SP")
  lat?: number;
  lng?: number;
  accuracy?: number; // metros (opcional)
}

/** Corrige ícone padrão do Leaflet (bundlers) */
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/** Componente interno que configura o mapa imperativamente (sem props center/attribution/radius) */
function InitLayers({
  center,
  radius,
}: {
  center: LatLngExpression | null;
  radius: number;
}) {
  const map = useMap();

  useEffect(() => {
    // camada base
    const tile = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        // se o seu TS implicar com 'attribution', passamos direto aqui sem tipagem do react-leaflet
        attribution: "© OpenStreetMap contributors",
      }
    ).addTo(map);

    // se houver coordenadas, posiciona, marker e círculo
    let marker: L.Marker | null = null;
    let circle: L.Circle | null = null;

    if (center) {
      map.setView(center, 16);
      marker = L.marker(center).addTo(map);
      circle = L.circle(center, {
        radius,
        color: "#2563eb",
        weight: 2,
        fillOpacity: 0.12,
      }).addTo(map);
    }

    // cleanup ao desmontar
    return () => {
      map.removeLayer(tile);
      if (marker) map.removeLayer(marker);
      if (circle) map.removeLayer(circle);
    };
  }, [center, radius, map]);

  return null;
}

const BombanaMap = ({ localizacao, lat, lng, accuracy }: BombanaMapProps) => {
  const hasCoords = typeof lat === "number" && typeof lng === "number";
  const center = hasCoords ? ([lat!, lng!] as LatLngExpression) : null;
  const radius = accuracy && accuracy > 10 ? accuracy : 10;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localização GPS
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative aspect-video rounded-lg overflow-hidden">
          {/* Mapa real ocupa todo o container */}
          <MapContainer
            // evitamos 'center' nas props para não bater no seu erro de typings
            // o tamanho é controlado via CSS
            className="absolute inset-0"
            style={{ height: "100%", width: "100%" }}
          >
            <InitLayers center={center} radius={radius} />
          </MapContainer>

          {/* Overlay com info e ação */}
          <div className="absolute left-3 bottom-3 z-[400] rounded-md bg-white/90 backdrop-blur px-3 py-2 shadow">
            <p className="text-sm font-semibold">{localizacao}</p>
            <p className="text-xs text-muted-foreground">
              {hasCoords
                ? `Lat: ${lat?.toFixed(6)}, Long: ${lng?.toFixed(6)}`
                : "Aguardando coordenadas…"}
            </p>
            {hasCoords && (
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Abrir no Google Maps
              </a>
            )}
          </div>

          {/* Se não tiver coords ainda, mostra um “grid/placeholder” por baixo */}
          {!hasCoords && (
            <div className="absolute inset-0 opacity-10">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BombanaMap;
