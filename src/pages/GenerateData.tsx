import { faker } from '@faker-js/faker'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Database, User, Users } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { toast, Toaster } from 'sonner'

function generateCPF() {
  const digits: number[] = []
  for (let i = 0; i < 9; i++) digits.push(Math.floor(Math.random() * 10))
  let sum = 0
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i)
  let rest = sum % 11
  digits.push(rest < 2 ? 0 : 11 - rest)
  sum = 0
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i)
  rest = sum % 11
  digits.push(rest < 2 ? 0 : 11 - rest)
  return digits.join('')
}

const GenerateData = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const createData = async () => {
    setIsGenerating(true)
    setProgress(0)
    setShowSuccess(false)
    
    try {
      const totalUsers = 60
      let created = 0
      
      // Professores
      for (let i = 0; i < 10; i++) {
        const name = faker.person.fullName()
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 8 })
        const cpf = generateCPF()
        
        await register(
          email,
          password,
          name,
          'professor',
          {
            cpf,
            especializacao: faker.lorem.word(),
            formacao: faker.person.jobTitle(),
            telefone: faker.phone.number('## #####-####'),
            registro: faker.string.alphanumeric(6)
          },
          false
        )
        
        created++
        setProgress(Math.round((created / totalUsers) * 100))
      }
      
      // Alunos
      for (let i = 0; i < 50; i++) {
        const name = faker.person.fullName()
        const email = faker.internet.email()
        const password = faker.internet.password({ length: 8 })
        
        await register(
          email,
          password,
          name,
          'aluno',
          {
            ra: faker.string.numeric(8),
            curso: faker.lorem.word(),
            semestre: String(faker.number.int({ min: 1, max: 8 })),
            telefone: faker.phone.number('## #####-####')
          },
          false
        )
        
        created++
        setProgress(Math.round((created / totalUsers) * 100))
      }
      
      setShowSuccess(true)
      toast.success('Dados gerados com sucesso!', {
        description: '10 professores e 50 alunos foram criados',
        duration: 5000,
        icon: <Check className="w-5 h-5 text-green-500" />,
      })
      
      // Reset countdown
      setCountdown(3)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setShowSuccess(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
    } catch (error) {
      toast.error('Erro na geração de dados', {
        description: error.message || 'Tente novamente mais tarde',
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-center" richColors closeButton />
      <div className="p-4">
        <Button variant="secondary" onClick={() => navigate('/admin/dashboard')}>Voltar ao Dashboard</Button>
      </div>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="rounded-xl shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <motion.div 
                className="mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full p-3"
                whileHover={{ scale: 1.05 }}
              >
                <Database className="w-8 h-8 text-blue-600" />
              </motion.div>
              
              <CardTitle className="text-2xl font-bold text-gray-800">
                Gerador de Dados de Teste
              </CardTitle>
              <CardDescription className="text-gray-500 mt-2">
                Crie dados fictícios para testes no sistema
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>10 Professores</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>50 Alunos</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
                  <span className="font-medium">Atenção:</span> Esta ação irá criar registros reais na base de dados. Use apenas em ambientes de desenvolvimento.
                </div>
              </div>
              
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <Progress value={progress} className="h-2.5" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Gerando dados...</span>
                    <span>{progress}%</span>
                  </div>
                </motion.div>
              )}
              
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 text-green-700 p-3 rounded-md flex items-center"
                  >
                    <Check className="w-5 h-5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Dados gerados com sucesso!</p>
                      <p className="text-sm">Confirmando em {countdown}s</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Button
                onClick={createData}
                disabled={isGenerating}
                className={`w-full rounded-lg py-6 text-base font-medium shadow-lg transition-all ${
                  isGenerating 
                    ? 'bg-gray-300' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                }`}
              >
                {isGenerating ? (
                  <motion.div 
                    className="flex items-center"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gerando dados...
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Gerar Dados de Teste
                  </motion.div>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Esta ferramenta utiliza a biblioteca Faker.js para geração de dados fictícios</p>
          </div>
        </motion.div>
      </main>
      
    </div>
  )
}

export default GenerateData
