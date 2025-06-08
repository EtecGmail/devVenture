import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Users, User, BarChart2, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { to: '/admin/overview', label: 'Visão Geral', icon: Home },
  { to: '/admin/professores', label: 'Professores', icon: User },
  { to: '/admin/alunos', label: 'Alunos', icon: Users },
  { to: '/admin/analises', label: 'Análises', icon: BarChart2 },
]

const SidebarNav = () => {
  const [open, setOpen] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const onResize = () => setOpen(window.innerWidth >= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {!open && (
        <Button
          aria-label="Abrir menu"
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-40 lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </Button>
      )}
      <aside
        aria-label="Menu principal"
        className={cn(
          'fixed inset-y-0 left-0 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border z-40 transition-transform duration-300',
          open ? 'translate-x-0 w-64' : '-translate-x-full w-64',
          'lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <span className="font-semibold">Menu</span>
          <Button
            aria-label="Fechar menu"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
        <nav className="py-4 space-y-1">
          {links.map(Link => (
            <NavLink
              key={Link.to}
              to={Link.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-4 py-2 hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                  isActive && 'bg-sidebar-accent text-sidebar-primary-foreground'
                )
              }
              onClick={() => setOpen(false)}
            >
              <Link.icon size={18} className="mr-3" />
              <span>{Link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default SidebarNav
