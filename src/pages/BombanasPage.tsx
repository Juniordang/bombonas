import { useState } from "react";
import { Search, Download, SlidersHorizontal, MapPin } from "lucide-react";
import Header from "@/components/Header";
import BombanaCard, { Bombana } from "@/components/BombanaCard";
import BombanaFormDialog from "@/components/BombanaFormDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Dados expandidos de exemplo
const mockBombanas: Bombana[] = [
  {
    id: "1",
    qrCode: "BOM001",
    status: "disponivel",
    localizacao: "Depósito A - Setor 1",
    ultimaAtualizacao: "Hoje às 14:30",
    capacidade: "13kg",
  },
  {
    id: "2",
    qrCode: "BOM002",
    status: "em-uso",
    localizacao: "Cliente - Rua das Flores, 123",
    ultimaAtualizacao: "Ontem às 09:15",
    capacidade: "13kg",
  },
  {
    id: "3",
    qrCode: "BOM003",
    status: "manutencao",
    localizacao: "Oficina - Setor Manutenção",
    ultimaAtualizacao: "Há 2 dias",
    capacidade: "13kg",
  },
  {
    id: "4",
    qrCode: "BOM004",
    status: "disponivel",
    localizacao: "Depósito B - Setor 2",
    ultimaAtualizacao: "Hoje às 10:00",
    capacidade: "20kg",
  },
  {
    id: "5",
    qrCode: "BOM005",
    status: "em-uso",
    localizacao: "Cliente - Av. Principal, 456",
    ultimaAtualizacao: "Hoje às 08:45",
    capacidade: "13kg",
  },
  {
    id: "6",
    qrCode: "BOM006",
    status: "disponivel",
    localizacao: "Depósito A - Setor 3",
    ultimaAtualizacao: "Há 1 hora",
    capacidade: "20kg",
  },
];

const BombanasPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recente");
  const [selectedBombanas, setSelectedBombanas] = useState<string[]>([]);

  const handleExportData = () => {
    toast.success("Lista exportada com sucesso!");
  };

  const handleBulkAction = (action: string) => {
    if (selectedBombanas.length === 0) {
      toast.error("Selecione pelo menos uma bombana");
      return;
    }
    toast.success(`Ação "${action}" aplicada a ${selectedBombanas.length} bombana(s)`);
    setSelectedBombanas([]);
  };

  const toggleBombanaSelection = (id: string) => {
    setSelectedBombanas(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const filteredBombanas = mockBombanas.filter((bombana) =>
    bombana.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bombana.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterByStatus = (status: Bombana["status"]) => {
    return filteredBombanas.filter((b) => b.status === status);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Gerenciar Bombanas
              </h1>
              <p className="text-muted-foreground">
                Total de {mockBombanas.length} bombanas cadastradas
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <BombanaFormDialog />
            </div>
          </div>

          {/* Barra de filtros e ações */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por QR Code ou localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recente">Mais Recente</SelectItem>
                    <SelectItem value="antigo">Mais Antigo</SelectItem>
                    <SelectItem value="qrcode">QR Code</SelectItem>
                    <SelectItem value="localizacao">Localização</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver no Mapa
                </Button>
              </div>

              {/* Ações em massa */}
              {selectedBombanas.length > 0 && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium">
                    {selectedBombanas.length} selecionada(s)
                  </span>
                  <div className="flex gap-2 ml-auto">
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("manutencao")}>
                      Manutenção
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("disponivel")}>
                      Marcar Disponível
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedBombanas([])}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="todas" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todas">Todas ({filteredBombanas.length})</TabsTrigger>
              <TabsTrigger value="disponivel">Disponíveis ({filterByStatus("disponivel").length})</TabsTrigger>
              <TabsTrigger value="em-uso">Em Uso ({filterByStatus("em-uso").length})</TabsTrigger>
              <TabsTrigger value="manutencao">Manutenção ({filterByStatus("manutencao").length})</TabsTrigger>
            </TabsList>

            <TabsContent value="todas" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredBombanas.map((bombana) => (
                  <div key={bombana.id} className="relative">
                    <Checkbox
                      className="absolute top-4 left-4 z-10 bg-background"
                      checked={selectedBombanas.includes(bombana.id)}
                      onCheckedChange={() => toggleBombanaSelection(bombana.id)}
                    />
                    <BombanaCard bombana={bombana} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="disponivel" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filterByStatus("disponivel").map((bombana) => (
                  <div key={bombana.id} className="relative">
                    <Checkbox
                      className="absolute top-4 left-4 z-10 bg-background"
                      checked={selectedBombanas.includes(bombana.id)}
                      onCheckedChange={() => toggleBombanaSelection(bombana.id)}
                    />
                    <BombanaCard bombana={bombana} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="em-uso" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filterByStatus("em-uso").map((bombana) => (
                  <div key={bombana.id} className="relative">
                    <Checkbox
                      className="absolute top-4 left-4 z-10 bg-background"
                      checked={selectedBombanas.includes(bombana.id)}
                      onCheckedChange={() => toggleBombanaSelection(bombana.id)}
                    />
                    <BombanaCard bombana={bombana} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="manutencao" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filterByStatus("manutencao").map((bombana) => (
                  <div key={bombana.id} className="relative">
                    <Checkbox
                      className="absolute top-4 left-4 z-10 bg-background"
                      checked={selectedBombanas.includes(bombana.id)}
                      onCheckedChange={() => toggleBombanaSelection(bombana.id)}
                    />
                    <BombanaCard bombana={bombana} />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default BombanasPage;
