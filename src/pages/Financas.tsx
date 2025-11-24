import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Transaction {
  id: string;
  amount_cents: number;
  status: string;
  payment_method: string | null;
  payer_name: string | null;
  payer_email: string | null;
  paid_at: string | null;
  created_at: string;
  asaas_invoice_url: string | null;
}

interface Payout {
  id: string;
  amount_cents: number;
  status: string;
  pix_key: string;
  processed_at: string | null;
  created_at: string;
}

export default function Financas() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState({
    available: 0,
    withdrawn: 0,
    processing: 0,
  });

  useEffect(() => {
    if (user) {
      loadTransactions();
      loadPayouts();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
      toast.error("Erro ao carregar transações");
    }
  };

  const loadPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from("payouts")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayouts(data || []);
    } catch (error) {
      console.error("Erro ao carregar saques:", error);
      toast.error("Erro ao carregar saques");
    }
  };

  const calculateStats = (transactions: Transaction[]) => {
    const paid = transactions.filter((t) => t.status === "paid");
    const totalPaid = paid.reduce((sum, t) => sum + t.amount_cents, 0);
    
    // Calcular saques processados
    const withdrawnAmount = payouts
      .filter((p) => p.status === "processed")
      .reduce((sum, p) => sum + p.amount_cents, 0);

    // Calcular em processamento
    const processingAmount = payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount_cents, 0);

    setStats({
      available: (totalPaid - withdrawnAmount - processingAmount) / 100,
      withdrawn: withdrawnAmount / 100,
      processing: processingAmount / 100,
    });
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: "Pago",
      pending: "Pendente",
      overdue: "Vencido",
      refunded: "Reembolsado",
      failed: "Falhou",
      disputed: "Contestado",
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Finanças</h1>
          <p className="text-muted-foreground">Controle completo das suas finanças</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Solicitar Saque PIX
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Saldo Total</p>
          <h3 className="text-3xl font-bold mb-2">
            {stats.available.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
          <p className="text-xs text-muted-foreground">Disponível para saque</p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Saques Realizados</p>
          <h3 className="text-3xl font-bold mb-2">
            {stats.withdrawn.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
          <p className="text-xs text-muted-foreground">Total no período</p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Em Processamento</p>
          <h3 className="text-3xl font-bold mb-2">
            {stats.processing.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
          <p className="text-xs text-muted-foreground">Aguardando liberação</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Histórico de Pagamentos</h3>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum pagamento encontrado
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.payer_name || "Cliente"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(transaction.amount_cents)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getStatusLabel(transaction.status)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Histórico de Saques</h3>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          {payouts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum saque realizado
            </div>
          ) : (
            <div className="space-y-3">
              {payouts.slice(0, 5).map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payout.status)}
                    <div>
                      <p className="font-medium text-sm">Saque PIX</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payout.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(payout.amount_cents)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getStatusLabel(payout.status)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
