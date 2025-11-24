import { validateCpf, validateCnpj } from "./cpfCnpjUtils";

export type PixKeyType = 'email' | 'phone' | 'cpf' | 'cnpj' | 'random' | 'invalid';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Telefone brasileiro: +55 (código do país) + DDD (2 dígitos) + número (8 ou 9 dígitos)
  // Formato: +5511999999999 ou +551199999999 (11 a 13 dígitos no total)
  if (numbers.length < 11 || numbers.length > 13) return false;
  
  // Se começar com 55 (código do Brasil)
  if (numbers.startsWith('55')) {
    const withoutCountryCode = numbers.substring(2);
    // DDD (2 dígitos) + número (8 ou 9 dígitos) = 10 ou 11 dígitos
    if (withoutCountryCode.length !== 10 && withoutCountryCode.length !== 11) return false;
    
    // Verifica se o DDD está entre 11 e 99
    const ddd = parseInt(withoutCountryCode.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;
    
    return true;
  }
  
  // Sem código do país: DDD + número
  if (numbers.length !== 10 && numbers.length !== 11) return false;
  
  // Verifica se o DDD está entre 11 e 99
  const ddd = parseInt(numbers.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  
  return true;
};

export const validateRandomKey = (key: string): boolean => {
  // Chave aleatória EVP: 32 caracteres alfanuméricos (sem hífens)
  const cleanKey = key.replace(/[-\s]/g, '');
  const randomKeyRegex = /^[a-f0-9]{32}$/i;
  return randomKeyRegex.test(cleanKey);
};

export const detectPixKeyType = (key: string): PixKeyType => {
  if (!key || key.trim().length === 0) return 'invalid';
  
  const trimmedKey = key.trim();
  
  // Verifica se é email
  if (validateEmail(trimmedKey)) return 'email';
  
  // Verifica se é telefone
  if (validatePhone(trimmedKey)) return 'phone';
  
  // Verifica se é CPF
  const numbers = trimmedKey.replace(/\D/g, '');
  if (numbers.length === 11 && validateCpf(trimmedKey)) return 'cpf';
  
  // Verifica se é CNPJ
  if (numbers.length === 14 && validateCnpj(trimmedKey)) return 'cnpj';
  
  // Verifica se é chave aleatória
  if (validateRandomKey(trimmedKey)) return 'random';
  
  return 'invalid';
};

export const formatPixPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  // Formato com código do país: +55 (11) 99999-9999
  if (numbers.startsWith('55') && numbers.length >= 12) {
    const countryCode = numbers.substring(0, 2);
    const ddd = numbers.substring(2, 4);
    const firstPart = numbers.substring(4, numbers.length - 4);
    const lastPart = numbers.substring(numbers.length - 4);
    return `+${countryCode} (${ddd}) ${firstPart}-${lastPart}`;
  }
  
  // Formato sem código do país: (11) 99999-9999
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return value;
};

export const validatePixKey = (key: string): { valid: boolean; type: PixKeyType; message?: string } => {
  if (!key || key.trim().length === 0) {
    return { valid: false, type: 'invalid', message: 'Digite uma chave PIX' };
  }
  
  const type = detectPixKeyType(key);
  
  switch (type) {
    case 'email':
      return { valid: true, type: 'email', message: 'Email válido' };
    case 'phone':
      return { valid: true, type: 'phone', message: 'Telefone válido' };
    case 'cpf':
      return { valid: true, type: 'cpf', message: 'CPF válido' };
    case 'cnpj':
      return { valid: true, type: 'cnpj', message: 'CNPJ válido' };
    case 'random':
      return { valid: true, type: 'random', message: 'Chave aleatória válida' };
    default:
      return { 
        valid: false, 
        type: 'invalid', 
        message: 'Chave PIX inválida. Use email, telefone, CPF, CNPJ ou chave aleatória' 
      };
  }
};

export const getPixKeyTypeLabel = (type: PixKeyType): string => {
  const labels: Record<PixKeyType, string> = {
    email: 'Email',
    phone: 'Telefone',
    cpf: 'CPF',
    cnpj: 'CNPJ',
    random: 'Chave Aleatória',
    invalid: 'Inválida'
  };
  return labels[type];
};
