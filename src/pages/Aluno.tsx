
import Navigation from '@/components/Navigation';
import StudentDashboard from '@/components/StudentDashboard';
import Footer from '@/components/Footer';

const Aluno = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <StudentDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Aluno;
