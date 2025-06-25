
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { User } from 'lucide-react';
import { formatCPF, isCPFValid } from '@/utils/cpf';

const ProfessorLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email deve ter um formato válido'
    },
    password: {
      required: true,
      minLength: 8, // Consistent with AlunoLogin and new requirements
      message: 'Senha: 8+ caracteres, maiúscula, minúscula, número e símbolo.'
    },
    name: {
      required: !isLogin,
      minLength: 2,
      maxLength: 50,
      message: 'Nome deve ter entre 2 e 50 caracteres'
    },
    cpf: {
      required: !isLogin,
      validate: isCPFValid,
      message: 'CPF inválido'
    },
    especializacao: {
      required: !isLogin,
      message: 'Área de especialização é obrigatória'
    },
    formacao: {
      required: !isLogin,
      message: 'Formação é obrigatória'
    },
    telefone: {
      pattern: /^[0-9\s()+-]*$/,
      message: 'Telefone deve conter apenas números'
    },
    registro: {
      required: !isLogin,
      minLength: 3,
      message: 'Registro profissional é obrigatório'
    }
  };

  const { errors, validateForm, validateField, sanitizeInput, clearFieldError } = useFormValidation(validationRules);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    cpf: '',
    especializacao: '',
    formacao: '',
    telefone: '',
    registro: ''
  });

  const preserveSpacesFields = ['name', 'formacao', 'especializacao', 'telefone'];

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    if (field === 'telefone') {
      processedValue = processedValue.replace(/[^0-9\s()+-]/g, '');
    }

    if (field === 'cpf') {
      processedValue = processedValue.replace(/\D/g, '').slice(0, 11);
      const sanitized = sanitizeInput(processedValue);
      setFormData(prev => ({ ...prev, [field]: sanitized }));
      if (sanitized.length === 11) {
        validateField(field, sanitized);
      } else {
        clearFieldError(field);
      }
      return;
    }

    const sanitized = sanitizeInput(processedValue, preserveSpacesFields.includes(field));
    setFormData(prev => ({ ...prev, [field]: sanitized }));
    validateField(field, sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    setLoading(true);
    
    try {
      let success = false;
      let errorMsg: string | undefined;

      if (isLogin) {
        success = await login(formData.email, formData.password, 'professor');
      } else {
        const result = await register(
          formData.email,
          formData.password,
          formData.name,
          'professor',
          {
            cpf: formData.cpf,
            especializacao: formData.especializacao,
            formacao: formData.formacao,
            telefone: formData.telefone,
            registro: formData.registro
          }
        );
        success = result.success;
        errorMsg = result.error;
      }

      if (success) {
        const stored = localStorage.getItem('@DevVenture:user');
        const loggedUser = stored ? JSON.parse(stored) : null;
        if (loggedUser?.type === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/professor');
        }
      } else {
        alert(isLogin ? 'Credenciais inválidas' : errorMsg || 'Erro no cadastro');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">
              {isLogin ? 'Login Professor' : 'Cadastro Professor'}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <Input
                      placeholder="Nome completo *"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      maxLength={50}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="CPF *"
                      value={formatCPF(formData.cpf)}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      maxLength={14}
                    />
                    {errors.cpf && (
                      <p className="text-red-400 text-sm mt-1">{errors.cpf}</p>
                    )}
                  </div>

                  <div>
                    <Select onValueChange={(value) => handleInputChange('especializacao', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Área de especialização *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programacao">Programação e Desenvolvimento</SelectItem>
                        <SelectItem value="redes">Redes e Infraestrutura</SelectItem>
                        <SelectItem value="banco-dados">Banco de Dados</SelectItem>
                        <SelectItem value="seguranca">Segurança da Informação</SelectItem>
                        <SelectItem value="gestao-projetos">Gestão de Projetos</SelectItem>
                        <SelectItem value="design">Design e UX/UI</SelectItem>
                        <SelectItem value="matematica">Matemática</SelectItem>
                        <SelectItem value="portugues">Português</SelectItem>
                        <SelectItem value="administracao">Administração</SelectItem>
                        <SelectItem value="contabilidade">Contabilidade</SelectItem>
                        <SelectItem value="logistica">Logística</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.especializacao && (
                      <p className="text-red-400 text-sm mt-1">{errors.especializacao}</p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      placeholder="Formação acadêmica e experiência *"
                      value={formData.formacao}
                      onChange={(e) => handleInputChange('formacao', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70 min-h-20"
                      maxLength={300}
                    />
                    {errors.formacao && (
                      <p className="text-red-400 text-sm mt-1">{errors.formacao}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Registro profissional/CRM/CREA *"
                      value={formData.registro}
                      onChange={(e) => handleInputChange('registro', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      maxLength={20}
                    />
                    {errors.registro && (
                      <p className="text-red-400 text-sm mt-1">{errors.registro}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Telefone (opcional)"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      maxLength={15}
                    />
                  </div>
                </>
              )}

              <div>
                <Input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <PasswordInput
                  placeholder="Senha *"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={loading}
              >
                {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-400 hover:text-indigo-300 text-sm block"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
              </button>
              <a
                href="/professor"
                className="text-slate-400 hover:text-slate-300 text-sm block"
              >
                Voltar para Área do Professor
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessorLogin;
