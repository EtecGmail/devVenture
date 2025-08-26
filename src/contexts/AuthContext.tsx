import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  loginAluno,
  loginProfessor,
  loginAdmin,
  registerStudent,
  registerTeacher,
  registerAdmin,
  logout as serviceLogout,
  getCurrentUser,
  Student,
  Teacher,
  Admin
} from '@/services/auth';
import { ApiError } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'aluno' | 'professor' | 'admin';
}

export interface RegisterExtras {
  cpf?: string;
  ra?: string;
  curso?: string;
  semestre?: string;
  telefone?: string;
  especializacao?: string;
  formacao?: string;
  registro?: string;
}

interface RegisterResult {
  success: boolean;
  error?: string;
}

interface AuthContextData {
  user: User | null;
  login: (
    email: string,
    password: string,
    type: 'aluno' | 'professor' | 'admin'
  ) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    type: 'aluno' | 'professor' | 'admin',
    extras?: RegisterExtras,
    autoLogin?: boolean
  ) => Promise<RegisterResult>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    type: 'aluno' | 'professor' | 'admin'
  ): Promise<boolean> => {
    try {
      let apiUser: Student | Teacher | Admin;
      if (type === 'aluno') apiUser = await loginAluno(email, password);
      else if (type === 'professor') apiUser = await loginProfessor(email, password);
      else apiUser = await loginAdmin(email, password);

      const userData: User = {
        id: String(apiUser.id),
        email: apiUser.email,
        name: apiUser.name,
        type
      };
      setUser(userData);
      localStorage.setItem('dv:user', JSON.stringify(userData));
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Erro no login');
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    type: 'aluno' | 'professor' | 'admin',
    extras: RegisterExtras = {},
    autoLogin = true
  ): Promise<RegisterResult> => {
    try {
      let apiUser: Student | Teacher | Admin;
      if (type === 'aluno') {
        apiUser = await registerStudent({ name, email, password, ...extras });
      } else if (type === 'professor') {
        apiUser = await registerTeacher({ name, email, password, ...extras });
      } else {
        apiUser = await registerAdmin({ name, email, password });
      }

      const userData: User = {
        id: String(apiUser.id),
        email: apiUser.email,
        name: apiUser.name,
        type
      };

      if (autoLogin) {
        setUser(userData);
        localStorage.setItem('dv:user', JSON.stringify(userData));
      }

      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Erro no cadastro' };
    }
  };

  const logout = () => {
    serviceLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const isStrongPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false; // Ajuste os símbolos conforme necessário
  return true;
};
