-- Habilitar REPLICA IDENTITY FULL para capturar todos os dados nas atualizações
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Adicionar a tabela profiles à publicação realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;