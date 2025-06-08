import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

// Dados mock para exemplo
const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
const alunos = [30, 45, 60, 40, 70, 80]
const professores = [5, 8, 6, 10, 9, 12]

const lineData = {
  labels,
  datasets: [
    {
      label: 'Alunos',
      data: alunos,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.4)',
    },
    {
      label: 'Professores',
      data: professores,
      borderColor: '#facc15',
      backgroundColor: 'rgba(250,204,21,0.4)',
    },
  ],
}

const barData = {
  labels,
  datasets: [
    {
      label: 'Alunos',
      data: alunos,
      backgroundColor: 'rgba(59,130,246,0.6)',
    },
    {
      label: 'Professores',
      data: professores,
      backgroundColor: 'rgba(250,204,21,0.6)',
    },
  ],
}

const donutData = {
  labels: ['Alunos', 'Professores'],
  datasets: [
    {
      data: [alunos.reduce((a, b) => a + b, 0), professores.reduce((a, b) => a + b, 0)],
      backgroundColor: ['#3b82f6', '#facc15'],
    },
  ],
}

const AnalyticsPage = () => (
  <div className="p-4 space-y-8" aria-label="Gráficos de comparação Alunos x Professores">
    <h1 className="text-xl font-bold">Análises</h1>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-card text-card-foreground rounded-lg p-4 shadow" role="img" aria-label="Grafico de linhas Alunos versus Professores">
        <Line data={lineData} />
      </div>
      <div className="bg-card text-card-foreground rounded-lg p-4 shadow" role="img" aria-label="Grafico de barras Alunos versus Professores">
        <Bar data={barData} />
      </div>
    </div>
    <div className="max-w-sm mx-auto bg-card text-card-foreground rounded-lg p-4 shadow" role="img" aria-label="Grafico de pizza Alunos versus Professores">
      <Doughnut data={donutData} />
    </div>
  </div>
)

export default AnalyticsPage
