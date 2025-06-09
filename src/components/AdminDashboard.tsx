import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import RegistrationHistoryChart from "./charts/RegistrationHistoryChart"
import StudentsTeachersPieChart from "./charts/StudentsTeachersPieChart"
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import AdminNav from './AdminNav';
import { Filters, applyFilters, sortList, paginate, SortConfig } from '@/utils/dashboard';

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

const AdminDashboard = () => {
  const [students, setStudents] = useState<SimpleUser[]>([]);
  const [teachers, setTeachers] = useState<SimpleUser[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<SimpleUser[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<SimpleUser[]>([]);

  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [studentSort, setStudentSort] = useState<SortConfig<SimpleUser> | null>(null);
  const [teacherSort, setTeacherSort] = useState<SortConfig<SimpleUser> | null>(null);
  const [studentPage, setStudentPage] = useState(1);
  const [teacherPage, setTeacherPage] = useState(1);
  const perPage = 10;

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleFilterChange = (f: Filters) => {
    setActiveFilters(f);
    setStudentPage(1);
    setTeacherPage(1);
  };

  const resetFilters = () => {
    handleFilterChange({});
  };

  const handleStudentSort = (key: keyof SimpleUser) => {
    setStudentSort(prev =>
      prev && prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const handleTeacherSort = (key: keyof SimpleUser) => {
    setTeacherSort(prev =>
      prev && prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const [showStudentDialog, setShowStudentDialog] = useState(false)
  const [showTeacherDialog, setShowTeacherDialog] = useState(false)
  const [showEditStudentDialog, setShowEditStudentDialog] = useState(false)
  const [showEditTeacherDialog, setShowEditTeacherDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmData, setConfirmData] = useState<{
    email: string
    password: string
    name: string
    type: 'aluno' | 'professor'
  } | null>(null)
  const [editingStudent, setEditingStudent] = useState<SimpleUser | null>(null)
  const [editingTeacher, setEditingTeacher] = useState<SimpleUser | null>(null)
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
  const [editStudentForm, setEditStudentForm] = useState({
    name: '',
    email: '',
    ra: '',
    curso: '',
    semestre: '',
    telefone: ''
  })
  const [editTeacherForm, setEditTeacherForm] = useState({
    name: '',
    email: '',
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

  const studentEditRules = {
    name: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    ra: { required: true, minLength: 5, maxLength: 20 },
    curso: { required: true },
    semestre: { required: true },
    telefone: { pattern: /^[0-9\s()+-]*$/ }
  }

  const teacherEditRules = {
    name: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
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

  const {
    errors: editStudentErrors,
    validateField: validateEditStudentField,
    validateForm: validateEditStudentForm,
    sanitizeInput: sanitizeEditStudentInput
  } = useFormValidation(studentEditRules)

  const {
    errors: editTeacherErrors,
    validateField: validateEditTeacherField,
    validateForm: validateEditTeacherForm,
    sanitizeInput: sanitizeEditTeacherInput
  } = useFormValidation(teacherEditRules)

  const { register, login } = useAuth()
  const navigate = useNavigate()

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

  const handleEditStudentChange = (field: string, value: string) => {
    let processed = value
    if (field === 'telefone') {
      processed = processed.replace(/[^0-9\s()+-]/g, '')
    }
    const sanitized = sanitizeEditStudentInput(processed, field === 'name' || field === 'telefone')
    setEditStudentForm(prev => ({ ...prev, [field]: sanitized }))
    validateEditStudentField(field, sanitized)
  }

  const handleEditTeacherChange = (field: string, value: string) => {
    let processed = value
    if (field === 'telefone') {
      processed = processed.replace(/[^0-9\s()+-]/g, '')
    }
    if (field === 'cpf') {
      processed = processed.replace(/\D/g, '').slice(0, 11)
    }
    const sanitized = sanitizeEditTeacherInput(processed, ['name', 'formacao', 'especializacao', 'telefone'].includes(field))
    setEditTeacherForm(prev => ({ ...prev, [field]: sanitized }))
    validateEditTeacherField(field, sanitized)
  }

  const refreshData = () => {
    const alunoData = JSON.parse(localStorage.getItem('@DevVenture:alunos') || '[]')
    const professorData = JSON.parse(localStorage.getItem('@DevVenture:professors') || '[]')
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
      },
      false
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
      setConfirmData({
        email: studentForm.email,
        password: studentForm.password,
        name: studentForm.name,
        type: 'aluno'
      })
      setShowConfirmDialog(true)
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
      },
      false
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
      setConfirmData({
        email: teacherForm.email,
        password: teacherForm.password,
        name: teacherForm.name,
        type: 'professor'
      })
      setShowConfirmDialog(true)
    } else {
      alert(result.error || 'Erro ao cadastrar professor')
    }
  }

  const deleteStudent = (id: string) => {
    if (!window.confirm('Remover este aluno?')) return
    const updated = students.filter((s) => s.id !== id)
    setStudents(updated)
    localStorage.setItem('@DevVenture:alunos', JSON.stringify(updated))
  }

  const deleteTeacher = (id: string) => {
    if (!window.confirm('Remover este professor?')) return
    const updated = teachers.filter((t) => t.id !== id)
    setTeachers(updated)
    localStorage.setItem('@DevVenture:professors', JSON.stringify(updated))
  }

  const confirmEnter = async () => {
    if (!confirmData) return
    await login(confirmData.email, confirmData.password, confirmData.type)
    setShowConfirmDialog(false)
    navigate(confirmData.type === 'professor' ? '/professor' : '/aluno')
  }

  const handleUpdateStudent = () => {
    if (!editingStudent || !validateEditStudentForm(editStudentForm)) return
    const updated = students.map((s) =>
      s.id === editingStudent.id ? { ...s, ...editStudentForm } : s
    )
    setStudents(updated)
    localStorage.setItem('@DevVenture:alunos', JSON.stringify(updated))
    setShowEditStudentDialog(false)
  }

  const handleUpdateTeacher = () => {
    if (!editingTeacher || !validateEditTeacherForm(editTeacherForm)) return
    const updated = teachers.map((t) =>
      t.id === editingTeacher.id ? { ...t, ...editTeacherForm } : t
    )
    setTeachers(updated)
    localStorage.setItem('@DevVenture:professors', JSON.stringify(updated))
    setShowEditTeacherDialog(false)
  }

  const exportCSV = (type: 'alunos' | 'professors') => {
    const data = type === 'alunos' ? students : teachers
    const input = prompt('Quais campos exportar? (separados por vírgula)', 'name,email')
    if (!input) return
    const fields = input.split(',').map(f => f.trim()).filter(Boolean) as (keyof SimpleUser)[]
    const header = fields.join(',')
    const rows = data.map(u => fields.map(f => String((u as Record<keyof SimpleUser, unknown>)[f] ?? '')).join(',')).join('\n')
    const csv = header + '\n' + rows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const alunoData = JSON.parse(localStorage.getItem('@DevVenture:alunos') || '[]')
    const professorData = JSON.parse(localStorage.getItem('@DevVenture:professors') || '[]')
    setStudents(alunoData)
    setTeachers(professorData)
  }, [])

  useEffect(() => {
    const fs = applyFilters(students, activeFilters)
    const ft = applyFilters(teachers, activeFilters)
    setFilteredStudents(sortList(fs, studentSort))
    setFilteredTeachers(sortList(ft, teacherSort))




  }, [students, teachers, activeFilters, studentSort, teacherSort])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <AdminNav />
      <AdminSidebar
        filters={activeFilters}
        onChange={handleFilterChange}
        onApply={() => {}}
        onReset={resetFilters}
        isMobileOpen={isMobileSidebarOpen}
        toggleMobile={toggleMobileSidebar}
      />
      <main
        className={`flex-1 p-4 pt-20 md:p-6 md:pt-20 overflow-y-auto lg:ml-56 ${
          !isMobile && isMobileSidebarOpen ? 'md:ml-[30rem] lg:ml-[32rem] xl:ml-[34rem]' : ''
        }`}
      >
        {isMobile && !isMobileSidebarOpen && (
          <Button
            className="fixed top-20 left-4 z-30"
            variant="outline"
            size="icon"
            onClick={toggleMobileSidebar}
          >
            <Filter size={20} />
          </Button>
        )}
        <div className="space-y-6">
        {/* Summary Card */}
        <Card id="overview">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resumo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0">
              <div className="text-center flex-1">
                <div className="text-3xl font-bold text-blue-600">{filteredStudents.length}</div>
                <div className="text-sm text-slate-600">Alunos cadastrados</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-3xl font-bold text-purple-600">{filteredTeachers.length}</div>
                <div className="text-sm text-slate-600">Professores cadastrados</div>
              </div>
            </div>
            <div id="charts" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card text-card-foreground rounded-lg p-4 shadow space-y-2">
                  <RegistrationHistoryChart students={students} teachers={teachers} />
                  <p className="text-sm text-muted-foreground text-center">Cadastros de alunos e professores ao longo do tempo.</p>
                </div>
                <div className="bg-card text-card-foreground rounded-lg p-4 shadow space-y-2">
                  <StudentsTeachersPieChart
                    students={filteredStudents.length}
                    teachers={filteredTeachers.length}
                  />
                  <p className="text-sm text-muted-foreground text-center">Distribuição atual entre alunos e professores cadastrados.</p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Students Card */}
        <Card id="students">
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
                    <TableHead onClick={() => handleStudentSort('name')} className="cursor-pointer">Nome</TableHead>
                    <TableHead onClick={() => handleStudentSort('email')} className="cursor-pointer">Email</TableHead>
                    <TableHead onClick={() => handleStudentSort('ra')} className="hidden sm:table-cell cursor-pointer">RA</TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredStudents, studentPage, perPage).map((s: SimpleUser) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{s.email}</TableCell>
                      <TableCell className="hidden sm:table-cell">{s.ra}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingStudent(s)
                            setEditStudentForm({
                              name: s.name,
                              email: s.email,
                              ra: s.ra || '',
                              curso: s.curso || '',
                              semestre: s.semestre || '',
                              telefone: s.telefone || ''
                            })
                            setShowEditStudentDialog(true)
                          }}
                        >
                          Editar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteStudent(s.id)}>
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
              <span className="text-sm text-slate-600">
                {filteredStudents.length} alunos
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStudentPage(p => Math.max(1, p - 1))}
                  disabled={studentPage === 1}
                >
                  <ChevronLeft size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                <span className="text-sm">
                  {studentPage}/{Math.max(1, Math.ceil(filteredStudents.length / perPage))}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStudentPage(p => Math.min(Math.ceil(filteredStudents.length / perPage), p + 1))}
                  disabled={studentPage >= Math.ceil(filteredStudents.length / perPage)}
                >
                  <span className="hidden sm:inline">Próximo</span>
                  <ChevronRight size={16} className="ml-1 sm:ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Card */}
        <Card id="teachers">
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
                    <TableHead onClick={() => handleTeacherSort('name')} className="cursor-pointer">Nome</TableHead>
                    <TableHead onClick={() => handleTeacherSort('email')} className="cursor-pointer">Email</TableHead>
                    <TableHead onClick={() => handleTeacherSort('cpf')} className="hidden md:table-cell cursor-pointer">CPF</TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredTeachers, teacherPage, perPage).map((t: SimpleUser) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{t.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{t.cpf}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingTeacher(t)
                            setEditTeacherForm({
                              name: t.name,
                              email: t.email,
                              cpf: t.cpf || '',
                              especializacao: t.especializacao || '',
                              formacao: t.formacao || '',
                              telefone: t.telefone || '',
                              registro: t.registro || ''
                            })
                            setShowEditTeacherDialog(true)
                          }}
                        >
                          Editar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteTeacher(t.id)}>
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
              <span className="text-sm text-slate-600">
                {filteredTeachers.length} professores
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTeacherPage(p => Math.max(1, p - 1))}
                  disabled={teacherPage === 1}
                >
                  <ChevronLeft size={16} className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                <span className="text-sm">
                  {teacherPage}/{Math.max(1, Math.ceil(filteredTeachers.length / perPage))}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTeacherPage(p => Math.min(Math.ceil(filteredTeachers.length / perPage), p + 1))}
                  disabled={teacherPage >= Math.ceil(filteredTeachers.length / perPage)}
                >
                  <span className="hidden sm:inline">Próximo</span>
                  <ChevronRight size={16} className="ml-1 sm:ml-2" />
                </Button>
              </div>
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
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Sistema Responsivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Este dashboard agora se adapta perfeitamente a dispositivos móveis, tablets e desktops.
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

        <Dialog open={showEditStudentDialog} onOpenChange={setShowEditStudentDialog}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Aluno</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Nome"
                  value={editStudentForm.name}
                  onChange={(e) => handleEditStudentChange('name', e.target.value)}
                />
                {editStudentErrors.name && (
                  <p className="text-red-500 text-sm">{editStudentErrors.name}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={editStudentForm.email}
                  onChange={(e) => handleEditStudentChange('email', e.target.value)}
                />
                {editStudentErrors.email && (
                  <p className="text-red-500 text-sm">{editStudentErrors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="RA"
                    value={editStudentForm.ra}
                    onChange={(e) => handleEditStudentChange('ra', e.target.value)}
                  />
                  {editStudentErrors.ra && (
                    <p className="text-red-500 text-sm">{editStudentErrors.ra}</p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Curso"
                    value={editStudentForm.curso}
                    onChange={(e) => handleEditStudentChange('curso', e.target.value)}
                  />
                  {editStudentErrors.curso && (
                    <p className="text-red-500 text-sm">{editStudentErrors.curso}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Semestre"
                    value={editStudentForm.semestre}
                    onChange={(e) => handleEditStudentChange('semestre', e.target.value)}
                  />
                  {editStudentErrors.semestre && (
                    <p className="text-red-500 text-sm">{editStudentErrors.semestre}</p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Telefone"
                    value={editStudentForm.telefone}
                    onChange={(e) => handleEditStudentChange('telefone', e.target.value)}
                  />
                  {editStudentErrors.telefone && (
                    <p className="text-red-500 text-sm">{editStudentErrors.telefone}</p>
                  )}
                </div>
              </div>

              {editingStudent?.createdAt && (
                <p className="text-sm text-slate-600">Cadastrado em {format(parseISO(editingStudent.createdAt), 'dd/MM/yyyy')}</p>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleUpdateStudent}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditTeacherDialog} onOpenChange={setShowEditTeacherDialog}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Professor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Nome"
                  value={editTeacherForm.name}
                  onChange={(e) => handleEditTeacherChange('name', e.target.value)}
                />
                {editTeacherErrors.name && (
                  <p className="text-red-500 text-sm">{editTeacherErrors.name}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  value={editTeacherForm.email}
                  onChange={(e) => handleEditTeacherChange('email', e.target.value)}
                />
                {editTeacherErrors.email && (
                  <p className="text-red-500 text-sm">{editTeacherErrors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="CPF"
                    value={editTeacherForm.cpf}
                    onChange={(e) => handleEditTeacherChange('cpf', e.target.value)}
                  />
                  {editTeacherErrors.cpf && (
                    <p className="text-red-500 text-sm">{editTeacherErrors.cpf}</p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Registro profissional"
                    value={editTeacherForm.registro}
                    onChange={(e) => handleEditTeacherChange('registro', e.target.value)}
                  />
                  {editTeacherErrors.registro && (
                    <p className="text-red-500 text-sm">{editTeacherErrors.registro}</p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  placeholder="Área de especialização"
                  value={editTeacherForm.especializacao}
                  onChange={(e) => handleEditTeacherChange('especializacao', e.target.value)}
                />
                {editTeacherErrors.especializacao && (
                  <p className="text-red-500 text-sm">{editTeacherErrors.especializacao}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Formação"
                  value={editTeacherForm.formacao}
                  onChange={(e) => handleEditTeacherChange('formacao', e.target.value)}
                />
                {editTeacherErrors.formacao && (
                  <p className="text-red-500 text-sm">{editTeacherErrors.formacao}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Telefone"
                  value={editTeacherForm.telefone}
                  onChange={(e) => handleEditTeacherChange('telefone', e.target.value)}
                />
                {editTeacherErrors.telefone && (
                  <p className="text-red-500 text-sm">{editTeacherErrors.telefone}</p>
                )}
              </div>

              {editingTeacher?.createdAt && (
                <p className="text-sm text-slate-600">Cadastrado em {format(parseISO(editingTeacher.createdAt), 'dd/MM/yyyy')}</p>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleUpdateTeacher}>Salvar</Button>
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

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Deseja entrar como {confirmData?.name}?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button onClick={confirmEnter}>Entrar</Button>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Permanecer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
