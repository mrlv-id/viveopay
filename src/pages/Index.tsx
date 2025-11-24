import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Wallet, Zap, Shield, TrendingUp, DollarSign } from "lucide-react";
import logoViveo from "@/assets/logo-viveo.png";

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

      {/* Hero Section - ATENÇÃO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto px-6 py-20 md:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm text-primary font-medium">🚀 Plataforma completa para psicólogos</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                A plataforma de pagamentos para psicólogos do futuro
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Automatize seus recebimentos, organize sua rotina e tenha controle financeiro total — tudo em um único painel.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-lg h-14 px-8"
                  onClick={() => navigate("/auth")}
                >
                  Criar conta gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg h-14 px-8 border-border/50 hover:bg-accent/50"
                >
                  Falar com um gerente
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">+500</div>
                  <div className="text-sm text-muted-foreground">Profissionais</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-primary">R$ 2M+</div>
                  <div className="text-sm text-muted-foreground">Processado</div>
                </div>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <Card className="relative bg-card/50 backdrop-blur-sm border-border/50 p-6 overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <h3 className="font-semibold">Dashboard</h3>
                    <div className="text-sm text-muted-foreground">Hoje</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Saldo Total</div>
                    <div className="text-4xl font-bold mb-6">R$ 38.534,76</div>
                    
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-lg p-4 border border-border/30">
                      <svg className="w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
                        <path
                          d="M 0 120 Q 50 100, 100 80 T 200 40 T 300 20"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        <path
                          d="M 0 120 Q 50 100, 100 80 T 200 40 T 300 20 L 300 150 L 0 150 Z"
                          fill="url(#gradient)"
                          opacity="0.2"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Recebido</div>
                      <div className="text-lg font-semibold text-green-500">R$ 15.2K</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Transações</div>
                      <div className="text-lg font-semibold">345</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Taxa Média</div>
                      <div className="text-lg font-semibold text-primary">2.5%</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interesse - Problemas */}
      <section id="features" className="py-20 md:py-32 bg-accent/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
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
                className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:scale-105"
              >
                <problem.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Desejo - Soluções */}
      <section id="benefits" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              A solução completa para sua prática
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para receber, gerenciar e crescer seu consultório.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
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

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
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

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
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

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
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
      <section id="pricing" className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iaHNsKHZhcigtLXByaW1hcnkpKSIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">
              Comece a receber pagamentos hoje mesmo
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Junte-se a centenas de profissionais que já transformaram a gestão financeira de seus consultórios.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-lg h-16 px-12 shadow-lg shadow-primary/25"
                onClick={() => navigate("/auth")}
              >
                Criar minha conta gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              Sem mensalidade. Você só paga uma pequena taxa por transação.
            </p>

            <div className="grid md:grid-cols-3 gap-8 pt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">0%</div>
                <div className="text-sm text-muted-foreground">Taxa de adesão</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">2.5%</div>
                <div className="text-sm text-muted-foreground">Por transação</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Suporte disponível</div>
              </div>
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
