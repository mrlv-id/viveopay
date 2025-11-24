import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentNotificationRequest {
  transactionId: string;
  userEmail: string;
  userName: string;
  serviceName: string;
  amount: number;
  paymentMethod: string;
  paidAt: string;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

function getPaymentMethodLabel(method: string): string {
  const methods: Record<string, string> = {
    'pix': 'PIX',
    'credit_card': 'Cartão de Crédito',
    'boleto': 'Boleto Bancário',
    'debit_card': 'Cartão de Débito',
  };
  return methods[method] || method;
}

function generateEmailHTML(data: PaymentNotificationRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pagamento Confirmado</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                ✓ Pagamento Confirmado
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
                Recebemos seu pagamento com sucesso!
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Olá <strong>${data.userName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Confirmamos o recebimento do seu pagamento. Abaixo estão os detalhes da transação:
              </p>
              
              <!-- Transaction Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #6c757d; font-size: 14px; padding-bottom: 5px;">Serviço</td>
                      </tr>
                      <tr>
                        <td style="color: #212529; font-size: 16px; font-weight: 600;">${data.serviceName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #6c757d; font-size: 14px; padding-bottom: 5px;">Valor</td>
                      </tr>
                      <tr>
                        <td style="color: #28a745; font-size: 24px; font-weight: 700;">${formatCurrency(data.amount)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 20px; border-bottom: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #6c757d; font-size: 14px; padding-bottom: 5px;">Forma de Pagamento</td>
                      </tr>
                      <tr>
                        <td style="color: #212529; font-size: 16px; font-weight: 600;">${getPaymentMethodLabel(data.paymentMethod)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color: #6c757d; font-size: 14px; padding-bottom: 5px;">Data do Pagamento</td>
                      </tr>
                      <tr>
                        <td style="color: #212529; font-size: 16px; font-weight: 600;">${formatDate(data.paidAt)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                ID da Transação: <code style="background-color: #f8f9fa; padding: 2px 6px; border-radius: 4px; font-size: 13px;">${data.transactionId}</code>
              </p>
              
              <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Se você tiver alguma dúvida sobre este pagamento, não hesite em entrar em contato conosco.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
                Obrigado por escolher nossos serviços!
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                Este é um email automático, por favor não responda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const resend = new Resend(resendApiKey);

  try {
    const { transactionId }: { transactionId: string } = await req.json();

    console.log('Enviando notificação de pagamento para transação:', transactionId);

    // Buscar dados da transação
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select(`
        *,
        user:profiles!transactions_user_id_fkey(full_name, id),
        service:services(title)
      `)
      .eq('id', transactionId)
      .single();

    if (txError || !transaction) {
      throw new Error('Transação não encontrada');
    }

    // Buscar email do usuário
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(
      transaction.user_id
    );

    if (authError || !authUser?.user?.email) {
      throw new Error('Email do usuário não encontrado');
    }

    const emailData: PaymentNotificationRequest = {
      transactionId: transaction.id,
      userEmail: authUser.user.email,
      userName: transaction.user?.full_name || 'Cliente',
      serviceName: transaction.service?.title || 'Serviço',
      amount: transaction.amount_cents,
      paymentMethod: transaction.payment_method || 'pix',
      paidAt: transaction.paid_at || new Date().toISOString(),
    };

    const html = generateEmailHTML(emailData);

    // Enviar email via Resend
    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: 'Pagamentos <onboarding@resend.dev>',
      to: [emailData.userEmail],
      subject: `Pagamento Confirmado - ${emailData.serviceName}`,
      html,
    });

    if (emailError) {
      console.error('Erro ao enviar email:', emailError);
      throw emailError;
    }

    console.log('Email enviado com sucesso:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Email de notificação enviado com sucesso',
        emailId: emailResponse?.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro ao enviar notificação',
        details: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
