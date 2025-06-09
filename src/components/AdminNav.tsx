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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [open, setOpen] = useState(!isMobile); // Open if not mobile, closed if mobile initially

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      if (newIsMobile !== isMobile) { // Only update if the mobile status actually changes
        setIsMobile(newIsMobile);
        setOpen(!newIsMobile); // When breakpoint crossed, set 'open' accordingly
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  return (
    <>
      {isMobile && !open && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-20 left-4 z-50 lg:hidden" // z-50 to be above nav if it's also z-40
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </Button>
      )}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" // z-30 to be below nav (z-40)
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed top-16 left-0 h-full bg-slate-800 text-slate-100 z-40 transition-transform duration-300 ${
          open ? 'translate-x-0 w-56' : '-translate-x-full w-56'
        } lg:translate-x-0 lg:w-56`} // Ensure lg:w-56 is there for desktop
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <span className="font-semibold">Menu Principal</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)} // Always close on mobile when X is clicked
            className="lg:hidden text-slate-100"
            aria-label="Close menu"
          >
            <X size={20} />
          </Button>
        </div>
        <nav className="py-4 space-y-1">
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex items-center px-4 py-2 hover:bg-slate-700 transition-colors"
              onClick={() => {
                if (isMobile) setOpen(false); // Close nav on item click on mobile
              }}
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
