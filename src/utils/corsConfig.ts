
// Configuração de CORS para ambiente de desenvolvimento
export const corsConfig = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token'
  ]
};

// Middleware simulado para verificação de CORS
export const validateCORSRequest = (origin: string): boolean => {
  if (!origin) return false;
  
  return corsConfig.origin.some(allowedOrigin => {
    if (allowedOrigin === '*') return true;
    return origin === allowedOrigin;
  });
};

// Headers CORS para respostas
export const getCORSHeaders = (origin: string) => {
  return {
    'Access-Control-Allow-Origin': corsConfig.origin.includes(origin) ? origin : 'null',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': corsConfig.methods.join(', '),
    'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', ')
  };
};
