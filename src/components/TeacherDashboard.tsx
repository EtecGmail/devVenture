
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Book, FileText, Video, Users, Calendar, Edit, Trash2 } from 'lucide-react'; // Added Edit, Trash2

const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Área do Professor
          </h1>
          <p className="text-slate-600">
            Gerencie suas aulas, materiais e acompanhe o progresso dos alunos
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Plus,
              title: "Nova Aula",
              description: "Criar nova aula",
              color: "from-green-500 to-emerald-600"
            },
            {
              icon: FileText,
              title: "Exercícios",
              description: "Adicionar exercícios",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: Video,
              title: "Vídeos",
              description: "Upload de vídeos",
              color: "from-purple-500 to-purple-600"
            },
            {
              icon: Users,
              title: "Turmas",
              description: "Adicionar Turma", // Changed from "Gerenciar turmas"
              color: "from-orange-500 to-red-600"
            }
          ].map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <action.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Classes */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={20} />
                  Aulas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Introdução à Lógica de Programação",
                      date: "Hoje, 14:00",
                      students: 25,
                      status: "Em andamento"
                    },
                    {
                      title: "Estruturas Condicionais",
                      date: "Ontem, 16:00",
                      students: 23,
                      status: "Concluída"
                    },
                    {
                      title: "Laços de Repetição",
                      date: "15/01, 14:00",
                      students: 24,
                      status: "Agendada"
                    }
                  ].map((aula, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-slate-900">{aula.title}</h4>
                        <p className="text-sm text-slate-600">{aula.date} • {aula.students} alunos</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        aula.status === 'Em andamento' ? 'bg-green-100 text-green-800' :
                        aula.status === 'Concluída' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {aula.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gerenciamento de Turmas Card */}
            <Card className="mt-8"> {/* Added margin-top for spacing */}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} /> {/* Using Users icon for consistency with Turmas quick action */}
                  Gerenciamento de Turmas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Aqui você pode editar ou excluir turmas existentes, visualizar detalhes e gerenciar os alunos de cada turma.
                </p>
                <div className="space-y-3">
                  {/* Example of how individual class management actions could be listed or linked */}
                  <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                    <span className="font-medium text-slate-800">Turma A - Manhã</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        <Edit size={16} className="mr-1" /> Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 size={16} className="mr-1" /> Excluir
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                    <span className="font-medium text-slate-800">Turma B - Tarde</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        <Edit size={16} className="mr-1" /> Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 size={16} className="mr-1" /> Excluir
                      </Button>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Ver Todas as Turmas
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">127</div>
                  <div className="text-sm text-slate-600">Total de Alunos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">23</div>
                  <div className="text-sm text-slate-600">Aulas Criadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-slate-600">Taxa de Conclusão</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dúvidas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Como usar loops while?",
                    "Diferença entre if e switch?",
                    "Exercício 3 - Dúvida"
                  ].map((duvida, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-700">{duvida}</p>
                      <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-blue-600">
                        Responder
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
