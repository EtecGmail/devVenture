import AdminDashboard from '@/components/AdminDashboard';
import Footer from '@/components/Footer';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
