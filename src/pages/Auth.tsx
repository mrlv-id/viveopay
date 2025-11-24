import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logoViveo from "@/assets/logo-viveo.png";
import { Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
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

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
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
      setConfirmPassword("");
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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary/20 via-background to-accent/20">
      {/* Left Side - Info Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent opacity-90" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <img 
            src={logoViveo} 
            alt="Viveo" 
            className="h-12 w-auto object-contain mb-16"
          />
          <h1 className="text-5xl font-bold mb-6">
            Rápido, Eficiente e Produtivo
          </h1>
          <p className="text-xl text-white/90 leading-relaxed">
            A plataforma completa para gestão financeira de profissionais de saúde mental.
            Gerencie seus atendimentos, pagamentos e finanças em um só lugar.
          </p>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-border shadow-2xl p-8">
          <div className="text-center mb-8 lg:hidden">
            <img 
              src={logoViveo} 
              alt="Viveo" 
              className="h-10 w-auto object-contain mx-auto mb-4"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {isSignUp ? "Criar Conta" : "Entrar"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isSignUp ? "Comece sua jornada com a Viveo" : "Acesse sua conta"}
            </p>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Nome Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 bg-background border-input"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-background border-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-background border-input pr-10"
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
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-background border-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
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
                  <a href="#" className="text-primary hover:underline">
                    Termos e Condições
                  </a>
                </label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading 
                ? (isSignUp ? "Criando conta..." : "Entrando...") 
                : (isSignUp ? "Criar Conta" : "Entrar")
              }
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Já tem uma conta? " : "Não tem uma conta? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setFullName("");
                  setAcceptTerms(false);
                }}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Entrar" : "Criar conta"}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
