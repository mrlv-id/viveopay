import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function Carteira() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Carteira</h1>
          <p className="text-muted-foreground">Gerencie seu saldo e transações</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Wallet className="h-4 w-4 mr-2" />
          Solicitar Saque
        </Button>
      </div>

      <Card className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
        <div className="flex items-center gap-4 mb-2">
          <Wallet className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Saldo Disponível</p>
            <h2 className="text-4xl font-bold">R$ 0,00</h2>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Histórico de Transações</h3>
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma transação encontrada
        </div>
      </Card>
    </div>
  );
}
