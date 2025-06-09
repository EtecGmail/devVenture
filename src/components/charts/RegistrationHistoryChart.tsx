import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { startOfMonth, format, getDaysInMonth } from "date-fns";

interface SimpleUser {
  createdAt?: string;
}

interface Props {
  students: SimpleUser[];
  teachers: SimpleUser[];
}

function aggregateByDay(students: SimpleUser[], teachers: SimpleUser[]) {
  const map: Record<string, { s: number; t: number }> = {};
  students.forEach((u) => {
    const key = format(new Date(u.createdAt || 0), "HH");
    map[key] = { s: (map[key]?.s || 0) + 1, t: map[key]?.t || 0 };
  });
  teachers.forEach((u) => {
    const key = format(new Date(u.createdAt || 0), "HH");
    map[key] = { s: map[key]?.s || 0, t: (map[key]?.t || 0) + 1 };
  });
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  return hours.map((h) => ({ label: h, alunos: map[h]?.s || 0, professores: map[h]?.t || 0 }));
}

function aggregateByWeek(students: SimpleUser[], teachers: SimpleUser[]) {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const map: Record<number, { s: number; t: number }> = {};
  students.forEach((u) => {
    const d = new Date(u.createdAt || 0).getDay();
    map[d] = { s: (map[d]?.s || 0) + 1, t: map[d]?.t || 0 };
  });
  teachers.forEach((u) => {
    const d = new Date(u.createdAt || 0).getDay();
    map[d] = { s: map[d]?.s || 0, t: (map[d]?.t || 0) + 1 };
  });
  return days.map((day, index) => ({ label: day, alunos: map[index]?.s || 0, professores: map[index]?.t || 0 }));
}

function aggregateByMonth(students: SimpleUser[], teachers: SimpleUser[]) {
  const map: Record<string, { s: number; t: number }> = {};
  students.forEach((u) => {
    const key = format(new Date(u.createdAt || 0), "dd/MM");
    map[key] = { s: (map[key]?.s || 0) + 1, t: map[key]?.t || 0 };
  });
  teachers.forEach((u) => {
    const key = format(new Date(u.createdAt || 0), "dd/MM");
    map[key] = { s: map[key]?.s || 0, t: (map[key]?.t || 0) + 1 };
  });
  const start = startOfMonth(new Date());
  const daysInMonth = getDaysInMonth(new Date());
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = format(new Date(start.getFullYear(), start.getMonth(), i + 1), "dd/MM");
    return { label: d, alunos: map[d]?.s || 0, professores: map[d]?.t || 0 };
  });
}

function aggregateByYear(students: SimpleUser[], teachers: SimpleUser[]) {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const map: Record<string, { s: number; t: number }> = {};
  students.forEach((u) => {
    const key = format(new Date(u.createdAt || 0), "MMM");
    map[key] = { s: (map[key]?.s || 0) + 1, t: map[key]?.t || 0 };
  });
  teachers.forEach((u) => {
    const key = format(new Date(u.createdAt || 0), "MMM");
    map[key] = { s: map[key]?.s || 0, t: (map[key]?.t || 0) + 1 };
  });
  return months.map((m) => ({ label: m, alunos: map[m]?.s || 0, professores: map[m]?.t || 0 }));
}

const RegistrationHistoryChart = ({ students, teachers }: Props) => {
  const [interval, setInterval] = useState<"day" | "week" | "month" | "year">("week");

  const data = useMemo(() => {
    switch (interval) {
      case "day":
        return aggregateByDay(students, teachers);
      case "week":
        return aggregateByWeek(students, teachers);
      case "month":
        return aggregateByMonth(students, teachers);
      case "year":
        return aggregateByYear(students, teachers);
      default:
        return [];
    }
  }, [students, teachers, interval]);

  const isCategorical = interval === "week" || interval === "year";

  return (
    <div className="space-y-4">
      <Tabs value={interval} onValueChange={(v) => setInterval(v as "day" | "week" | "month" | "year") }>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="day">Dia</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mês</TabsTrigger>
          <TabsTrigger value="year">Ano</TabsTrigger>
        </TabsList>
      </Tabs>
      <ChartContainer
        className="mt-4"
        config={{ alunos: { color: "hsl(var(--primary))" }, professores: { color: "hsl(var(--secondary))" } }}
      >
        {isCategorical ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="alunos" stackId="a" fill="var(--color-alunos)" name="Alunos" />
            <Bar dataKey="professores" stackId="a" fill="var(--color-professores)" name="Professores" />
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="alunos" stroke="var(--color-alunos)" fill="var(--color-alunos)" name="Alunos" />
            <Area type="monotone" dataKey="professores" stroke="var(--color-professores)" fill="var(--color-professores)" name="Professores" />
          </AreaChart>
        )}
      </ChartContainer>
    </div>
  );
};

export default RegistrationHistoryChart;
