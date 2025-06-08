import { useState, useMemo } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { ActivityLogEntry } from "@/utils/activityLog"
import { startOfMonth, format } from "date-fns"

interface ActivityHistoryChartProps {
  log: ActivityLogEntry[]
}

function aggregateByDay(log: ActivityLogEntry[]) {
  const map: Record<string, number> = {}
  log.forEach((l) => {
    const key = format(new Date(l.timestamp), "HH")
    map[key] = (map[key] || 0) + 1
  })
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
  return hours.map((h) => ({ label: h, value: map[h] || 0 }))
}

function aggregateByWeek(log: ActivityLogEntry[]) {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const map: Record<number, number> = {}
  log.forEach((l) => {
    const d = new Date(l.timestamp).getDay()
    map[d] = (map[d] || 0) + 1
  })
  return days.map((day, index) => ({ label: day, value: map[index] || 0 }))
}

function aggregateByMonth(log: ActivityLogEntry[]) {
  const map: Record<string, number> = {}
  log.forEach((l) => {
    const key = format(new Date(l.timestamp), "dd/MM")
    map[key] = (map[key] || 0) + 1
  })
  const start = startOfMonth(new Date())
  return Array.from({ length: 31 }, (_, i) => {
    const d = format(new Date(start.getFullYear(), start.getMonth(), i + 1), "dd/MM")
    return { label: d, value: map[d] || 0 }
  })
}

function aggregateByYear(log: ActivityLogEntry[]) {
  const map: Record<string, number> = {}
  log.forEach((l) => {
    const key = format(new Date(l.timestamp), "MMM")
    map[key] = (map[key] || 0) + 1
  })
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ]
  return months.map((m) => ({ label: m, value: map[m] || 0 }))
}

const ActivityHistoryChart = ({ log }: ActivityHistoryChartProps) => {
  const [interval, setInterval] = useState<"day" | "week" | "month" | "year">("week")

  const submissions = useMemo(
    () => log.filter((l) => l.actionType === "exercicio_submit"),
    [log]
  )

  const data = useMemo(() => {
    switch (interval) {
      case "day":
        return aggregateByDay(submissions)
      case "week":
        return aggregateByWeek(submissions)
      case "month":
        return aggregateByMonth(submissions)
      case "year":
        return aggregateByYear(submissions)
      default:
        return []
    }
  }, [submissions, interval])

  const isCategorical = interval === "week" || interval === "year"

  return (
    <div className="space-y-4">
      <Tabs
        value={interval}
        onValueChange={(v) =>
          setInterval(v as "day" | "week" | "month" | "year")
        }
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="day">Dia</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mês</TabsTrigger>
          <TabsTrigger value="year">Ano</TabsTrigger>
        </TabsList>
      </Tabs>
      <ChartContainer
        className="mt-4"
        config={{ activity: { color: "hsl(var(--primary))" } }}
      >
        {isCategorical ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-activity)" />
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-activity)"
              fill="var(--color-activity)"
            />
          </AreaChart>
        )}
      </ChartContainer>
    </div>
  )
}

export default ActivityHistoryChart
