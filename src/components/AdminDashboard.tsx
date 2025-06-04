import { useEffect, useState } from 'react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { isCPFValid } from '@/utils/cpf';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { parseISO, format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface SimpleUser {
  id: string
  name: string
  email: string
  createdAt?: string
  ra?: string
  curso?: string
  semestre?: string
  telefone?: string
  cpf?: string
  especializacao?: string
  formacao?: string
  registro?: string
}

interface ChartPoint {
  month: string
  alunos: number
  professores: number
}

const AdminDashboard = () => {
  const [students, setStudents] = useState<SimpleUser[]>([]);
  const [teachers, setTeachers] = useState<SimpleUser[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([])

  const [showStudentDialog, setShowStudentDialog] = useState(false)
  const [showTeacherDialog, setShowTeacherDialog] = useState(false)
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    ra: '',
    curso: '',
    semestre: '',
    telefone: ''
  })
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    especializacao: '',
    formacao: '',
    telefone: '',
    registro: ''
  })

  const studentValidationRules = {
    name: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, minLength: 6 },
    ra: { required: true, minLength: 5, maxLength: 20 },
    curso: { required: true },
    semestre: { required: true },
    telefone: { pattern: /^[0-9\s()+-]*$/ }
  }

  const teacherValidationRules = {
    name: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { required: true, minLength: 6 },
    cpf: { required: true, validate: isCPFValid },
    especializacao: { required: true },
    formacao: { required: true },
    registro: { required: true, minLength: 3 },
    telefone: { pattern: /^[0-9\s()+-]*$/ }
  }

  const {
    errors: studentErrors,
    validateField: validateStudentField,
    validateForm: validateStudentForm,
    sanitizeInput: sanitizeStudentInput
  } = useFormValidation(studentValidationRules)

  const {
    errors: teacherErrors,
    validateField: validateTeacherField,
    validateForm: validateTeacherForm,
    sanitizeInput: sanitizeTeacherInput
  } = useFormValidation(teacherValidationRules)

  const { register } = useAuth()

  const handleStudentChange = (field: string, value: string) => {
    let processed = value
    if (field === 'telefone') {
      processed = processed.replace(/[^0-9\s()+-]/g, '')
    }
    const sanitized = sanitizeStudentInput(processed, field === 'name' || field === 'telefone')
    setStudentForm(prev => ({ ...prev, [field]: sanitized }))
    validateStudentField(field, sanitized)
  }

  const handleTeacherChange = (field: string, value: string) => {
    let processed = value
    if (field === 'telefone') {
      processed = processed.replace(/[^0-9\s()+-]/g, '')
    }
    if (field === 'cpf') {
      processed = processed.replace(/\D/g, '').slice(0, 11)
    }
    const sanitized = sanitizeTeacherInput(processed, ['name', 'formacao', 'especializacao', 'telefone'].includes(field))
    setTeacherForm(prev => ({ ...prev, [field]: sanitized }))
    validateTeacherField(field, sanitized)
  }

  const refreshData = () => {
    const alunoData = JSON.parse(
      localStorage.getItem('@DevVenture:alunos') || '[]'
    )
    const professorData = JSON.parse(
      localStorage.getItem('@DevVenture:professors') || '[]'
    )
    setStudents(alunoData)
    setTeachers(professorData)
  }

  const handleAddStudent = async () => {
    if (!validateStudentForm(studentForm)) {
      return
    }

    const result = await register(
      studentForm.email,
      studentForm.password,
      studentForm.name,
      'aluno',
      {
        ra: studentForm.ra,
        curso: studentForm.curso,
        semestre: studentForm.semestre,
        telefone: studentForm.telefone
      }
    )
    if (result.success) {
      refreshData()
      setShowStudentDialog(false)
      setStudentForm({
        name: '',
        email: '',
        password: '',
        ra: '',
        curso: '',
        semestre: '',
        telefone: ''
      })
    } else {
      alert(result.error || 'Erro ao cadastrar aluno')
    }
  }

  const handleAddTeacher = async () => {
    if (!validateTeacherForm(teacherForm)) {
      return
    }

    const result = await register(
      teacherForm.email,
      teacherForm.password,
      teacherForm.name,
      'professor',
      {
        cpf: teacherForm.cpf,
        especializacao: teacherForm.especializacao,
        formacao: teacherForm.formacao,
        telefone: teacherForm.telefone,
        registro: teacherForm.registro
      }
    )
    if (result.success) {
      refreshData()
      setShowTeacherDialog(false)
      setTeacherForm({
        name: '',
        email: '',
        password: '',
        cpf: '',
        especializacao: '',
        formacao: '',
        telefone: '',
        registro: ''
      })
    } else {
      alert(result.error || 'Erro ao cadastrar professor')
    }
  }

  const deleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id)
    setStudents(updated)
    localStorage.setItem('@DevVenture:alunos', JSON.stringify(updated))
  }

  const deleteTeacher = (id: string) => {
    const updated = teachers.filter((t) => t.id !== id)
    setTeachers(updated)
    localStorage.setItem('@DevVenture:professors', JSON.stringify(updated))
  }

  const exportCSV = (type: 'alunos' | 'professors') => {
    const data = type === 'alunos' ? students : teachers
    const csv =
      'Nome,Email\n' + data.map((u) => `${u.name},${u.email}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const alunoData = JSON.parse(
      localStorage.getItem('@DevVenture:alunos') || '[]'
    )
    const professorData = JSON.parse(
      localStorage.getItem('@DevVenture:professors') || '[]'
    )
    setStudents(alunoData)
    setTeachers(professorData)

    const counts: Record<string, ChartPoint> = {}

    alunoData.forEach((u: SimpleUser) => {
      if (!u.createdAt) return
      const m = format(parseISO(u.createdAt), 'yyyy-MM')
      if (!counts[m]) counts[m] = { month: m, alunos: 0, professores: 0 }
      counts[m].alunos += 1
    })

    professorData.forEach((u: SimpleUser) => {
      if (!u.createdAt) return
      const m = format(parseISO(u.createdAt), 'yyyy-MM')
      if (!counts[m]) counts[m] = { month: m, alunos: 0, professores: 0 }
      counts[m].professores += 1
    })

    const data = Object.values(counts).sort((a, b) => a.month.localeCompare(b.month))
    setChartData(data)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0">
              <div className="text-center flex-1">
                <div className="text-3xl font-bold text-blue-600">{students.length}</div>
                <div className="text-sm text-slate-600">Alunos cadastrados</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-3xl font-bold text-purple-600">{teachers.length}</div>
                <div className="text-sm text-slate-600">Professores cadastrados</div>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="alunos" stroke="#3b82f6" name="Alunos" />
                    <Line type="monotone" dataKey="professores" stroke="#8b5cf6" name="Professores" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Students Card */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <CardTitle>Alunos</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button size="sm" onClick={() => setShowStudentDialog(true)}>
                Adicionar
              </Button>
              <Button size="sm" variant="outline" onClick={() => exportCSV('alunos')}>
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden sm:table-cell">RA</TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s: SimpleUser) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{s.email}</TableCell>
                      <TableCell className="hidden sm:table-cell">{s.ra}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => deleteStudent(s.id)}>
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Card */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <CardTitle>Professores</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button size="sm" onClick={() => setShowTeacherDialog(true)}>
                Adicionar
              </Button>
              <Button size="sm" variant="outline" onClick={() => exportCSV('professors')}>
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">CPF</TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((t: SimpleUser) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{t.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{t.cpf}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => deleteTeacher(t.id)}>
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Controle de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Área para upload e organização de aulas, exercícios e vídeos (em breve).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Relatórios e Métricas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Estatísticas de acesso às aulas e desempenho médio dos alunos serão exibidas aqui.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Gestão de permissões e políticas de autenticação planejadas para próximas versões.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Comunicação e Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Sistema de mensagens e central de ajuda em desenvolvimento.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Integrações e Personalização</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Integração com serviços externos e opções de tema serão disponibilizadas futuramente.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dialogs */}
        <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo Aluno</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Nome"
                  value={studentForm.name}
                  onChange={(e) => handleStudentChange('name', e.target.value)}
                />
                {studentErrors.name && (
                  <p className="text-red-500 text-sm">{studentErrors.name}</p>
                )}
              </div>
              
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => handleStudentChange('email', e.target.value)}
                />
                {studentErrors.email && (
                  <p className="text-red-500 text-sm">{studentErrors.email}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="RA"
                    value={studentForm.ra}
                    onChange={(e) => handleStudentChange('ra', e.target.value)}
                  />
                  {studentErrors.ra && (
                    <p className="text-red-500 text-sm">{studentErrors.ra}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    placeholder="Curso"
                    value={studentForm.curso}
                    onChange={(e) => handleStudentChange('curso', e.target.value)}
                  />
                  {studentErrors.curso && (
                    <p className="text-red-500 text-sm">{studentErrors.curso}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Semestre"
                    value={studentForm.semestre}
                    onChange={(e) => handleStudentChange('semestre', e.target.value)}
                  />
                  {studentErrors.semestre && (
                    <p className="text-red-500 text-sm">{studentErrors.semestre}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    placeholder="Telefone"
                    value={studentForm.telefone}
                    onChange={(e) => handleStudentChange('telefone', e.target.value)}
                  />
                  {studentErrors.telefone && (
                    <p className="text-red-500 text-sm">{studentErrors.telefone}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Input
                  placeholder="Senha"
                  type="password"
                  value={studentForm.password}
                  onChange={(e) => handleStudentChange('password', e.target.value)}
                />
                {studentErrors.password && (
                  <p className="text-red-500 text-sm">{studentErrors.password}</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleAddStudent}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo Professor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Nome"
                  value={teacherForm.name}
                  onChange={(e) => handleTeacherChange('name', e.target.value)}
                />
                {teacherErrors.name && (
                  <p className="text-red-500 text-sm">{teacherErrors.name}</p>
                )}
              </div>
              
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => handleTeacherChange('email', e.target.value)}
                />
                {teacherErrors.email && (
                  <p className="text-red-500 text-sm">{teacherErrors.email}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="CPF"
                    value={teacherForm.cpf}
                    onChange={(e) => handleTeacherChange('cpf', e.target.value)}
                  />
                  {teacherErrors.cpf && (
                    <p className="text-red-500 text-sm">{teacherErrors.cpf}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    placeholder="Registro profissional"
                    value={teacherForm.registro}
                    onChange={(e) => handleTeacherChange('registro', e.target.value)}
                  />
                  {teacherErrors.registro && (
                    <p className="text-red-500 text-sm">{teacherErrors.registro}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Input
                  placeholder="Área de especialização"
                  value={teacherForm.especializacao}
                  onChange={(e) => handleTeacherChange('especializacao', e.target.value)}
                />
                {teacherErrors.especializacao && (
                  <p className="text-red-500 text-sm">{teacherErrors.especializacao}</p>
                )}
              </div>
              
              <div>
                <Input
                  placeholder="Formação"
                  value={teacherForm.formacao}
                  onChange={(e) => handleTeacherChange('formacao', e.target.value)}
                />
                {teacherErrors.formacao && (
                  <p className="text-red-500 text-sm">{teacherErrors.formacao}</p>
                )}
              </div>
              
              <div>
                <Input
                  placeholder="Telefone"
                  value={teacherForm.telefone}
                  onChange={(e) => handleTeacherChange('telefone', e.target.value)}
                />
                {teacherErrors.telefone && (
                  <p className="text-red-500 text-sm">{teacherErrors.telefone}</p>
                )}
              </div>
              
              <div>
                <Input
                  placeholder="Senha"
                  type="password"
                  value={teacherForm.password}
                  onChange={(e) => handleTeacherChange('password', e.target.value)}
                />
                {teacherErrors.password && (
                  <p className="text-red-500 text-sm">{teacherErrors.password}</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleAddTeacher}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;