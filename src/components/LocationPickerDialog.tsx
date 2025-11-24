import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LocationPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (location: string) => void;
}

const LocationPickerDialog = ({
  open,
  onOpenChange,
  onSelect,
}: LocationPickerDialogProps) => {
  const fakeLat = -23.653313;
  const fakeLng = -52.613303;

  const handleUseFakeLocation = () => {
    const loc = `Lat: ${fakeLat.toFixed(6)}, Lng: ${fakeLng.toFixed(6)}`;
    onSelect(loc);
    onOpenChange(false);
  };

  const handleClearLocation = () => {
    onSelect("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="space-y-1">
          <DialogTitle>Escolher localização no mapa</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Em breve aqui você poderá selecionar diretamente no mapa. Por
            enquanto, use a localização de teste abaixo ou limpe o campo.
          </p>
        </DialogHeader>

        <div className="mt-3 space-y-4">
          <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Localização sugerida (teste)
            </p>
            <p className="font-mono text-sm">
              Lat: {fakeLat.toFixed(6)}, Lng: {fakeLng.toFixed(6)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearLocation}
            >
              Limpar localização
            </Button>

            <Button type="button" onClick={handleUseFakeLocation}>
              Usar localização sugerida
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPickerDialog;
