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
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox" // For export dialog later
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
  Pie,
  Cell,
  Legend,
  Bar,
} from 'recharts';
import { PieChart as PieIcon, BarChart2 as BarIcon } from 'lucide-react'; // Renamed to avoid conflict with Recharts components
import { parseISO, format, isWithinInterval, isAfter, isBefore, getDay } from 'date-fns';
// import { ptBR } from 'date-fns/locale'; // Optional: for Portuguese weekday names
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar'; // Import AdminSidebar
import { StoredUser, ActivityLogEntry, Filters, LOCAL_STORAGE_KEYS } from '@/types/admin';
import { applyFilters, sortList, paginate } from '@/lib/utils';

// Define a more specific type for NewUsersChartData if possible, for now, ChartPoint can be reused or adapted.
interface ChartPoint { // This existing interface can be used for newUsersChartData
  month: string;
  alunos: number;
  professores: number;
}

const AdminDashboard = () => {
  // Raw Data States
  const [rawStudents, setRawStudents] = useState<StoredUser[]>([]);
  const [rawTeachers, setRawTeachers] = useState<StoredUser[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  // Filter State
  const [activeFilters, setActiveFilters] = useState<Filters>({});

  // Derived Data States
  const [filteredStudents, setFilteredStudents] = useState<StoredUser[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<StoredUser[]>([]);

  // Sort Config States
  const [sortConfigStudents, setSortConfigStudents] = useState<{ key: keyof StoredUser; direction: 'ascending' | 'descending' } | null>(null);
  const [sortConfigTeachers, setSortConfigTeachers] = useState<{ key: keyof StoredUser; direction: 'ascending' | 'descending' } | null>(null);

  // Pagination States
  const [paginationStudents, setPaginationStudents] = useState<{ currentPage: number; itemsPerPage: number }>({ currentPage: 1, itemsPerPage: 10 });
  const [paginationTeachers, setPaginationTeachers] = useState<{ currentPage: number; itemsPerPage: number }>({ currentPage: 1, itemsPerPage: 10 });

  // Confirmation Dialog State for Deletion
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'student' | 'teacher' } | null>(null);

  // CSV Export Dialog State
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportConfig, setExportConfig] = useState<{ type: 'alunos' | 'professors'; selectedFields: (keyof StoredUser)[] } | null>(null);
  const [tempSelectedFields, setTempSelectedFields] = useState<(keyof StoredUser)[]>([]);

  // Chart Data States
  const [newUsersChartData, setNewUsersChartData] = useState<ChartPoint[]>([]);
  const [userTypeDistributionData, setUserTypeDistributionData] = useState<any[]>([]); // Define specific type later
  const [weeklyActivityData, setWeeklyActivityData] = useState<any[]>([]); // Define specific type later

  // Available courses for sidebar filter
  const availableCourses = ["Desenvolvimento de Sistemas", "Administração", "Contabilidade", "Marketing", "Recursos Humanos"];


  // Dialog visibility and form states (existing)
  const [showStudentDialog, setShowStudentDialog] = useState(false)
  const [showTeacherDialog, setShowTeacherDialog] = useState(false)
  const [showEditStudentDialog, setShowEditStudentDialog] = useState(false)
  const [showEditTeacherDialog, setShowEditTeacherDialog] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StoredUser | null>(null)
  const [editingTeacher, setEditingTeacher] = useState<StoredUser | null>(null)
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

  const { register } = useAuth()

  const handleSort = (listType: 'students' | 'teachers', key: keyof StoredUser) => {
    const currentConfig = listType === 'students' ? sortConfigStudents : sortConfigTeachers;
    const setConfig = listType === 'students' ? setSortConfigStudents : setSortConfigTeachers;
    let direction: 'ascending' | 'descending' = 'ascending';
    if (currentConfig && currentConfig.key === key && currentConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setConfig({ key, direction });
  };

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
    const alunoData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ALUNOS) || '[]');
    const professorData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.PROFESSORS) || '[]');
    const logData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVITY_LOG) || '[]');

    setRawStudents(alunoData);
    setRawTeachers(professorData);
    setActivityLog(logData);
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

  const handleDeleteInitiation = (id: string, type: 'student' | 'teacher') => {
    setItemToDelete({ id, type });
    setShowDeleteConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'student') {
      const updated = rawStudents.filter((s) => s.id !== itemToDelete.id);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ALUNOS, JSON.stringify(updated));
    } else {
      const updated = rawTeachers.filter((t) => t.id !== itemToDelete.id);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROFESSORS, JSON.stringify(updated));
    }
    refreshData();
    setShowDeleteConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleUpdateStudent = () => {
    if (!editingStudent || !validateEditStudentForm(editStudentForm)) return
    const updatedStudents = rawStudents.map((s) =>
      s.id === editingStudent.id
        ? {
            ...s,
            ...editStudentForm,
            // Ensure all StoredUser fields are preserved or updated correctly
            // For example, passwordHash, salt, createdAt, type should not be lost
            // if editStudentForm doesn't include them.
            // Here, we assume editStudentForm only contains editable fields.
            // So, we spread 's' first to keep non-editable fields.
          }
        : s
    );
    // setRawStudents(updatedStudents); // This will be updated by refreshData
    localStorage.setItem(LOCAL_STORAGE_KEYS.ALUNOS, JSON.stringify(updatedStudents));
    setShowEditStudentDialog(false);
    refreshData(); // Refresh raw data
  }

  const handleUpdateTeacher = () => {
    if (!editingTeacher || !validateEditTeacherForm(editTeacherForm)) return
    const updatedTeachers = rawTeachers.map((t) =>
      t.id === editingTeacher.id
        ? {
            ...t,
            ...editTeacherForm,
            // Similar to handleUpdateStudent, ensure all StoredUser fields are preserved.
          }
        : t
    );
    // setRawTeachers(updatedTeachers); // This will be updated by refreshData
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROFESSORS, JSON.stringify(updatedTeachers));
    setShowEditTeacherDialog(false);
    refreshData(); // Refresh raw data
  }

  const handleExportInitiation = (type: 'alunos' | 'professors') => {
    const defaultFields: (keyof StoredUser)[] = ['name', 'email', 'createdAt'];
    if (type === 'alunos') {
      defaultFields.push('ra', 'curso', 'semestre');
    } else {
      defaultFields.push('cpf', 'especializacao', 'formacao');
    }
    setExportConfig({ type, selectedFields: defaultFields });
    setTempSelectedFields(defaultFields);
    setShowExportDialog(true);
  };

  const handleFieldSelectionChange = (field: keyof StoredUser, checked: boolean) => {
    setTempSelectedFields(prev =>
      checked ? [...prev, field] : prev.filter(f => f !== field)
    );
  };

  const confirmExport = () => {
    if (!exportConfig) return;
    exportSelectedCSV(exportConfig.type, tempSelectedFields);
    setShowExportDialog(false);
    setExportConfig(null); // Clear the export config
  };

  const exportSelectedCSV = (type: 'alunos' | 'professors', selectedFields: (keyof StoredUser)[]) => {
    const data = type === 'alunos' ? filteredStudents : filteredTeachers;
    if (selectedFields.length === 0) {
      alert("Nenhum campo selecionado para exportação.");
      return;
    }

    const headerRow = selectedFields.join(',') + '\n';
    const dataRows = data.map(user => {
      return selectedFields.map(field => {
        const value = user[field];
        if (value == null) return '';
        let stringValue = String(value);
        // Escape quotes by doubling them, and wrap in quotes if it contains comma, newline or quote
        if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
          stringValue = `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    }).join('\n');

    const csv = headerRow + dataRows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Initial data load from localStorage
  useEffect(() => {
    refreshData();
  }, []);

  // Effect for calculating newUsersChartData
  useEffect(() => {
    const counts: Record<string, ChartPoint> = {};
    let chartStudents = rawStudents;
    let chartTeachers = rawTeachers;

    // Apply userType filter
    if (activeFilters.userType === 'aluno') {
      chartTeachers = [];
    } else if (activeFilters.userType === 'professor') {
      chartStudents = [];
    }

    // Apply date range filter
    const { startDate, endDate } = activeFilters;
    const filterByDate = (user: StoredUser) => {
      if (!user.createdAt) return false;
      try {
        const createdAtDate = parseISO(user.createdAt);
        if (startDate && endDate) return isWithinInterval(createdAtDate, { start: parseISO(startDate), end: parseISO(endDate) });
        if (startDate) return isAfter(createdAtDate, parseISO(startDate)) || createdAtDate.toISOString().slice(0,10) === startDate;
        if (endDate) return isBefore(createdAtDate, parseISO(endDate)) || createdAtDate.toISOString().slice(0,10) === endDate;
      } catch (e) { return false; }
      return true;
    };

    if (startDate || endDate) {
      chartStudents = chartStudents.filter(filterByDate);
      chartTeachers = chartTeachers.filter(filterByDate);
    }

    chartStudents.forEach((u: StoredUser) => {
      const m = format(parseISO(u.createdAt), 'yyyy-MM');
      if (!counts[m]) counts[m] = { month: m, alunos: 0, professores: 0 };
      counts[m].alunos += 1;
    });
    chartTeachers.forEach((u: StoredUser) => {
      const m = format(parseISO(u.createdAt), 'yyyy-MM');
      if (!counts[m]) counts[m] = { month: m, alunos: 0, professores: 0 };
      counts[m].professores += 1;
    });
    const data = Object.values(counts).sort((a, b) => a.month.localeCompare(b.month));
    setNewUsersChartData(data);
  }, [rawStudents, rawTeachers, activeFilters]);

  // useEffect for userTypeDistributionData (Pie Chart)
  useEffect(() => {
    let studentCount = filteredStudents.length;
    let teacherCount = filteredTeachers.length;

    if (activeFilters.userType === 'aluno') {
        teacherCount = 0; // Only show students if filter is 'aluno'
    } else if (activeFilters.userType === 'professor') {
        studentCount = 0; // Only show teachers if filter is 'professor'
    }

    const data = [];
    if (studentCount > 0) data.push({ name: 'Alunos', value: studentCount, fill: '#3b82f6' });
    if (teacherCount > 0) data.push({ name: 'Professores', value: teacherCount, fill: '#8b5cf6' });

    setUserTypeDistributionData(data);
  }, [filteredStudents, filteredTeachers, activeFilters.userType]);

  // useEffect for weeklyActivityData (Bar Chart)
  useEffect(() => {
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']; // Sunday is 0
    const loginCounts: Record<string, number> = dayNames.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});

    let logsToProcess = activityLog;

    // Filter by userType
    if (activeFilters.userType) {
      logsToProcess = logsToProcess.filter(log => log.userType === activeFilters.userType);
    }
    // Filter by date range
    const { startDate, endDate } = activeFilters;
     if (startDate || endDate) {
        logsToProcess = logsToProcess.filter(log => {
            if (!log.timestamp) return false;
            try {
                const logDate = parseISO(log.timestamp);
                if (startDate && endDate) return isWithinInterval(logDate, { start: parseISO(startDate), end: parseISO(endDate) });
                if (startDate) return isAfter(logDate, parseISO(startDate)) || logDate.toISOString().slice(0,10) === startDate;
                if (endDate) return isBefore(logDate, parseISO(endDate)) || logDate.toISOString().slice(0,10) === endDate;
            } catch(e) { return false; }
            return true;
        });
    }

    logsToProcess.filter(log => log.actionType === 'login').forEach(log => {
      try {
        const dayIndex = getDay(parseISO(log.timestamp));
        const dayName = dayNames[dayIndex];
        if (dayName) { // Check if dayName is valid
            loginCounts[dayName] = (loginCounts[dayName] || 0) + 1;
        }
      } catch(e) {
        console.error("Error processing log timestamp for weekly activity:", log.timestamp, e);
      }
    });

    const data = dayNames.map(day => ({ day, logins: loginCounts[day] || 0 }));
    setWeeklyActivityData(data);
  }, [activityLog, activeFilters]);

  // Placeholder useEffect for filtering and sorting students
  useEffect(() => {
    let processedStudents = [...rawStudents];
    processedStudents = applyFilters(processedStudents, activeFilters);
    processedStudents = sortList(processedStudents, sortConfigStudents);
    // Pagination will be applied directly when rendering the table data slice
    setFilteredStudents(processedStudents);
  }, [rawStudents, activeFilters, sortConfigStudents]);

  // Placeholder useEffect for filtering and sorting teachers
  useEffect(() => {
    let processedTeachers = [...rawTeachers];
    processedTeachers = applyFilters(processedTeachers, activeFilters);
    processedTeachers = sortList(processedTeachers, sortConfigTeachers);
    // Pagination will be applied directly when rendering the table data slice
    setFilteredTeachers(processedTeachers);
  }, [rawTeachers, activeFilters, sortConfigTeachers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <AdminSidebar
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        allCourses={availableCourses}
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
                {/* Display counts from filtered (or raw, if filtering not fully implemented yet) data */}
                <div className="text-3xl font-bold text-blue-600">{filteredStudents.length}</div>
                <div className="text-sm text-slate-600">Alunos cadastrados</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-3xl font-bold text-purple-600">{filteredTeachers.length}</div>
                <div className="text-sm text-slate-600">Professores cadastrados</div>
              </div>
            </div>

            {newUsersChartData.length > 0 && (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {/* Chart now uses newUsersChartData */}
                  <LineChart data={newUsersChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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

        {/* Placeholder Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <PieIcon size={22} className="mr-2 text-blue-500" />
                Usuários por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              {userTypeDistributionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={userTypeDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {userTypeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500">Nenhum dado para exibir.</p>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BarIcon size={22} className="mr-2 text-purple-500" />
                Atividade Semanal (Logins)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="logins" fill="#8b5cf6" name="Logins" />
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
              <Button size="sm" onClick={() => setShowStudentDialog(true)}>Adicionar</Button>
              <Button size="sm" variant="outline" onClick={() => handleExportInitiation('alunos')}>Exportar</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('students', 'name')} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      Nome {sortConfigStudents?.key === 'name' && (sortConfigStudents.direction === 'ascending' ? '🔼' : '🔽')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('students', 'email')} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      Email {sortConfigStudents?.key === 'email' && (sortConfigStudents.direction === 'ascending' ? '🔼' : '🔽')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('students', 'ra')} className="hidden sm:table-cell cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      RA {sortConfigStudents?.key === 'ra' && (sortConfigStudents.direction === 'ascending' ? '🔼' : '🔽')}
                    </TableHead>
                     <TableHead onClick={() => handleSort('students', 'curso')} className="hidden md:table-cell cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      Curso {sortConfigStudents?.key === 'curso' && (sortConfigStudents.direction === 'ascending' ? '🔼' : '🔽')}
                    </TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredStudents, paginationStudents).map((s: StoredUser) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{s.email}</TableCell>
                      <TableCell className="hidden sm:table-cell">{s.ra}</TableCell>
                      <TableCell className="hidden md:table-cell">{s.curso}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingStudent(s);
                          setEditStudentForm({ name: s.name, email: s.email, ra: s.ra || '', curso: s.curso || '', semestre: s.semestre || '', telefone: s.telefone || '' });
                          setShowEditStudentDialog(true);
                        }}>Editar</Button>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteInitiation(s.id, 'student')}>Remover</Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Pagination Controls for Students */}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginationStudents(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                disabled={paginationStudents.currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-700">
                Página {paginationStudents.currentPage} de {Math.ceil(filteredStudents.length / paginationStudents.itemsPerPage) || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginationStudents(prev => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, Math.ceil(filteredStudents.length / prev.itemsPerPage) || 1) }))}
                disabled={paginationStudents.currentPage >= Math.ceil(filteredStudents.length / paginationStudents.itemsPerPage)}
              >
                Próxima
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Card */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <CardTitle>Professores</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button size="sm" onClick={() => setShowTeacherDialog(true)}>Adicionar</Button>
              <Button size="sm" variant="outline" onClick={() => handleExportInitiation('professors')}>Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('teachers', 'name')} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      Nome {sortConfigTeachers?.key === 'name' && (sortConfigTeachers.direction === 'ascending' ? '🔼' : '🔽')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('teachers', 'email')} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      Email {sortConfigTeachers?.key === 'email' && (sortConfigTeachers.direction === 'ascending' ? '🔼' : '🔽')}
                    </TableHead>
                    <TableHead onClick={() => handleSort('teachers', 'cpf')} className="hidden md:table-cell cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      CPF {sortConfigTeachers?.key === 'cpf' && (sortConfigTeachers.direction === 'ascending' ? '🔼' : '🔽')}
                    </TableHead>
                     <TableHead onClick={() => handleSort('teachers', 'especializacao')} className="hidden lg:table-cell cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                      Especialização {sortConfigTeachers?.key === 'especializacao' && (sortConfigTeachers.direction === 'ascending' ? '🔼' : '🔽')}
                    </TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginate(filteredTeachers, paginationTeachers).map((t: StoredUser) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="truncate max-w-[150px]">{t.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{t.cpf}</TableCell>
                      <TableCell className="hidden lg:table-cell">{t.especializacao}</TableCell>
                      <TableCell className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingTeacher(t);
                          setEditTeacherForm({ name: t.name, email: t.email, cpf: t.cpf || '', especializacao: t.especializacao || '', formacao: t.formacao || '', telefone: t.telefone || '', registro: t.registro || '' });
                          setShowEditTeacherDialog(true);
                        }}>Editar</Button>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteInitiation(t.id, 'teacher')}>Remover</Button>
                        </AlertDialogTrigger>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Pagination Controls for Teachers */}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginationTeachers(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                disabled={paginationTeachers.currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-700">
                Página {paginationTeachers.currentPage} de {Math.ceil(filteredTeachers.length / paginationTeachers.itemsPerPage) || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginationTeachers(prev => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, Math.ceil(filteredTeachers.length / prev.itemsPerPage) || 1) }))}
                disabled={paginationTeachers.currentPage >= Math.ceil(filteredTeachers.length / paginationTeachers.itemsPerPage)}
              >
                Próxima
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover este {itemToDelete?.type === 'student' ? 'aluno' : 'professor'}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Export CSV Dialog */}
        <Dialog open={showExportDialog} onOpenChange={(isOpen) => {
          setShowExportDialog(isOpen);
          if (!isOpen) setExportConfig(null); // Reset config when dialog closes
        }}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Configurar Exportação CSV</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>Selecione os campos para exportar para {exportConfig?.type === 'alunos' ? 'Alunos' : 'Professores'}:</p>
              {(Object.keys(
                  (exportConfig?.type === 'alunos' ? (rawStudents[0] || {}) : (rawTeachers[0] || {}))
                ) as (keyof StoredUser)[])
                .filter(key => key !== 'passwordHash' && key !== 'salt') // Exclude sensitive fields
                .map(field => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`export-${field}`}
                    checked={tempSelectedFields.includes(field)}
                    onCheckedChange={(checked) => handleFieldSelectionChange(field, !!checked)}
                  />
                  <label htmlFor={`export-${field}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {field}
                  </label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {setShowExportDialog(false); setExportConfig(null);}}>Cancelar</Button>
              <Button onClick={confirmExport}>Confirmar Exportação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Feature Cards - Responsive Grid, Dialogs for Add/Edit User */}
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

        {/* Dialogs for Add/Edit User - Existing Dialog components are here, their content is omitted for brevity in this diff */}
        <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>{/* ... student add form ... */}</Dialog>
        <Dialog open={showEditStudentDialog} onOpenChange={setShowEditStudentDialog}>{/* ... student edit form ... */}</Dialog>
        <Dialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog}>{/* ... teacher add form ... */}</Dialog>
        <Dialog open={showEditTeacherDialog} onOpenChange={setShowEditTeacherDialog}>{/* ... teacher edit form ... */}</Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover este {itemToDelete?.type === 'student' ? 'aluno' : 'professor'}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Export CSV Dialog */}
        <Dialog open={showExportDialog} onOpenChange={(isOpen) => {
          setShowExportDialog(isOpen);
          if (!isOpen) setExportConfig(null); // Reset config when dialog closes
        }}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Configurar Exportação CSV</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>Selecione os campos para exportar para {exportConfig?.type === 'alunos' ? 'Alunos' : 'Professores'}:</p>
              {(Object.keys(
                  (exportConfig?.type === 'alunos' ? (rawStudents[0] || {}) : (rawTeachers[0] || {}))
                ) as (keyof StoredUser)[])
                .filter(key => key !== 'passwordHash' && key !== 'salt') // Exclude sensitive fields
                .map(field => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`export-${field}`}
                    checked={tempSelectedFields.includes(field)}
                    onCheckedChange={(checked) => handleFieldSelectionChange(field, !!checked)}
                  />
                  <label htmlFor={`export-${field}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {field}
                  </label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {setShowExportDialog(false); setExportConfig(null);}}>Cancelar</Button>
              <Button onClick={confirmExport}>Confirmar Exportação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        </div> {/* Closing the main content's space-y-8 div */}
      </main>
    </div>
  );
};

export default AdminDashboard;