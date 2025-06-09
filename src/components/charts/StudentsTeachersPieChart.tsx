import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface Props {
  students: number
  teachers: number
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))"]

const StudentsTeachersPieChart = ({ students, teachers }: Props) => {
  const data = [
    { name: "Alunos", value: students },
    { name: "Professores", value: teachers },
  ]
  return (
    <ChartContainer
      className="h-64"
      config={{ alunos: { color: COLORS[0] }, professores: { color: COLORS[1] } }}
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  )
}

export default StudentsTeachersPieChart
