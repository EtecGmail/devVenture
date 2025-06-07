
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoredUser as AppStoredUser, LOCAL_STORAGE_KEYS } from '@/types/admin'; // Renamed to avoid conflict
import { logActivity } from '@/lib/activityLog';

// The User type for the AuthContext's 'user' state can be simpler
// if not all StoredUser fields are needed for the active user session.
// However, when retrieving full user objects (e.g. list of students/teachers),
// AppStoredUser should be used.
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
  user: User | null; // This remains User, as it's for the currently authenticated session
  login: (email: string, password: string, type: 'aluno' | 'professor' | 'admin') => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    type: 'aluno' | 'professor', // Admin registration not allowed via this function
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
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER);
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
          localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));
          // Admin login successful, do not log activity for admin
          return true;
        }
        return false;
      }

      const storageKey = type === 'aluno' ? LOCAL_STORAGE_KEYS.ALUNOS : LOCAL_STORAGE_KEYS.PROFESSORS;
      const users: AppStoredUser[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const foundUser = users.find((u) => u.email === email);

      if (foundUser && await verifyPassword(password, foundUser.salt, foundUser.passwordHash)) {
        const sessionUserData: User = { // This is the session user, can be simpler
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          type: foundUser.type, // Ensure type is from foundUser
        };
        
        setUser(sessionUserData);
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(sessionUserData));

        // Log activity for 'aluno' or 'professor'
        // Ensure foundUser.type is narrowed correctly for logActivity
        if (foundUser.type === 'aluno' || foundUser.type === 'professor') {
          logActivity(foundUser.id, foundUser.type, 'login');
        }
        return true;
      }

      // If login as 'aluno' or 'professor' failed, try admin credentials
      // This specific admin check might be redundant if admin login is handled separately or if type is always 'admin' for admins
      if ((type === 'aluno' || type === 'professor') && email === 'admin@devventure.com' && password === 'admin123') {
        const adminUserData: User = {
          id: 'admin',
          email,
          name: 'Administrador',
          type: 'admin'
        };
        setUser(adminUserData);
        localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(adminUserData));
        // Admin login successful (fallback case), do not log activity for admin
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
    type: 'aluno' | 'professor', // Admin type removed as per previous change
    extras: RegisterExtras = {}
  ): Promise<RegisterResult> => {
    try {
      // Admin registration is not handled here
      const storageKey = type === 'aluno' ? LOCAL_STORAGE_KEYS.ALUNOS : LOCAL_STORAGE_KEYS.PROFESSORS;
      const users: AppStoredUser[] = JSON.parse(localStorage.getItem(storageKey) || '[]');

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
      const newUser: AppStoredUser = {
        id: generateId(),
        email,
        name,
        type, // Ensure type is set correctly
        passwordHash: hash,
        salt,
        createdAt: new Date().toISOString(),
        ...extras
      };

      users.push(newUser);
      localStorage.setItem(storageKey, JSON.stringify(users));

      // For the active session, we can still use the simpler User type
      const sessionUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        type: newUser.type,
      };

      setUser(sessionUser); // Set the simplified user object for the session
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(sessionUser));
      return { success: true };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, error: 'Erro no cadastro' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
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
