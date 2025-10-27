import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Header from "@/components/Header";
import BombanaCard, { Bombana } from "@/components/BombanaCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  const filteredBombanas = mockBombanas.filter((bombana) => {
    const matchesSearch = 
      bombana.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bombana.localizacao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || bombana.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Bombanas</h1>
            <p className="text-muted-foreground">
              Gerencie todas as bombanas cadastradas no sistema
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Bombana
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="disponivel">Disponível</SelectItem>
              <SelectItem value="em-uso">Em Uso</SelectItem>
              <SelectItem value="manutencao">Manutenção</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Bombanas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBombanas.map((bombana) => (
            <BombanaCard key={bombana.id} bombana={bombana} />
          ))}
        </div>

        {filteredBombanas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma bombana encontrada com os filtros aplicados.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BombanasPage;
