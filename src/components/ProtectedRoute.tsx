
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredType?: 'aluno' | 'professor';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredType,
  redirectTo 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    const loginPath = requiredType ? `/${requiredType}/login` : '/';
    window.location.href = redirectTo || loginPath;
    return null;
  }

  if (requiredType && user.type !== requiredType) {
    window.location.href = `/${user.type}`;
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
