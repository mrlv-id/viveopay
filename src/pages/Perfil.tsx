import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Perfil() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cpf_cnpj: "",
    pix_key: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          email: user?.email || "",
          phone: data.phone || "",
          cpf_cnpj: data.cpf_cnpj || "",
          pix_key: data.pix_key || "",
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toast.error("Erro ao carregar perfil");
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        toast.error("Apenas imagens são permitidas");
        return;
      }

      setUploading(true);

      // Deletar avatar antigo se existir
      if (formData.avatar_url) {
        const oldPath = formData.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user?.id}/${oldPath}`]);
        }
      }

      // Upload nova imagem
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setFormData({ ...formData, avatar_url: publicUrl });
      toast.success("Foto de perfil atualizada!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          cpf_cnpj: formData.cpf_cnpj,
          pix_key: formData.pix_key,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

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
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {formData.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
            <Button
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Foto de Perfil</h3>
            <p className="text-sm text-muted-foreground">
              Clique no ícone para alterar sua foto (máx. 5MB)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF/CNPJ</Label>
            <Input
              id="cpf"
              value={formData.cpf_cnpj}
              onChange={(e) =>
                setFormData({ ...formData, cpf_cnpj: e.target.value })
              }
              placeholder="000.000.000-00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pix">Chave PIX</Label>
            <Input
              id="pix"
              value={formData.pix_key}
              onChange={(e) =>
                setFormData({ ...formData, pix_key: e.target.value })
              }
              placeholder="Sua chave PIX para receber saques"
            />
            <p className="text-xs text-muted-foreground">
              Necessária para solicitar saques. Pode ser email, telefone, CPF/CNPJ ou chave aleatória.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
