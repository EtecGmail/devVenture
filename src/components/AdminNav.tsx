import { useState, useEffect } from 'react';
import { Home, Users, User, BarChart2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { id: 'overview', label: 'Resumo', icon: Home },
  { id: 'students', label: 'Alunos', icon: Users },
  { id: 'teachers', label: 'Professores', icon: User },
  { id: 'charts', label: 'Gráficos', icon: BarChart2 },
];

const AdminNav = () => {
  const [open, setOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setOpen(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {!open && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-40 lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </Button>
      )}
      <div
        className={`fixed top-0 left-0 h-full bg-slate-800 text-slate-100 z-40 transition-transform duration-300 ${
          open ? 'translate-x-0 w-56' : '-translate-x-full w-56'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <span className="font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(o => !o)}
            className="lg:hidden text-slate-100"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        <nav className="py-4 space-y-1">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex items-center px-4 py-2 hover:bg-slate-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              <item.icon size={18} className="mr-3" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminNav;
