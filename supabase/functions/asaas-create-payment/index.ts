import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ASAAS_API_URL = 'https://api.asaas.com/v3';

interface CreatePaymentRequest {
  serviceId: string;
  payerName: string;
  payerEmail: string;
  payerCpfCnpj?: string;
  payerPhone?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const asaasApiKey = Deno.env.get('ASAAS_API_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { serviceId, payerName, payerEmail, payerCpfCnpj, payerPhone }: CreatePaymentRequest = await req.json();

    console.log('Criando pagamento para serviço:', serviceId);

    // Buscar o serviço
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      throw new Error('Serviço não encontrado');
    }

    // Buscar perfil do usuário (vendedor)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Perfil do usuário não encontrado');
    }

    // Criar ou buscar cliente no Asaas
    let customerId = profile.asaas_customer_id;

    if (!customerId) {
      console.log('Criando cliente no Asaas...');
      const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
        method: 'POST',
        headers: {
          'access_token': asaasApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: payerName,
          email: payerEmail,
          cpfCnpj: payerCpfCnpj,
          phone: payerPhone,
          externalReference: user.id,
        }),
      });

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error('Erro ao criar cliente no Asaas:', errorText);
        throw new Error('Erro ao criar cliente no Asaas');
      }

      const customerData = await customerResponse.json();
      customerId = customerData.id;

      // Atualizar perfil com customer_id
      await supabase
        .from('profiles')
        .update({ asaas_customer_id: customerId })
        .eq('id', user.id);
    }

    // Criar cobrança no Asaas
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // Vencimento em 7 dias

    const paymentData = {
      customer: customerId,
      billingType: 'UNDEFINED', // Permite o cliente escolher
      value: service.price_cents / 100,
      dueDate: dueDate.toISOString().split('T')[0],
      description: service.title,
      externalReference: serviceId,
    };

    console.log('Criando cobrança no Asaas:', paymentData);

    const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('Erro ao criar cobrança no Asaas:', errorText);
      throw new Error('Erro ao criar cobrança no Asaas');
    }

    const payment = await paymentResponse.json();
    console.log('Cobrança criada:', payment);

    // Calcular taxa da Viveo (5%)
    const feePercent = 0.05;
    const feeValue = Math.floor(service.price_cents * feePercent);
    const netValue = service.price_cents - feeValue;

    console.log('Valores calculados:', {
      amount_cents: service.price_cents,
      fee_value: feeValue,
      net_value: netValue,
    });

    // Criar transação no banco de dados
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        service_id: serviceId,
        amount_cents: service.price_cents,
        fee_value: feeValue,
        net_value: netValue,
        status: 'pending',
        external_id: serviceId,
        asaas_payment_id: payment.id,
        asaas_invoice_url: payment.invoiceUrl,
        payer_name: payerName,
        payer_email: payerEmail,
        checkout_url: payment.invoiceUrl,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Erro ao criar transação:', transactionError);
      throw transactionError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction,
        payment: {
          id: payment.id,
          invoiceUrl: payment.invoiceUrl,
          bankSlipUrl: payment.bankSlipUrl,
          pixQrCode: payment.pixQrCode,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
