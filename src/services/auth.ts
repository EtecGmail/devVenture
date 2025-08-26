import { api } from './api';

interface BasicUser {
  id: string;
  name: string;
  email: string;
}

export interface Student extends BasicUser {
  ra?: string;
  curso?: string;
  semestre?: string;
  telefone?: string;
}

export interface Teacher extends BasicUser {
  cpf?: string;
  especializacao?: string;
  formacao?: string;
  telefone?: string;
  registro_profissional?: string;
}

export type Admin = BasicUser;

interface LoginResponse<T> {
  message: string;
  [key: string]: unknown;
  aluno?: Student;
  professor?: Teacher;
  adm?: Admin;
}

export const loginAluno = async (email: string, password: string): Promise<Student> => {
  const { data } = await api.post<LoginResponse<Student>>('/loginAluno', { email, password });
  return data.aluno as Student;
};

export const loginProfessor = async (email: string, password: string): Promise<Teacher> => {
  const { data } = await api.post<LoginResponse<Teacher>>('/loginProfessor', { email, password });
  return data.professor ?? (data as unknown as Teacher);
};

export const loginAdmin = async (email: string, password: string): Promise<Admin> => {
  const { data } = await api.post<LoginResponse<Admin>>('/loginAdmin', { email, password });
  return data.adm as Admin;
};

export interface StudentPayload {
  name: string;
  email: string;
  password: string;
  ra?: string;
  curso?: string;
  semestre?: string;
  telefone?: string;
}

export interface TeacherPayload {
  name: string;
  email: string;
  password: string;
  cpf: string;
  especializacao: string;
  formacao: string;
  telefone?: string;
  registro: string;
}

export interface AdminPayload {
  name: string;
  email: string;
  password: string;
}

export const registerStudent = async (payload: StudentPayload): Promise<Student> => {
  const { data } = await api.post<Student>('/aluno', payload);
  const alunos: Student[] = JSON.parse(localStorage.getItem('@DevVenture:alunos') || '[]');
  alunos.push(data);
  localStorage.setItem('@DevVenture:alunos', JSON.stringify(alunos));
  return data;
};

export const registerTeacher = async (payload: TeacherPayload): Promise<Teacher> => {
  const body = { ...payload, registro_profissional: payload.registro };
  delete (body as { registro?: string }).registro;
  const { data } = await api.post<Teacher | { professor: Teacher }>('/cadastroProfessor', body);
  const teachers: Teacher[] = JSON.parse(localStorage.getItem('@DevVenture:professors') || '[]');
  const professor = (data as { professor?: Teacher }).professor ?? (data as Teacher);
  teachers.push(professor);
  localStorage.setItem('@DevVenture:professors', JSON.stringify(teachers));
  return professor;
};

export const registerAdmin = async (payload: AdminPayload): Promise<Admin> => {
  const { data } = await api.post<Admin | { adm: Admin }>('/cadastroAdm', payload);
  return (data as { adm?: Admin }).adm ?? (data as Admin);
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem('dv:user');
  return stored ? (JSON.parse(stored) as BasicUser) : null;
};

export const logout = () => {
  localStorage.removeItem('dv:user');
  localStorage.removeItem('dv:token');
};
