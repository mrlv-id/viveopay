import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, asaas-access-token',
};

interface AsaasWebhookPayload {
  event: string;
  payment?: {
    id: string;
    customer: string;
    billingType: string;
    value: number;
    netValue: number;
    status: string;
    description?: string;
    invoiceUrl?: string;
    externalReference?: string;
    confirmedDate?: string;
    paymentDate?: string;
  };
}

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const asaasWebhookToken = Deno.env.get('ASAAS_WEBHOOK_TOKEN');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Verify webhook authenticity using Asaas access token
    const asaasToken = req.headers.get('asaas-access-token');
    
    if (asaasWebhookToken && asaasToken !== asaasWebhookToken) {
      console.error('Invalid webhook token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      );
    }

    const rawBody = await req.text();
    const payload: AsaasWebhookPayload = JSON.parse(rawBody);
    
    console.log('Webhook recebido:', JSON.stringify(payload, null, 2));

    // Registrar webhook na tabela de logs
    const { error: logError } = await supabase
      .from('webhook_logs')
      .insert({
        event_type: payload.event,
        payload: payload,
        idempotency_key: payload.payment?.id || crypto.randomUUID(),
        processed: false,
      });

    if (logError) {
      console.error('Erro ao registrar webhook:', logError);
    }

    // Processar apenas eventos de pagamento
    if (!payload.payment) {
      console.log('Webhook sem dados de pagamento, ignorando');
      return new Response(JSON.stringify({ message: 'Webhook recebido' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const { payment } = payload;
    
    // Mapear status do Asaas para o nosso sistema
    const statusMap: Record<string, string> = {
      'PENDING': 'pending',
      'RECEIVED': 'paid',
      'CONFIRMED': 'paid',
      'OVERDUE': 'overdue',
      'REFUNDED': 'refunded',
      'RECEIVED_IN_CASH': 'paid',
      'REFUND_REQUESTED': 'refunded',
      'CHARGEBACK_REQUESTED': 'disputed',
      'CHARGEBACK_DISPUTE': 'disputed',
      'AWAITING_CHARGEBACK_REVERSAL': 'disputed',
      'DUNNING_REQUESTED': 'failed',
      'DUNNING_RECEIVED': 'paid',
      'AWAITING_RISK_ANALYSIS': 'pending',
    };

    const mappedStatus = statusMap[payment.status] || 'pending';

    // Buscar transação pelo external_id (referência externa do Asaas)
    let transactionQuery = supabase
      .from('transactions')
      .select('*')
      .eq('external_id', payment.externalReference || '');

    // Se não houver externalReference, tentar pelo asaas_payment_id
    if (!payment.externalReference) {
      transactionQuery = supabase
        .from('transactions')
        .select('*')
        .eq('asaas_payment_id', payment.id);
    }

    const { data: existingTransaction, error: fetchError } = await transactionQuery.maybeSingle();

    if (fetchError) {
      console.error('Erro ao buscar transação:', fetchError);
      throw fetchError;
    }

    if (existingTransaction) {
      // Atualizar transação existente
      const updateData: any = {
        status: mappedStatus,
        asaas_payment_id: payment.id,
        asaas_invoice_url: payment.invoiceUrl,
        payment_method: payment.billingType?.toLowerCase(),
        updated_at: new Date().toISOString(),
      };

      // Adicionar data de pagamento se foi confirmado/recebido
      if (mappedStatus === 'paid' && (payment.confirmedDate || payment.paymentDate)) {
        updateData.paid_at = payment.confirmedDate || payment.paymentDate;
      }

      const { error: updateError } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', existingTransaction.id);

      if (updateError) {
        console.error('Erro ao atualizar transação:', updateError);
        throw updateError;
      }

      console.log(`Transação ${existingTransaction.id} atualizada para status: ${mappedStatus}`);

      // Enviar notificação por email se o pagamento foi confirmado
      if (mappedStatus === 'paid') {
        console.log('Enviando notificação de pagamento por email...');
        
        // Chamar edge function de notificação de forma assíncrona (não bloqueia o webhook)
        supabase.functions.invoke('send-payment-notification', {
          body: { transactionId: existingTransaction.id },
        }).then(({ error: notificationError }) => {
          if (notificationError) {
            console.error('Erro ao enviar notificação:', notificationError);
          } else {
            console.log('Notificação enviada com sucesso');
          }
        });
      }
    } else {
      console.log('Transação não encontrada para este pagamento');
    }

    // Atualizar o log do webhook como processado
    if (payment.id) {
      await supabase
        .from('webhook_logs')
        .update({ processed: true })
        .eq('idempotency_key', payment.id);
    }

    return new Response(
      JSON.stringify({ 
        message: 'Webhook processado com sucesso',
        event: payload.event,
        status: mappedStatus,
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao processar webhook',
        details: errorMessage
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
