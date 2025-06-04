
import { useState } from 'react';
import { Users, Book, User, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Área do Professor', href: '/professor', icon: User },
    { name: 'Área do Aluno', href: '/aluno', icon: Book },
    { name: 'Login Professor', href: '/professor/login', icon: User },
    { name: 'Login Aluno', href: '/aluno/login', icon: Book },
  ];

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
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </a>
            ))}
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
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
