import { Mail, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CentralAjuda() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Central de Ajuda</h1>
        <p className="text-muted-foreground mt-2">
          Entre em contato conosco através dos canais abaixo
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>E-mail</CardTitle>
                <CardDescription>Envie suas dúvidas por e-mail</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = 'mailto:mlvs.dev@gmail.com'}
            >
              mlvs.dev@gmail.com
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>WhatsApp</CardTitle>
                <CardDescription>Fale conosco pelo WhatsApp</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://wa.me/5571993005600', '_blank')}
            >
              (71) 99300-5600
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
