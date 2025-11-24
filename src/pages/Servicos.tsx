import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, ExternalLink, Trash2, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useAsaasPayments } from "@/hooks/useAsaasPayments";

interface Service {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  duration_minutes: number;
  modality: string;
  is_active: boolean;
}

export default function Servicos() {
  const [open, setOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createPayment, loading: paymentLoading } = useAsaasPayments();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    modality: "",
    description: "",
  });

  const [paymentFormData, setPaymentFormData] = useState({
    payerName: "",
    payerEmail: "",
    payerCpfCnpj: "",
    payerPhone: "",
  });

  useEffect(() => {
    if (user) {
      loadServices();
    }
  }, [user]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      toast.error("Erro ao carregar serviços");
    }
  };

  const handleCreateService = async () => {
    if (!formData.title || !formData.price) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (priceValue < 5) {
      toast.error("O valor mínimo para criar um serviço é R$ 5,00");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("services").insert({
        user_id: user?.id,
        title: formData.title,
        description: formData.description,
        price_cents: Math.round(parseFloat(formData.price) * 100),
        duration_minutes: formData.duration ? parseInt(formData.duration) : null,
        modality: formData.modality || null,
        is_active: true,
      });

      if (error) throw error;

      toast.success("Serviço criado com sucesso!");
      setOpen(false);
      setFormData({
        title: "",
        price: "",
        duration: "",
        modality: "",
        description: "",
      });
      loadServices();
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      toast.error("Erro ao criar serviço");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Deseja realmente excluir este serviço?")) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", serviceId);

      if (error) throw error;

      toast.success("Serviço excluído com sucesso!");
      loadServices();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      toast.error("Erro ao excluir serviço");
    }
  };

  const handleGeneratePayment = async () => {
    if (!selectedService) {
      toast.error("Serviço não selecionado");
      return;
    }

    // Validar valor mínimo (R$ 5,00)
    const minimumValueCents = 500;
    if (selectedService.price_cents < minimumValueCents) {
      toast.error("O valor mínimo para gerar um link de pagamento é R$ 5,00. Por favor, atualize o valor do serviço.");
      return;
    }

    // Validate required fields
    if (!paymentFormData.payerName || paymentFormData.payerName.trim().length < 3) {
      toast.error("Nome deve ter pelo menos 3 caracteres");
      return;
    }

    if (!paymentFormData.payerEmail) {
      toast.error("Email é obrigatório");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paymentFormData.payerEmail)) {
      toast.error("Email inválido");
      return;
    }

    const result = await createPayment({
      serviceId: selectedService.id,
      payerName: paymentFormData.payerName,
      payerEmail: paymentFormData.payerEmail,
      payerCpfCnpj: paymentFormData.payerCpfCnpj,
      payerPhone: paymentFormData.payerPhone,
    });

    if (result) {
      setPaymentDialogOpen(false);
      setPaymentFormData({
        payerName: "",
        payerEmail: "",
        payerCpfCnpj: "",
        payerPhone: "",
      });
      
      // Copiar URL para área de transferência
      navigator.clipboard.writeText(result.invoiceUrl);
      toast.success("Link de pagamento copiado!");
      
      // Abrir link em nova aba
      window.open(result.invoiceUrl, "_blank");
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Serviços</h1>
          <p className="text-muted-foreground">Gerencie seus serviços cadastrados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-card">
            <DialogHeader>
              <DialogTitle>Criar Novo Serviço</DialogTitle>
              <DialogDescription>
                Preencha os dados do seu serviço
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Serviço *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Consulta Individual"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="5.00"
                  min="5.00"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
                {formData.price && parseFloat(formData.price) < 5 && (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-amber-600"></span>
                    Valor mínimo R$ 5,00
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="duracao">Tempo de Sessão (minutos)</Label>
                <Input
                  id="duracao"
                  type="number"
                  placeholder="50"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modalidade">Modalidade</Label>
                <Select
                  value={formData.modality}
                  onValueChange={(value) =>
                    setFormData({ ...formData, modality: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva seu serviço..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleCreateService}
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar Serviço"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card className="p-6 bg-card border-border">
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum serviço cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Crie seu primeiro serviço para começar a receber pagamentos
            </p>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Serviço
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const isValueTooLow = service.price_cents < 500; // R$ 5,00
            
            return (
              <Card key={service.id} className="p-6 bg-card border-border">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(service.price_cents)}
                    </p>
                    {isValueTooLow && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-amber-600"></span>
                        Valor mínimo R$ 5,00
                      </p>
                    )}
                  </div>

                  {service.description && (
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 text-sm">
                    {service.duration_minutes && (
                      <span className="px-2 py-1 bg-secondary rounded">
                        {service.duration_minutes} min
                      </span>
                    )}
                    {service.modality && (
                      <span className="px-2 py-1 bg-secondary rounded capitalize">
                        {service.modality}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => {
                        setSelectedService(service);
                        setPaymentDialogOpen(true);
                      }}
                      disabled={isValueTooLow}
                      title={isValueTooLow ? "Valor mínimo para gerar link: R$ 5,00" : ""}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Gerar Link
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card">
          <DialogHeader>
            <DialogTitle>Gerar Link de Pagamento</DialogTitle>
            <DialogDescription>
              Preencha os dados do cliente para gerar o link
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payer-name">Nome do Cliente *</Label>
              <Input
                id="payer-name"
                placeholder="Nome completo"
                value={paymentFormData.payerName}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    payerName: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payer-email">Email *</Label>
              <Input
                id="payer-email"
                type="email"
                placeholder="email@exemplo.com"
                value={paymentFormData.payerEmail}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    payerEmail: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payer-cpf">CPF/CNPJ</Label>
              <Input
                id="payer-cpf"
                placeholder="000.000.000-00"
                value={paymentFormData.payerCpfCnpj}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    payerCpfCnpj: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payer-phone">Telefone</Label>
              <Input
                id="payer-phone"
                placeholder="(00) 00000-0000"
                value={paymentFormData.payerPhone}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    payerPhone: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleGeneratePayment}
              disabled={paymentLoading}
            >
              <Copy className="h-4 w-4 mr-2" />
              {paymentLoading ? "Gerando..." : "Gerar Link"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
