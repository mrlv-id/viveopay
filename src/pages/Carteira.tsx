import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Carteira() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadWalletBalance();
      loadTransactions();
    }
  }, [user]);

  const loadWalletBalance = async () => {
    try {
      // Buscar todas as transações pagas
      const { data: paidTransactions } = await supabase
        .from("transactions")
        .select("net_value")
        .eq("user_id", user?.id)
        .eq("status", "paid");

      // Buscar saques processados
      const { data: processedPayouts } = await supabase
        .from("payouts")
        .select("amount_cents")
        .eq("user_id", user?.id)
        .eq("status", "processed");

      // Buscar saques pendentes
      const { data: pendingPayouts } = await supabase
        .from("payouts")
        .select("amount_cents")
        .eq("user_id", user?.id)
        .eq("status", "pending");

      const totalNetValue = paidTransactions?.reduce((sum, t) => sum + t.net_value, 0) || 0;
      const totalWithdrawn = processedPayouts?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;
      const totalPending = pendingPayouts?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;

      setBalance((totalNetValue - totalWithdrawn - totalPending) / 100);
    } catch (error) {
      console.error("Erro ao carregar saldo:", error);
      toast.error("Erro ao carregar saldo");
    }
  };

  const loadTransactions = async () => {
    try {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "paid")
        .order("created_at", { ascending: false })
        .limit(10);

      setTransactions(data || []);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };

  const handleWithdraw = async () => {
    if (balance <= 0) {
      toast.error("Saldo insuficiente para saque");
      return;
    }

    // Buscar perfil para pegar chave PIX
    const { data: profile } = await supabase
      .from("profiles")
      .select("pix_key")
      .eq("id", user?.id)
      .single();

    if (!profile?.pix_key) {
      toast.error("Configure sua chave PIX no perfil antes de solicitar saque");
      return;
    }

    try {
      const { error } = await supabase.from("payouts").insert({
        user_id: user?.id,
        amount_cents: Math.floor(balance * 100),
        status: "pending",
        pix_key: profile.pix_key,
      });

      if (error) throw error;

      toast.success("Solicitação de saque enviada com sucesso!");
      loadWalletBalance();
    } catch (error) {
      console.error("Erro ao solicitar saque:", error);
      toast.error("Erro ao solicitar saque");
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Carteira</h1>
          <p className="text-muted-foreground">Gerencie seu saldo e transações</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={handleWithdraw}
          disabled={balance <= 0}
        >
          <Wallet className="h-4 w-4 mr-2" />
          Solicitar Saque PIX
        </Button>
      </div>

      <Card className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
        <div className="flex items-center gap-4 mb-2">
          <Wallet className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Saldo Disponível (Líquido)</p>
            <h2 className="text-4xl font-bold">
              {balance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Valor após dedução da taxa de 5%
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Histórico de Transações</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma transação encontrada
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">{transaction.payer_name || "Cliente"}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {(transaction.net_value / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">Líquido</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
