import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Wallet, Zap, Shield, TrendingUp, DollarSign } from "lucide-react";
import logoViveo from "@/assets/logo-viveo.png";
import dashboardPreview from "@/assets/dashboard-preview.png";
import { HeroSection } from "@/components/ui/hero-section-dark";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={logoViveo} 
              alt="Viveo" 
              className="h-8 w-auto object-contain"
            />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefícios</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Preços</a>
          </nav>
          <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
            Começar agora
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection
        title="🚀 Plataforma completa para psicólogos"
        subtitle={{
          regular: "A plataforma de pagamentos para psicólogos ",
          gradient: "do futuro",
        }}
        description="Automatize seus recebimentos, organize sua rotina e tenha controle financeiro total — tudo em um único painel."
        ctaText="Criar conta gratuita"
        onCtaClick={() => navigate("/auth")}
        bottomImage={{
          light: dashboardPreview,
          dark: dashboardPreview,
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.3,
          cellSize: 50,
          lightLineColor: "hsl(var(--border))",
          darkLineColor: "hsl(var(--border))",
        }}
      />

      {/* Interesse - Problemas */}
      <section id="features" className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <span className="text-sm text-primary font-medium">Problemas Comuns</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
              Desafios que todo psicólogo enfrenta
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sabemos que gerenciar pagamentos e finanças pode ser complicado. Por isso criamos a Viveo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Wallet,
                title: "Pagamentos desorganizados",
                description: "Receber por transferência manual é demorado e difícil de controlar"
              },
              {
                icon: BarChart3,
                title: "Falta de controle financeiro",
                description: "Sem relatórios claros, fica impossível entender seus ganhos"
              },
              {
                icon: Shield,
                title: "Insegurança nos recebimentos",
                description: "Medo de inadimplência e falta de comprovantes profissionais"
              },
              {
                icon: Zap,
                title: "Tempo perdido",
                description: "Horas gastas cobrando manualmente e organizando planilhas"
              }
            ].map((problem, index) => (
              <Card 
                key={index} 
                className="group p-6 bg-card/30 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <problem.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Desejo - Soluções */}
      <section id="benefits" className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/.1),transparent)]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <span className="text-sm text-primary font-medium">Soluções Completas</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
              A solução completa para sua prática
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para receber, gerenciar e crescer seu consultório.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="group p-8 bg-card/30 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Links de pagamento automáticos</h3>
                  <p className="text-muted-foreground">
                    Crie links personalizados em segundos e compartilhe com seus pacientes via WhatsApp, email ou redes sociais.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="group p-8 bg-card/30 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Dashboard completo com gráficos</h3>
                  <p className="text-muted-foreground">
                    Visualize todas as suas transações, receitas e métricas em tempo real com gráficos intuitivos.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="group p-8 bg-card/30 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Saque via PIX instantâneo</h3>
                  <p className="text-muted-foreground">
                    Solicite saques a qualquer momento e receba seu dinheiro na sua conta via PIX de forma rápida e segura.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="group p-8 bg-card/30 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Gestão completa de serviços</h3>
                  <p className="text-muted-foreground">
                    Cadastre seus serviços, defina valores, modalidades e duração. Organize tudo em um só lugar.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Ação - CTA Final */}
      <section id="pricing" className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,hsl(var(--primary)/.15),transparent)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <span className="text-sm text-primary font-medium">Comece Agora</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
              Comece a receber pagamentos hoje mesmo
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Junte-se a centenas de profissionais que já transformaram a gestão financeira de seus consultórios.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <span className="relative inline-block overflow-hidden rounded-full p-[1.5px]">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary)/.3)_0%,hsl(var(--primary))_50%,hsl(var(--primary)/.3)_100%)]" />
                <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background backdrop-blur-3xl">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-tr from-muted/40 via-primary/30 to-transparent hover:from-muted/50 hover:via-primary/40 border-border text-lg h-16 px-12 rounded-full"
                    onClick={() => navigate("/auth")}
                  >
                    Criar minha conta gratuita
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </span>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              Sem mensalidade. Você só paga uma pequena taxa por transação.
            </p>

            <div className="grid md:grid-cols-3 gap-8 pt-12">
              <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/30">
                <div className="text-4xl font-bold text-primary mb-2">0%</div>
                <div className="text-sm text-muted-foreground">Taxa de adesão</div>
              </Card>
              <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/30">
                <div className="text-4xl font-bold text-primary mb-2">2.5%</div>
                <div className="text-sm text-muted-foreground">Por transação</div>
              </Card>
              <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/30">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Suporte disponível</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={logoViveo} 
                alt="Viveo" 
                className="h-8 w-auto object-contain"
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 Viveo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
