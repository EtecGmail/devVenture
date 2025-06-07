
import { useState } from 'react';
import { Users, GraduationCap, User, Home, Menu, X } from 'lucide-react'; // Replaced Book with GraduationCap
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ProfileMenu from './ProfileMenu'; // Import ProfileMenu

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
  ];

  if (user?.type === 'professor') {
    menuItems.push({ name: 'Área do Professor', href: '/professor', icon: User });
  } else if (user?.type === 'aluno') {
    menuItems.push({ name: 'Área do Aluno', href: '/aluno', icon: GraduationCap }); // Replaced Book
  }

  if (!user) {
    menuItems.push({ name: 'Login Professor', href: '/professor/login', icon: User });
    menuItems.push({ name: 'Login Aluno', href: '/aluno/login', icon: GraduationCap }); // Replaced Book
  }
  // "Sair" button is now part of ProfileMenu or handled separately for logged-in users

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
          <div className="hidden md:flex items-center space-x-6"> {/* Reduced space-x-8 to space-x-6 */}
            {menuItems
              .filter(item => item.name !== 'Sair') // Filter out Sair if it was ever added
              .map((item) => (
              <a
                key={item.name}
                href={item.href!} // onClick items are not expected here anymore for general menu
                className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </a>
            ))}
            {user && (user.type === 'aluno' || user.type === 'professor') && (
              <ProfileMenu logout={logout} />
            )}
            {/* If user is logged in but not 'aluno' or 'professor', and a Sair button is needed: */}
            {user && user.type !== 'aluno' && user.type !== 'professor' && (
               <button
                  onClick={logout}
                  className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <X size={18} />
                  <span>Sair</span>
                </button>
            )}
          </div>

          {/* Mobile menu button & Profile Menu for Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (user.type === 'aluno' || user.type === 'professor') && (
              <ProfileMenu logout={logout} />
            )}
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
            {menuItems
              .filter(item => !(user && (user.type === 'aluno' || user.type === 'professor') && item.name === 'Sair')) // Remove Sair for relevant users as it's in ProfileMenu
              .map((item) => {
                // For mobile, if ProfileMenu handles Sair and Edit, we might not need Sair from menuItems
                // However, other users might still need Sair if ProfileMenu isn't shown for them.
                if (item.name === 'Sair' && user && (user.type === 'aluno' || user.type === 'professor')) {
                    return null; // Sair is in ProfileMenu for these users
                }
                return item.onClick ? (
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
                    href={item.href!}
                    className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </a>
                );
            })}
            {/* If Sair is needed for users not covered by ProfileMenu (e.g. admin, though admin is removed) */}
            {user && user.type !== 'aluno' && user.type !== 'professor' && (
                 <button
                    key="sair-mobile"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-3 px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-200"
                  >
                    <X size={18} />
                    <span>Sair</span>
                  </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
