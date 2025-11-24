import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreatePaymentParams {
  serviceId: string;
  payerName: string;
  payerEmail: string;
  payerCpfCnpj?: string;
  payerPhone?: string;
}

interface PaymentResult {
  id: string;
  invoiceUrl: string;
  bankSlipUrl?: string;
  pixQrCode?: string;
}

export const useAsaasPayments = () => {
  const [loading, setLoading] = useState(false);

  const createPayment = async (params: CreatePaymentParams): Promise<PaymentResult | null> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const response = await supabase.functions.invoke('asaas-create-payment', {
        body: params,
      });

      if (response.error) {
        throw response.error;
      }

      toast.success('Link de pagamento gerado com sucesso!');
      return response.data.payment;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      toast.error('Erro ao gerar link de pagamento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (params: {
    name: string;
    email: string;
    cpfCnpj?: string;
    phone?: string;
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const response = await supabase.functions.invoke('asaas-create-customer', {
        body: params,
      });

      if (response.error) {
        throw response.error;
      }

      toast.success('Cliente sincronizado com Asaas');
      return true;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao sincronizar cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    createCustomer,
    loading,
  };
};
