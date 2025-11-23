import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet, LineChart, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">V</span>
            </div>
            <span className="font-bold text-2xl">Viveo</span>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Entrar
          </Button>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Gestão Financeira para Psicólogos
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Simplifique seus pagamentos, gerencie sua carteira e foque no que realmente
            importa: cuidar dos seus pacientes
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-lg px-8"
          >
            Começar Agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <Wallet className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Carteira Digital</h3>
              <p className="text-muted-foreground">
                Controle total do seu saldo e transações em tempo real
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <LineChart className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gestão Financeira</h3>
              <p className="text-muted-foreground">
                Relatórios completos e saques via PIX instantâneos
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-muted-foreground">
                Proteção total dos seus dados e transações
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Rápido e Fácil</h3>
              <p className="text-muted-foreground">
                Configure em minutos e comece a receber pagamentos
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para simplificar suas finanças?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de profissionais que já confiam na Viveo
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-lg px-8"
          >
            Criar Conta Grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2024 Viveo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
