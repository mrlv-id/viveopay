import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function Indicacao() {
  const [copied, setCopied] = useState(false);
  const linkIndicacao = "https://viveo.app/indicacao/ABC123";

  const copiarLink = () => {
    navigator.clipboard.writeText(linkIndicacao);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Indique um Amigo</h1>
        <p className="text-muted-foreground">
          Compartilhe a Viveo e ajude outros profissionais
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
        <div className="text-center">
          <Users className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Convide seus colegas!</h2>
          <p className="text-muted-foreground mb-6">
            Compartilhe seu link único e ajude outros profissionais de saúde mental a
            simplificarem sua gestão financeira
          </p>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Seu Link de Indicação</h3>
        <div className="flex gap-2">
          <Input value={linkIndicacao} readOnly className="font-mono" />
          <Button
            onClick={copiarLink}
            className="bg-primary hover:bg-primary/90 min-w-[120px]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          100% gratuito para você e para quem você indicar!
        </p>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Como Funciona</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold">1</span>
            </div>
            <div>
              <p className="font-medium">Compartilhe seu link</p>
              <p className="text-sm text-muted-foreground">
                Envie para colegas e profissionais da área
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold">2</span>
            </div>
            <div>
              <p className="font-medium">Eles se cadastram</p>
              <p className="text-sm text-muted-foreground">
                Através do seu link único de indicação
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold">3</span>
            </div>
            <div>
              <p className="font-medium">Todos se beneficiam</p>
              <p className="text-sm text-muted-foreground">
                Ajude a crescer nossa comunidade de profissionais
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
