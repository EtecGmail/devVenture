import { useState } from 'react';
import { ChevronDown, User, Edit3, X } from 'lucide-react'; // Added X here
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface ProfileMenuProps {
  logout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center space-x-2 rounded-full p-1 hover:bg-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
        <span className="text-white font-medium text-sm hidden sm:block">{user.name || user.email}</span>
        <ChevronDown size={16} className="text-slate-400" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-slate-700">
            <p className="text-sm font-medium text-white">{user.name || user.email}</p>
            <p className="text-xs text-slate-400">{user.type}</p>
          </div>
          <a
            href="#" // Placeholder link for "Editar dados pessoais"
            className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <Edit3 size={16} className="mr-2" />
            Editar dados pessoais
          </a>
          <Button
            variant="ghost"
            className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white text-left justify-start"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            <X size={16} className="mr-2" />
            Sair
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
