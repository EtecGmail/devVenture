
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'aluno' | 'professor' | 'admin';
}

export interface StoredUser extends User {
  passwordHash: string;
  salt: string;
  createdAt: string;
  cpf?: string;
  ra?: string;
  curso?: string;
  semestre?: string;
  telefone?: string;
  especializacao?: string;
  formacao?: string;
  registro?: string;
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
  login: (email: string, password: string, type: 'aluno' | 'professor' | 'admin') => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    type: 'aluno' | 'professor' | 'admin',
    extras?: RegisterExtras
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
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('@DevVenture:user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, type: 'aluno' | 'professor' | 'admin'): Promise<boolean> => {
    try {
      if (type === 'admin') {
        // Admin com credenciais fixas
        if (email === 'admin@devventure.com' && password === 'admin123') {
          const userData: User = {
            id: 'admin',
            email,
            name: 'Administrador',
            type: 'admin'
          };
          setUser(userData);
          localStorage.setItem('@DevVenture:user', JSON.stringify(userData));
          return true;
        }
        return false;
      }

      // Simulação de API call - em produção, substituir por chamada real
      const users: StoredUser[] = JSON.parse(localStorage.getItem(`@DevVenture:${type}s`) || '[]');
      const foundUser = users.find((u) => u.email === email);

      if (foundUser && await verifyPassword(password, foundUser.salt, foundUser.passwordHash)) {
        const userData: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          type
        };
        
        setUser(userData);
        localStorage.setItem('@DevVenture:user', JSON.stringify(userData));
        return true;
      }

      // If login as 'aluno' or 'professor' failed, try admin credentials
      if ((type === 'aluno' || type === 'professor') && email === 'admin@devventure.com' && password === 'admin123') {
        const adminUserData: User = {
          id: 'admin',
          email,
          name: 'Administrador',
          type: 'admin'
        };
        setUser(adminUserData);
        localStorage.setItem('@DevVenture:user', JSON.stringify(adminUserData));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
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
      if (type === 'admin') {
        // cadastro de administradores não permitido via app
        return { success: false, error: 'Cadastro de administradores não permitido' };
      }
      const users: StoredUser[] = JSON.parse(localStorage.getItem(`@DevVenture:${type}s`) || '[]');

      // Verificar se email já existe
      if (users.find((u) => u.email === email)) {
        return { success: false, error: 'E-mail já em uso' };
      }

      if (extras.cpf && users.find((u) => u.cpf === extras.cpf)) {
        return { success: false, error: 'CPF já cadastrado' };
      }

      if (extras.ra && users.find((u) => u.ra === extras.ra)) {
        return { success: false, error: 'RA já cadastrado' };
      }

      const { salt, hash } = await hashPassword(password);
      const newUser: StoredUser = {
        id: generateId(),
        email,
        name,
        passwordHash: hash,
        salt,
        createdAt: new Date().toISOString(),
        ...extras
      };

      users.push(newUser);
      localStorage.setItem(`@DevVenture:${type}s`, JSON.stringify(users));

      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        type
      };

      if (autoLogin) {
        setUser(userData);
        localStorage.setItem('@DevVenture:user', JSON.stringify(userData));
      }
      return { success: true };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, error: 'Erro no cadastro' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@DevVenture:user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading
    }}>
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

// Funções de hash e verificação de senha (simuladas)
const generateSalt = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

const hashPassword = async (password: string, salt?: string): Promise<{ salt: string; hash: string }> => {
  const usedSalt = salt || generateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(password + usedSalt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return { salt: usedSalt, hash };
};

const verifyPassword = async (password: string, salt: string, hash: string): Promise<boolean> => {
  // Em produção, usar bcrypt ou similar
  const { hash: newHash } = await hashPassword(password, salt);
  return newHash === hash;
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Função para verificar a força da senha
export const isStrongPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false; // Ajuste os símbolos conforme necessário
  return true;
};
