import React, { useState, useEffect } from 'react';
import { Filters } from '@/utils/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Filter, Users, BookOpen, CalendarDays, Search, X } from 'lucide-react';

interface AdminSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onApply: () => void;
  onReset: () => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  filters,
  onChange,
  onApply,
  onReset,
  isMobileOpen,
  toggleMobile,
}) => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobileOpen && !isLargeScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobile}
        />
      )}

      <Card
        className={`h-full w-64 lg:w-72 xl:w-80 bg-slate-800 border-slate-700 text-white fixed top-16 left-0 overflow-y-auto pt-4 z-40 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <CardHeader className="relative">
          <CardTitle className="flex items-center text-xl text-slate-100">
            <Filter size={24} className="mr-2 text-blue-400" />
            Filtros Avançados
          </CardTitle>
          <button
            className="absolute top-4 right-4 text-slate-300 hover:text-white"
            onClick={toggleMobile}
          >
            <X size={24} />
          </button>
        </CardHeader>
        <CardContent className="space-y-6 p-4">
        <Accordion type="multiple" defaultValue={['user-type', 'date-range']} className="w-full">
          <AccordionItem value="user-type" className="border-slate-700">
            <AccordionTrigger className="text-slate-200 hover:text-blue-300 py-3 text-base">
              <div className="flex items-center">
                <Users size={18} className="mr-2 text-slate-400" /> Tipo de Usuário
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-3">
              <Select
                value={filters.userType || 'all'}
                onValueChange={(v) =>
                  onChange({ ...filters, userType: v === 'all' ? undefined : (v as 'aluno' | 'professor') })
                }
              >
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-slate-100 border-slate-600">
                  <SelectItem value="all" className="hover:bg-slate-600">Todos os tipos</SelectItem>
                  <SelectItem value="aluno" className="hover:bg-slate-600">Aluno</SelectItem>
                  <SelectItem value="professor" className="hover:bg-slate-600">Professor</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="course" className="border-slate-700">
            <AccordionTrigger className="text-slate-200 hover:text-blue-300 py-3 text-base">
              <div className="flex items-center">
                <BookOpen size={18} className="mr-2 text-slate-400" /> Curso
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-3">
              <Select
                value={filters.curso || 'all'}
                onValueChange={(v) =>
                  onChange({ ...filters, curso: v === 'all' ? undefined : v })
                }
              >
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Todos os cursos" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-slate-100 border-slate-600">
                  <SelectItem value="all" className="hover:bg-slate-600">Todos os cursos</SelectItem>
                  <SelectItem value="desenvolvimento-sistemas" className="hover:bg-slate-600">Desenvolvimento de Sistemas</SelectItem>
                  <SelectItem value="administracao" className="hover:bg-slate-600">Administração</SelectItem>
                  <SelectItem value="contabilidade" className="hover:bg-slate-600">Contabilidade</SelectItem>
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="date-range" className="border-slate-700">
            <AccordionTrigger className="text-slate-200 hover:text-blue-300 py-3 text-base">
              <div className="flex items-center">
                <CalendarDays size={18} className="mr-2 text-slate-400" /> Data de Cadastro
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-3">
              <Input
                type="date"
                placeholder="Data inicial"
                className="w-full bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                value={filters.startDate || ''}
                onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Data final"
                className="w-full bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                value={filters.endDate || ''}
                onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="search-term" className="border-slate-700">
            <AccordionTrigger className="text-slate-200 hover:text-blue-300 py-3 text-base">
               <div className="flex items-center">
                <Search size={18} className="mr-2 text-slate-400" /> Termo de Busca
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <Input
                placeholder="Buscar por nome, email, RA..."
                className="w-full bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                value={filters.search || ''}
                onChange={(e) => onChange({ ...filters, search: e.target.value })}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6" onClick={onApply}>
          Aplicar Filtros
        </Button>
        <Button variant="outline" className="w-full hover:bg-slate-700 border-slate-600 text-slate-300 hover:text-white mt-2" onClick={onReset}>
          Limpar Filtros
        </Button>
      </CardContent>
      </Card>
    </>
  );
};

export default AdminSidebar;
