export interface StoredUser {
  id: string;          // uuid
  type: 'aluno' | 'professor' | 'admin';
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;   // ISO
  telefone?: string;
  // Aluno-only
  ra?: string;
  curso?: string;
  semestre?: string;
  // Professor-only
  cpf?: string;
  especializacao?: string;
  formacao?: string;
  registro?: string;
}

export interface ActivityLogEntry {
  id: string;            // uuid
  userId: string;
  userType: 'aluno' | 'professor';
  actionType: 'login' | 'aula_view' | 'exercicio_submit' | 'outro';
  timestamp: string;     // ISO
  details?: Record<string, any>;
}

export type Filters = {
  userType?: 'aluno' | 'professor';
  curso?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
};

export const LOCAL_STORAGE_KEYS = {
  ALUNOS: '@DevVenture:alunos',
  PROFESSORS: '@DevVenture:professors',
  ACTIVITY_LOG: '@DevVenture:activityLog',
  AUTH_USER: '@DevVenture:user', // Assuming this key is used by AuthContext
} as const;
