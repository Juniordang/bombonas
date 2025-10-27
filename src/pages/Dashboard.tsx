import { Package, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import BombanaCard, { Bombana } from "@/components/BombanaCard";

// Dados de exemplo
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
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de gerenciamento de bombanas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total de Bombanas"
            value="48"
            icon={Package}
            trend={{ value: "12% vs. mês anterior", positive: true }}
          />
          <StatsCard
            title="Disponíveis"
            value="28"
            icon={Activity}
            variant="success"
          />
          <StatsCard
            title="Em Uso"
            value="15"
            icon={TrendingUp}
            variant="info"
          />
          <StatsCard
            title="Manutenção"
            value="5"
            icon={AlertTriangle}
            variant="warning"
          />
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Atividades Recentes</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockBombanas.map((bombana) => (
              <BombanaCard key={bombana.id} bombana={bombana} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
