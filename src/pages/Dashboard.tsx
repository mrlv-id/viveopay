import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua conta</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Saldo Total</p>
              <h3 className="text-2xl font-bold">R$ 0,00</h3>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Recebido (mês)</p>
              <h3 className="text-2xl font-bold">R$ 0,00</h3>
            </div>
            <ArrowDownRight className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Saques (mês)</p>
              <h3 className="text-2xl font-bold">R$ 0,00</h3>
            </div>
            <ArrowUpRight className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Transações</p>
              <h3 className="text-2xl font-bold">0</h3>
            </div>
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

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
