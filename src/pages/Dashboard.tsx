import { useEffect } from "react";
import { Package, Activity, AlertTriangle, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import BombanaCard, { Bombana } from "@/components/BombanaCard";
import { useBombanas } from "@/hooks/useBombanas";

const Dashboard = () => {
  const { bombanas, loading, fetchBombanas } = useBombanas();

  useEffect(() => {
    fetchBombanas();
  }, []);

  const disponiveisCount = bombanas.filter(b => b.status === "disponivel").length;
  const emUsoCount = bombanas.filter(b => b.status === "em-uso").length;
  const manutencaoCount = bombanas.filter(b => b.status === "manutencao").length;

  // Bombanas mais recentes (últimas 6)
  const recentBombanas = [...bombanas]
    .sort((a, b) => (b.dataAtualizacao?.getTime() || 0) - (a.dataAtualizacao?.getTime() || 0))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-4 sm:py-6 lg:py-8 px-4">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Visão geral do sistema de gerenciamento de bombanas
            {loading && " (carregando...)"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 lg:mb-8">
          <StatsCard
            title="Total de Bombanas"
            value={bombanas.length.toString()}
            icon={Package}
          />
          <StatsCard
            title="Disponíveis"
            value={disponiveisCount.toString()}
            icon={Activity}
            variant="success"
          />
          <StatsCard
            title="Em Uso"
            value={emUsoCount.toString()}
            icon={TrendingUp}
            variant="info"
          />
          <StatsCard
            title="Manutenção"
            value={manutencaoCount.toString()}
            icon={AlertTriangle}
            variant="warning"
          />
        </div>

        {/* Recent Activity */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold">Atividades Recentes</h2>
            {recentBombanas.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Mostrando as {recentBombanas.length} bombanas mais recentes
              </p>
            )}
          </div>
          {recentBombanas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma bombana cadastrada ainda</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {recentBombanas.map((bombana) => (
                <BombanaCard key={bombana.id} bombana={bombana} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
