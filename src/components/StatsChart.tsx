import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
  { mes: "Jan", disponivel: 28, emUso: 15, manutencao: 5 },
  { mes: "Fev", disponivel: 25, emUso: 18, manutencao: 5 },
  { mes: "Mar", disponivel: 30, emUso: 13, manutencao: 5 },
  { mes: "Abr", disponivel: 27, emUso: 16, manutencao: 5 },
  { mes: "Mai", disponivel: 28, emUso: 15, manutencao: 5 },
  { mes: "Jun", disponivel: 28, emUso: 15, manutencao: 5 },
];

const chartConfig = {
  disponivel: {
    label: "Disponível",
    color: "hsl(var(--chart-2))",
  },
  emUso: {
    label: "Em Uso",
    color: "hsl(var(--chart-4))",
  },
  manutencao: {
    label: "Manutenção",
    color: "hsl(var(--chart-3))",
  },
};

const StatsChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas dos Últimos 6 Meses</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorDisponivel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorEmUso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorManutencao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="mes" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="disponivel" 
                stroke="hsl(var(--chart-2))" 
                fillOpacity={1}
                fill="url(#colorDisponivel)"
              />
              <Area 
                type="monotone" 
                dataKey="emUso" 
                stroke="hsl(var(--chart-4))" 
                fillOpacity={1}
                fill="url(#colorEmUso)"
              />
              <Area 
                type="monotone" 
                dataKey="manutencao" 
                stroke="hsl(var(--chart-3))" 
                fillOpacity={1}
                fill="url(#colorManutencao)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default StatsChart;
