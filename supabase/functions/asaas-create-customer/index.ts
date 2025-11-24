import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ASAAS_API_URL = 'https://api.asaas.com/v3';

const CreateCustomerSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }).max(100, { message: 'Name must be less than 100 characters' }),
  email: z.string().email({ message: 'Invalid email address' }).max(255, { message: 'Email must be less than 255 characters' }),
  cpfCnpj: z.string().optional(),
  phone: z.string().optional(),
});

type CreateCustomerRequest = z.infer<typeof CreateCustomerSchema>;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const asaasApiKey = Deno.env.get('ASAAS_API_KEY')!;
  
  const authHeader = req.headers.get('Authorization')!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const rawBody = await req.json();
    
    // Validate input using Zod schema
    const validationResult = CreateCustomerSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation error',
          details: validationResult.error.errors 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const { name, email, cpfCnpj, phone }: CreateCustomerRequest = validationResult.data;

    console.log('Criando cliente no Asaas:', { name, email });

    // Verificar se já existe customer_id no perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('asaas_customer_id')
      .eq('id', user.id)
      .single();

    if (profile?.asaas_customer_id) {
      return new Response(
        JSON.stringify({
          success: true,
          customerId: profile.asaas_customer_id,
          message: 'Cliente já existe',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Criar cliente no Asaas
    const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        cpfCnpj,
        phone,
        externalReference: user.id,
      }),
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.error('Erro ao criar cliente no Asaas:', errorText);
      throw new Error('Erro ao criar cliente no Asaas');
    }

    const customer = await customerResponse.json();
    console.log('Cliente criado no Asaas:', customer.id);

    // Atualizar perfil com customer_id
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ asaas_customer_id: customer.id })
      .eq('id', user.id);

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        customerId: customer.id,
        message: 'Cliente criado com sucesso',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Erro ao criar cliente:', error);
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
