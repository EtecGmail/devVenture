
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  type: 'aluno' | 'professor';
}

interface AuthContextData {
  user: User | null;
  login: (email: string, password: string, type: 'aluno' | 'professor') => Promise<boolean>;
  register: (email: string, password: string, name: string, type: 'aluno' | 'professor') => Promise<boolean>;
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

  const login = async (email: string, password: string, type: 'aluno' | 'professor'): Promise<boolean> => {
    try {
      // Simulação de API call - em produção, substituir por chamada real
      const users = JSON.parse(localStorage.getItem(`@DevVenture:${type}s`) || '[]');
      const foundUser = users.find((u: any) => u.email === email);
      
      if (foundUser && await verifyPassword(password, foundUser.passwordHash)) {
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
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, type: 'aluno' | 'professor'): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem(`@DevVenture:${type}s`) || '[]');
      
      // Verificar se email já existe
      if (users.find((u: any) => u.email === email)) {
        return false;
      }

      const passwordHash = await hashPassword(password);
      const newUser = {
        id: generateId(),
        email,
        name,
        passwordHash,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(`@DevVenture:${type}s`, JSON.stringify(users));

      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        type
      };

      setUser(userData);
      localStorage.setItem('@DevVenture:user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return false;
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
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt_' + Date.now());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  // Em produção, usar bcrypt ou similar
  const newHash = await hashPassword(password.split('salt_')[0] || password);
  return newHash === hash;
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
