-- Adicionar campos de taxa e valor líquido na tabela transactions
ALTER TABLE public.transactions 
ADD COLUMN fee_value integer,
ADD COLUMN net_value integer;

-- Atualizar transações existentes com cálculo de taxa de 5%
UPDATE public.transactions 
SET 
  fee_value = CAST(amount_cents * 0.05 AS integer),
  net_value = amount_cents - CAST(amount_cents * 0.05 AS integer)
WHERE fee_value IS NULL;

-- Tornar os campos obrigatórios
ALTER TABLE public.transactions 
ALTER COLUMN fee_value SET NOT NULL,
ALTER COLUMN net_value SET NOT NULL;