import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logoViveo from "@/assets/logo-viveo.png";
import { Eye, EyeOff, AtSign, ChevronLeft, Grid2x2Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!fullName.trim() || fullName.length < 3) {
      toast.error("Nome deve ter pelo menos 3 caracteres");
      return;
    }
    
    if (!email.trim() || !email.includes("@")) {
      toast.error("Email inválido");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (!acceptTerms) {
      toast.error("Você deve aceitar os termos e condições");
      return;
    }
    
    setIsLoading(true);
    try {
      await signUp(email, password, fullName);
      setEmail("");
      setPassword("");
      setFullName("");
      setAcceptTerms(false);
    } catch (error) {
      // Error já tratado no useAuth
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!email.trim() || !email.includes("@")) {
      toast.error("Email inválido");
      return;
    }
    
    if (!password.trim()) {
      toast.error("Senha é obrigatória");
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      // Error já tratado no useAuth
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim() || !resetEmail.includes("@")) {
      toast.error("Email inválido");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
        setShowResetModal(false);
        setResetEmail("");
      }
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error);
      toast.error("Erro ao enviar email de recuperação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao entrar com Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left Side - Animated Background */}
      <div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex">
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <div className="z-10 flex items-center gap-2">
          <img 
            src={logoViveo} 
            alt="Viveo" 
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              &ldquo;A plataforma completa para gestão financeira de profissionais de saúde mental.
              Gerencie seus atendimentos, pagamentos e finanças em um só lugar.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold">
              ~ Viveo Team
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <div
          aria-hidden
          className="absolute inset-0 isolate contain-strict -z-10 opacity-60"
        >
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsl(var(--foreground)/.06)_0,hsla(0,0%,55%,.02)_50%,hsl(var(--foreground)/.01)_80%)] absolute top-0 right-0 h-[80rem] w-[35rem] -translate-y-[21.875rem] rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,hsl(var(--foreground)/.04)_0,hsl(var(--foreground)/.01)_80%,transparent_100%)] absolute top-0 right-0 h-[80rem] w-[15rem] [translate:5%_-50%] rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,hsl(var(--foreground)/.04)_0,hsl(var(--foreground)/.01)_80%,transparent_100%)] absolute top-0 right-0 h-[80rem] w-[15rem] -translate-y-[21.875rem] rounded-full" />
        </div>

        <Button variant="ghost" className="absolute top-7 left-5" asChild>
          <a href="/">
            <ChevronLeft className='size-4 me-2' />
            Início
          </a>
        </Button>

        <div className="mx-auto space-y-6 sm:w-[28rem]">
          <div className="flex items-center gap-2 lg:hidden">
            <img 
              src={logoViveo} 
              alt="Viveo" 
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <h1 className="font-heading text-3xl font-bold tracking-wide">
              {isSignUp ? "Criar Conta" : "Entrar na Viveo"}
            </h1>
            <p className="text-muted-foreground text-base">
              {isSignUp ? "Comece sua jornada com a Viveo" : "Acesse sua conta e gerencie suas finanças"}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com email
              </span>
            </div>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {isSignUp && (
              <div className="relative h-max">
                <Input
                  placeholder="Nome completo"
                  className="h-11"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="relative h-max">
              <Input
                placeholder="seu@email.com"
                className="peer ps-9 h-11"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <AtSign className="size-4" aria-hidden="true" />
              </div>
            </div>

            <div className="relative h-max">
              <Input
                placeholder="••••••••"
                className="h-11 pr-10"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {isSignUp && (
              <p className="text-xs text-muted-foreground">
                Use 8 ou mais caracteres com letras, números e símbolos.
              </p>
            )}

            {isSignUp && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-tight cursor-pointer"
                >
                  Eu aceito os{" "}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                    className="text-primary hover:underline"
                  >
                    Termos e Condições
                  </button>
                </label>
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              <span>{isLoading ? (isSignUp ? "Criando conta..." : "Entrando...") : (isSignUp ? "Criar Conta" : "Entrar")}</span>
            </Button>
          </form>

          {!isSignUp && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Já tem uma conta? " : "Não tem uma conta? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail("");
                  setPassword("");
                  setFullName("");
                  setAcceptTerms(false);
                }}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Entrar" : "Criar conta"}
              </button>
            </p>
          </div>

          {isSignUp && (
            <p className="text-muted-foreground mt-8 text-sm text-center">
              Ao criar uma conta, você concorda com nossos{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="hover:text-primary underline underline-offset-4"
              >
                Termos de Serviço
              </button>
              {' '}e{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="hover:text-primary underline underline-offset-4"
              >
                Política de Privacidade
              </button>
              .
            </p>
          )}
        </div>
      </div>

      {/* Modal de Recuperação de Senha */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar Senha</DialogTitle>
            <DialogDescription>
              Digite seu email para receber um link de recuperação
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <div className="relative">
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="peer ps-9 h-11"
                />
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <AtSign className="size-4" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Enviaremos um link para redefinir sua senha
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowResetModal(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar link"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Termos e Condições */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Termos e Condições de Uso</DialogTitle>
            <DialogDescription>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm text-foreground">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Aceitação dos Termos</h3>
              <p>
                Ao acessar e usar a plataforma Viveo, você concorda em cumprir e estar vinculado aos 
                seguintes termos e condições de uso. Se você não concordar com qualquer parte destes 
                termos, não deverá usar nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Descrição do Serviço</h3>
              <p>
                A Viveo é uma plataforma completa para gestão financeira de profissionais de saúde mental, 
                oferecendo ferramentas para gerenciar atendimentos, pagamentos e finanças em um só lugar.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Cadastro e Conta</h3>
              <p>
                Para utilizar nossos serviços, você deve criar uma conta fornecendo informações precisas 
                e completas. Você é responsável por manter a confidencialidade de sua senha e por todas 
                as atividades que ocorram em sua conta.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Privacidade e Proteção de Dados</h3>
              <p>
                Respeitamos sua privacidade e estamos comprometidos em proteger seus dados pessoais. 
                Coletamos, usamos e armazenamos suas informações de acordo com a Lei Geral de Proteção 
                de Dados (LGPD) e nossa Política de Privacidade.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Uso Aceitável</h3>
              <p>
                Você concorda em usar a plataforma apenas para fins legais e de acordo com estes termos. 
                É proibido usar nossos serviços para qualquer atividade ilegal, fraudulenta ou que viole 
                os direitos de terceiros.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Transações Financeiras</h3>
              <p>
                Todas as transações financeiras realizadas através da plataforma estão sujeitas a taxas 
                e condições específicas. Você é responsável por garantir a precisão das informações 
                fornecidas para processamento de pagamentos.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. Propriedade Intelectual</h3>
              <p>
                Todo o conteúdo, marcas registradas, logotipos e propriedade intelectual presentes na 
                plataforma são de propriedade exclusiva da Viveo ou de seus licenciadores.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. Limitação de Responsabilidade</h3>
              <p>
                A Viveo não se responsabiliza por quaisquer danos diretos, indiretos, incidentais ou 
                consequenciais decorrentes do uso ou incapacidade de usar nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. Modificações dos Termos</h3>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações 
                entrarão em vigor imediatamente após sua publicação na plataforma.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. Contato</h3>
              <p>
                Para dúvidas ou questões sobre estes termos, entre em contato através dos canais de 
                suporte disponíveis na plataforma.
              </p>
            </section>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setShowTermsModal(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

// Floating Paths Animation Component
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-foreground"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
