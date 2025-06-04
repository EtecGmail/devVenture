
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredType?: 'aluno' | 'professor' | 'admin';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredType,
  redirectTo 
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    const loginPath = requiredType ? `/${requiredType}/login` : '/';
    navigate(redirectTo || loginPath);
    return null;
  }

  if (requiredType && user.type !== requiredType) {
    navigate(`/${user.type}`);
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
