
import { Button } from '@/components/ui/button';
import {
  BookOpenText,
  Workflow,
  MessagesSquare,
  Award,
  Video,
  Code,
  Trophy,
  MessageCircle,
  Code2,
  CalendarClock,
} from 'lucide-react';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                DevVenture
                <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Lógica de Programação
                </span>
                <span className="block text-white">
                  Interativa
                </span>
              </h1>
            </div>
            
            <p className="text-xl text-slate-300 leading-relaxed">
              Sistema web educacional completo que permite professores cadastrarem aulas, 
              exercícios, vídeos explicativos e desafios gamificados, oferecendo aos alunos 
              recursos interativos como visualização de fluxogramas, execução simulada de 
              algoritmos, fórum de dúvidas e rankings de desempenho para facilitar o 
              ensino e aprendizado da lógica de programação básica.
            </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#6D28D9] to-[#3B82F6] text-white px-8 py-3 rounded-full shadow-md font-semibold transition-all duration-300 hover:from-[#5b21b6] hover:to-[#2563EB]"
                >
                  <FaChalkboardTeacher className="mr-2" /> Área do Professor
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white border border-blue-400 text-blue-400 hover:bg-[#2563EB] hover:text-white px-8 py-3 rounded-full shadow-md font-semibold transition-all duration-300"
                >
                  <FaUserGraduate className="mr-2" /> Área do Aluno
                </Button>
              </div>
          </div>

          {/* Interactive Features Illustration */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-xl p-4 hover:bg-slate-700/40 transition-all duration-300">
                <Code className="text-blue-400 mb-2" size={32} />
                <p className="text-white text-sm font-medium">Simulador de Algoritmos</p>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-xl p-4 hover:bg-slate-700/40 transition-all duration-300">
                <Trophy className="text-purple-400 mb-2" size={32} />
                <p className="text-white text-sm font-medium">Rankings & Gamificação</p>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-xl p-4 hover:bg-slate-700/40 transition-all duration-300">
                <Video className="text-green-400 mb-2" size={32} />
                <p className="text-white text-sm font-medium">Vídeos Explicativos</p>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-xl p-4 hover:bg-slate-700/40 transition-all duration-300">
                <MessageCircle className="text-yellow-400 mb-2" size={32} />
                <p className="text-white text-sm font-medium">Fórum Interativo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-20">
          {[
            {
              icon: BookOpenText,
              color: "text-[#A855F7]",
              hover: "hover:bg-purple-500/10",
              title: "Gestão de Aulas",
              tooltip: "Gerencie aulas, conteúdos e exercícios de forma organizada",
              description: "Cadastro de aulas, exercícios e materiais de apoio pelos professores",
            },
            {
              icon: Workflow,
              color: "text-[#22D3EE]",
              hover: "hover:bg-cyan-500/10",
              title: "Visualização de Fluxogramas",
              tooltip: "Crie e explore algoritmos com recursos visuais",
              description: "Ferramentas interativas para compreender algoritmos visualmente",
            },
            {
              icon: MessagesSquare,
              color: "text-[#60A5FA]",
              hover: "hover:bg-blue-500/10",
              title: "Fórum de Dúvidas",
              tooltip: "Compartilhe dúvidas e ajude seus colegas",
              description: "Espaço colaborativo para interação entre alunos e professores",
            },
            {
              icon: Award,
              color: "text-[#FACC15]",
              hover: "hover:bg-yellow-400/10",
              title: "Desafios Gamificados",
              tooltip: "Suba no ranking ao resolver desafios e acumule conquistas",
              description: "Rankings de desempenho e sistema de conquistas motivacionais",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 ${feature.hover}`}
              title={feature.tooltip}
            >
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-lg bg-slate-700/50">
                <feature.icon className={feature.color} size={24} />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="mt-16 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Recursos Completos para Ensino e Aprendizado
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Video,
              color: "text-[#F472B6]",
              title: "Vídeos Explicativos",
              description: "Conteúdo audiovisual para diferentes estilos de aprendizado",
            },
            {
              icon: Code2,
              color: "text-[#34D399]",
              title: "Execução Simulada",
              description: "Execute e visualize algoritmos passo a passo",
            },
            {
              icon: CalendarClock,
              color: "text-[#C084FC]",
              title: "Cronograma Estruturado",
              description: "Organize seu progresso com um plano claro",
            }].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4" title={feature.description}>
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700/50">
                  <feature.icon className={feature.color} size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
