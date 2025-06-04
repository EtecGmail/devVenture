
import { useState } from 'react';
import { Users, Book, User, Home, Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
  ];

  if (user?.type === 'professor') {
    menuItems.push({ name: 'Área do Professor', href: '/professor', icon: User });
  } else if (user?.type === 'aluno') {
    menuItems.push({ name: 'Área do Aluno', href: '/aluno', icon: Book });
  } else if (user?.type === 'admin') {
    menuItems.push({ name: 'Admin', href: '/admin', icon: Shield });
  }

  if (!user) {
    menuItems.push({ name: 'Login Professor', href: '/professor/login', icon: User });
    menuItems.push({ name: 'Login Aluno', href: '/aluno/login', icon: Book });
    menuItems.push({ name: 'Login Admin', href: '/admin/login', icon: Shield });
  } else {
    menuItems.push({ name: 'Sair', href: '#', icon: X, onClick: logout });
  }

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
                src="/LOGO-removebg.png"
                alt="DevVenture logo"
                className="w-32 h-32 object-contain"
              />
            <span className="text-white font-bold text-xl">DevVenture</span>
            <span className="text-blue-400 text-sm"></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) =>
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </button>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </a>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            {menuItems.map((item) =>
              item.onClick ? (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    }
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center space-x-3 px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-200"
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </button>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </a>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
