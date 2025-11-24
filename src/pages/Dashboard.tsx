import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalBruto: number;
  totalTaxas: number;
  totalLiquido: number;
  transactionsCount: number;
  monthReceived: number;
  monthWithdrawn: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBruto: 0,
    totalTaxas: 0,
    totalLiquido: 0,
    transactionsCount: 0,
    monthReceived: 0,
    monthWithdrawn: 0,
  });

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      // Buscar transações pagas
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "paid");

      // Buscar saques do mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthPayouts } = await supabase
        .from("payouts")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "processed")
        .gte("created_at", startOfMonth.toISOString());

      const totalBruto = transactions?.reduce((sum, t) => sum + t.amount_cents, 0) || 0;
      const totalTaxas = transactions?.reduce((sum, t) => sum + t.fee_value, 0) || 0;
      const totalLiquido = transactions?.reduce((sum, t) => sum + t.net_value, 0) || 0;
      const monthWithdrawn = monthPayouts?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;

      setStats({
        totalBruto: totalBruto / 100,
        totalTaxas: totalTaxas / 100,
        totalLiquido: totalLiquido / 100,
        transactionsCount: transactions?.length || 0,
        monthReceived: totalLiquido / 100,
        monthWithdrawn: monthWithdrawn / 100,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua conta</p>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Bruto</p>
          <h3 className="text-3xl font-bold mb-2">
            {stats.totalBruto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
          <p className="text-xs text-muted-foreground">Valor total das vendas</p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total de Taxas (5%)</p>
          <h3 className="text-3xl font-bold mb-2">
            {stats.totalTaxas.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
          <p className="text-xs text-muted-foreground">Taxa da plataforma</p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Líquido</p>
          <h3 className="text-3xl font-bold mb-2">
            {stats.totalLiquido.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
          <p className="text-xs text-muted-foreground">Valor após taxas</p>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Transações Totais</p>
          <h3 className="text-2xl font-bold">{stats.transactionsCount}</h3>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Recebido (total)</p>
          <h3 className="text-2xl font-bold">
            {stats.monthReceived.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Saques (mês)</p>
          <h3 className="text-2xl font-bold">
            {stats.monthWithdrawn.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
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
