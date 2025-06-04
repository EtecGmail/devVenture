
import Navigation from '@/components/Navigation';
import TeacherDashboard from '@/components/TeacherDashboard';
import Footer from '@/components/Footer';

const Professor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <TeacherDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Professor;
