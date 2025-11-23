import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export default function Perfil() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                U
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Foto de Perfil</h3>
            <p className="text-sm text-muted-foreground">
              Clique no ícone para alterar sua foto
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" placeholder="Seu nome completo" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" placeholder="(00) 00000-0000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF/CNPJ</Label>
            <Input id="cpf" placeholder="000.000.000-00" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pix">Chave PIX</Label>
            <Input id="pix" placeholder="Sua chave PIX" />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="bg-primary hover:bg-primary/90">
            Salvar Alterações
          </Button>
        </div>
      </Card>
    </div>
  );
}
