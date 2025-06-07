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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Filters, applyFilters, sortList, paginate, SortConfig } from '@/utils/dashboard';
import { getActivityLog, ActivityLogEntry } from '@/utils/activityLog';

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

interface PieSlice {
  name: string
  value: number
}

interface WeekData {
  weekday: string
  count: number
}

const AdminDashboard = () => {
  const [students, setStudents] = useState<SimpleUser[]>([]);
  const [teachers, setTeachers] = useState<SimpleUser[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<SimpleUser[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<SimpleUser[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [pieData, setPieData] = useState<PieSlice[]>([]);
  const [weekData, setWeekData] = useState<WeekData[]>([]);

  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [studentSort, setStudentSort] = useState<SortConfig<SimpleUser> | null>(null);
  const [teacherSort, setTeacherSort] = useState<SortConfig<SimpleUser> | null>(null);
  const [studentPage, setStudentPage] = useState(1);
  const [teacherPage, setTeacherPage] = useState(1);
  const perPage = 10;

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

    const counts: Record<string, ChartPoint> = {}
    ;[...fs, ...ft].forEach((u: SimpleUser) => {
      if (!u.createdAt) return
      const m = format(parseISO(u.createdAt), 'yyyy-MM')
      if (!counts[m]) counts[m] = { month: m, alunos: 0, professores: 0 }
      if (u.type === 'aluno') counts[m].alunos += 1
      else counts[m].professores += 1
    })
    const data = Object.values(counts).sort((a, b) => a.month.localeCompare(b.month))
    setChartData(data)

    setPieData([
      { name: 'Alunos', value: fs.length },
      { name: 'Professores', value: ft.length }
    ])

    const log = getActivityLog()
    const filteredLog = log.filter(l => {
      if (activeFilters.userType && l.userType !== activeFilters.userType) return false
      if (activeFilters.startDate && l.timestamp < activeFilters.startDate) return false
      if (activeFilters.endDate && l.timestamp > activeFilters.endDate) return false
      return true
    })
    const week: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    filteredLog.forEach(l => {
      const d = new Date(l.timestamp).getDay()
      week[d] = (week[d] || 0) + 1
    })
    const wd: WeekData[] = Object.keys(week).map(k => ({ weekday: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][parseInt(k)], count: week[parseInt(k)] }))
    setWeekData(wd)
  }, [students, teachers, activeFilters, studentSort, teacherSort])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <AdminSidebar
        filters={activeFilters}
        onChange={handleFilterChange}
        onApply={() => {}}
        onReset={resetFilters}
      />
      {/* Main content area - adjust padding/margin to account for fixed Nav and Sidebar */}
      <main className="flex-1 p-6 pt-20 ml-64 lg:ml-72 xl:ml-80 overflow-y-auto"> {/* Added ml classes matching sidebar widths, pt-20 for Nav */}
        {/* Removed max-w-7xl and mx-auto from here, should be on a higher level or applied differently if needed */}
        <div className="space-y-8"> {/* This div will now contain all the cards */}
          {/* Summary Card */}
          <Card>
            <CardHeader>
            <CardTitle>Resumo</CardTitle>
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <PieChartIcon size={22} className="mr-2 text-blue-500" />
                Usuários por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? '#3b82f6' : '#8b5cf6'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BarChart2 size={22} className="mr-2 text-purple-500" />
                Atividade Semanal
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData}>
                  <Bar dataKey="count" fill="#8b5cf6" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="weekday" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

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
            <div className="flex justify-end mt-2 space-x-2">
              <Button size="sm" variant="outline" onClick={() => setStudentPage(p => Math.max(1, p - 1))} disabled={studentPage === 1}>Anterior</Button>
              <span className="text-sm self-center">{studentPage} / {Math.max(1, Math.ceil(filteredStudents.length / perPage))}</span>
              <Button size="sm" variant="outline" onClick={() => setStudentPage(p => Math.min(Math.ceil(filteredStudents.length / perPage), p + 1))} disabled={studentPage >= Math.ceil(filteredStudents.length / perPage)}>Próximo</Button>
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
            <div className="flex justify-end mt-2 space-x-2">
              <Button size="sm" variant="outline" onClick={() => setTeacherPage(p => Math.max(1, p - 1))} disabled={teacherPage === 1}>Anterior</Button>
              <span className="text-sm self-center">{teacherPage} / {Math.max(1, Math.ceil(filteredTeachers.length / perPage))}</span>
              <Button size="sm" variant="outline" onClick={() => setTeacherPage(p => Math.min(Math.ceil(filteredTeachers.length / perPage), p + 1))} disabled={teacherPage >= Math.ceil(filteredTeachers.length / perPage)}>Próximo</Button>
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
        </div> {/* Closing the new space-y-8 div */}
      </main>
    </div>
  );
};

export default AdminDashboard;