
// Configurações de segurança
export const securityConfig = {
  // Rate limiting
  loginRateLimit: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000 // 15 minutos
  },
  
  // Validação de senha
  passwordPolicy: {
    minLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false
  },

  // Headers de segurança
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  }
};

// Função para sanitizar strings
export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

// Função para validar email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função para validar força da senha
export const validatePasswordStrength = (password: string): boolean => {
  const { minLength } = securityConfig.passwordPolicy;
  return password.length >= minLength;
};

// Gerador de token CSRF simulado
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Aplicar headers de segurança (simulado para frontend)
