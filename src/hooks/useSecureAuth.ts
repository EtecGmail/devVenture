
import { useState } from 'react';
import { useRateLimit } from './useRateLimit';
import { securityConfig, validateEmail, validatePasswordStrength } from '@/utils/security';

export const useSecureAuth = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);

  const rateLimit = useRateLimit(securityConfig.loginRateLimit);

  const attemptLogin = async (email: string, password: string): Promise<boolean> => {
    // Verificar rate limiting
    if (!rateLimit.isAllowed()) {
      const remainingTime = Math.ceil(rateLimit.getRemainingTime() / 1000 / 60);
      setIsBlocked(true);
      setBlockTime(remainingTime);
      throw new Error(`Muitas tentativas. Tente novamente em ${remainingTime} minutos.`);
    }

    // Validações básicas
    if (!validateEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!validatePasswordStrength(password)) {
      throw new Error('Senha não atende aos critérios de segurança');
    }

    return true;
  };

  return {
    attemptLogin,
    isBlocked,
    blockTime,
    attemptsCount: rateLimit.attemptsCount
  };
};
