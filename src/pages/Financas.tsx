import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download } from "lucide-react";

export default function Financas() {
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
          <h3 className="text-3xl font-bold mb-2">R$ 0,00</h3>
          <p className="text-xs text-muted-foreground">Disponível para saque</p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Saques Realizados</p>
          <h3 className="text-3xl font-bold mb-2">R$ 0,00</h3>
          <p className="text-xs text-muted-foreground">Total no período</p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-1">Em Processamento</p>
          <h3 className="text-3xl font-bold mb-2">R$ 0,00</h3>
          <p className="text-xs text-muted-foreground">Aguardando liberação</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Histórico de Saques</h3>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            Nenhum saque realizado
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Transferências</h3>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma transferência encontrada
          </div>
        </Card>
      </div>
    </div>
  );
}
