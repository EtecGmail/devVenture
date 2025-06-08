import { faker } from '@faker-js/faker'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import React from 'react'

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

  const createData = async () => {
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
    }
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
    }
    alert('Dados gerados!')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Gerar Dados de Teste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={createData} className="w-full">
              Gerar
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default GenerateData
