import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface Props {
  students: number
  teachers: number
}

const STUDENT_COLOR = "#3b82f6";
const TEACHER_COLOR = "#10b981";

const StudentsTeachersPieChart = ({ students, teachers }: Props) => {
  const data = [
    { name: "Alunos", value: students, color: STUDENT_COLOR },
    { name: "Professores", value: teachers, color: TEACHER_COLOR },
  ]
  return (
    <ChartContainer
      className="h-64"
      config={{ alunos: { color: STUDENT_COLOR }, professores: { color: TEACHER_COLOR } }}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    </ChartContainer>
  )
}

export default StudentsTeachersPieChart
