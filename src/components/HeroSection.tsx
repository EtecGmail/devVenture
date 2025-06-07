
import { Button } from '@/components/ui/button';
import { Book, Users, Calendar, Search, Code, Trophy, Video, MessageCircle } from 'lucide-react';

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
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Área do Professor
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Área do Aluno
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
              icon: Book,
              title: "Gestão de Aulas",
              description: "Cadastro de aulas, exercícios e materiais de apoio pelos professores"
            },
            {
              icon: Code,
              title: "Visualização de Fluxogramas",
              description: "Ferramentas interativas para compreender algoritmos visualmente"
            },
            {
              icon: Users,
              title: "Fórum de Dúvidas",
              description: "Espaço colaborativo para interação entre alunos e professores"
            },
            {
              icon: Trophy,
              title: "Desafios Gamificados",
              description: "Rankings de desempenho e sistema de conquistas motivacionais"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-white" size={24} />
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
                title: "Vídeos Explicativos",
                description: "Conteúdo audiovisual para diferentes estilos de aprendizado"
              },
              {
                icon: Search,
                title: "Execução Simulada",
                description: "Execute e visualize algoritmos passo a passo"
              },
              {
                icon: Calendar,
                title: "Cronograma Estruturado",
                description: "Organização temporal do conteúdo pedagógico"
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
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
