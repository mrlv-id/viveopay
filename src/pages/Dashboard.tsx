import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { time: "00:00", value: 0 },
  { time: "04:00", value: 5000 },
  { time: "08:00", value: 12000 },
  { time: "12:00", value: 18000 },
  { time: "16:00", value: 25000 },
  { time: "20:00", value: 32000 },
  { time: "23:59", value: 38534.76 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua conta</p>
      </div>

      {/* Main Comparison Card */}
      <Card className="p-8 bg-card border-border">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Comparação</p>
          <h2 className="text-4xl font-bold">R$ 38.534,76</h2>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Transações do Mês</p>
          <h3 className="text-2xl font-bold">0</h3>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Recebido (mês)</p>
          <h3 className="text-2xl font-bold">R$ 0,00</h3>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Saques (mês)</p>
          <h3 className="text-2xl font-bold">R$ 0,00</h3>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma transação ainda
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4">Pagamentos Recentes</h3>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum pagamento ainda
          </div>
        </Card>
      </div>
    </div>
  );
}
