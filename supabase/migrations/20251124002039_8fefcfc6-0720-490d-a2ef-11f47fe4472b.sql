
-- Adicionar campos para integração com Asaas

-- Adicionar customer_id do Asaas na tabela de perfis
ALTER TABLE profiles 
ADD COLUMN asaas_customer_id TEXT;

-- Adicionar campos do Asaas nas transações
ALTER TABLE transactions
ADD COLUMN asaas_payment_id TEXT,
ADD COLUMN asaas_invoice_url TEXT;

-- Criar índices para melhor performance
CREATE INDEX idx_profiles_asaas_customer_id ON profiles(asaas_customer_id);
CREATE INDEX idx_transactions_asaas_payment_id ON transactions(asaas_payment_id);
CREATE INDEX idx_transactions_external_id ON transactions(external_id);
