import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default Admin;
