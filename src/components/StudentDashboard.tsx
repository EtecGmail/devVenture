
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Book, Video, FileText, Trophy, MessageCircle, Play } from 'lucide-react';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Área do Aluno
          </h1>
          <p className="text-slate-600">
            Continue seus estudos em lógica de programação
          </p>
        </div>

        {/* Progress Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Seu Progresso</h3>
                <p className="text-slate-600">Módulo: Lógica de Programação Básica</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">67%</div>
                <div className="text-sm text-slate-600">Concluído</div>
              </div>
            </div>
            <Progress value={67} className="h-3" />
            <div className="flex justify-between text-sm text-slate-600 mt-2">
              <span>Aula 8 de 12</span>
              <span>Faltam 4 aulas</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Lesson */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play size={20} className="text-green-600" />
                  Próxima Aula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Book className="text-white" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Estruturas de Repetição - Parte 2
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Aprenda sobre loops while e do-while com exemplos práticos
                    </p>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      Continuar Aula
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "exercise",
                      title: "Exercício: Calculadora Simples",
                      status: "Concluído",
                      score: "85%",
                      icon: FileText,
                      color: "text-green-600"
                    },
                    {
                      type: "video",
                      title: "Vídeo: Introdução aos Arrays",
                      status: "Assistido",
                      score: "100%",
                      icon: Video,
                      color: "text-blue-600"
                    },
                    {
                      type: "exercise",
                      title: "Desafio: Jogo da Adivinhação",
                      status: "Pendente",
                      score: "-",
                      icon: Trophy,
                      color: "text-orange-600"
                    }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <activity.icon className={activity.color} size={20} />
                        <div>
                          <h4 className="font-medium text-slate-900">{activity.title}</h4>
                          <p className="text-sm text-slate-600">{activity.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">{activity.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ranking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-600" />
                  Ranking da Turma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Ana Silva", score: 950, position: 1 },
                    { name: "João Santos", score: 920, position: 2 },
                    { name: "Você", score: 890, position: 3, highlight: true },
                    { name: "Maria Costa", score: 875, position: 4 },
                    { name: "Pedro Lima", score: 860, position: 5 }
                  ].map((student, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        student.highlight ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          student.position <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {student.position}
                        </div>
                        <span className={`font-medium ${student.highlight ? 'text-blue-900' : 'text-slate-900'}`}>
                          {student.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">{student.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Forum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle size={20} />
                  Fórum de Dúvidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Como debugar um código?",
                    "Diferença entre função e procedimento?",
                    "Ajuda com exercício 5"
                  ].map((question, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700 mb-2">{question}</p>
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600">
                        Ver discussão
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Fazer uma pergunta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
