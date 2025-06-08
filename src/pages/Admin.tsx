import { Outlet } from 'react-router-dom'
import SidebarNav from '@/components/SidebarNav'
import Footer from '@/components/Footer'

const Admin = () => {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar de navegação */}
      <SidebarNav />
      <main className="flex-1 ml-0 lg:ml-64 pt-4">
        <Outlet />
        <Footer />
      </main>
    </div>
  )
}

export default Admin
