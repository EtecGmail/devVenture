
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { GraduationCap, Eye, EyeOff } from 'lucide-react'; // Replaced Book with GraduationCap

const AlunoLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
      // minLength is now effectively handled by isStrongPassword, but good for immediate feedback
      // For client-side, we can keep a basic length or remove it if message is clear
      minLength: 8,
      message: 'Senha: 8+ caracteres, maiúscula, minúscula, número e símbolo.'
    },
    name: {
      required: !isLogin,
      minLength: 2,
      maxLength: 50,
      message: 'Nome deve ter entre 2 e 50 caracteres'
    },
    ra: {
      required: !isLogin,
      minLength: 5,
      maxLength: 20,
      message: 'RA/Matrícula deve ter entre 5 e 20 caracteres'
    },
    // curso validation rule removed
    semestre: {
      required: !isLogin,
      message: 'Semestre é obrigatório'
    },
    telefone: {
      pattern: /^[0-9\s()+-]*$/,
      message: 'Telefone deve conter apenas números'
    }
  };

  const { errors, validateForm, validateField, sanitizeInput } = useFormValidation(validationRules);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    ra: '',
    // curso field removed from formData
    semestre: '',
    telefone: ''
  });

  const preserveSpacesFields = ['name', 'telefone'];

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    if (field === 'telefone') {
      processedValue = processedValue.replace(/[^0-9\s()+-]/g, '');
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
        success = await login(formData.email, formData.password, 'aluno');
      } else {
        const result = await register(
          formData.email,
          formData.password,
          formData.name,
          'aluno',
          {
            ra: formData.ra,
            // curso not passed to register
            semestre: formData.semestre,
            telefone: formData.telefone
          }
        );
        success = result.success;
        errorMsg = result.error;
      }

      if (success) {
        navigate('/aluno');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">
              {isLogin ? 'Login Aluno' : 'Cadastro Aluno'}
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
                      placeholder="RA/Matrícula *"
                      value={formData.ra}
                      onChange={(e) => handleInputChange('ra', e.target.value)}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      maxLength={20}
                    />
                    {errors.ra && (
                      <p className="text-red-400 text-sm mt-1">{errors.ra}</p>
                    )}
                  </div>

                  {/* Course Select component removed */}

                  <div>
                    <Select onValueChange={(value) => handleInputChange('semestre', value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Semestre *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1º Semestre</SelectItem>
                        <SelectItem value="2">2º Semestre</SelectItem>
                        <SelectItem value="3">3º Semestre</SelectItem>
                        <SelectItem value="4">4º Semestre</SelectItem>
                        <SelectItem value="5">5º Semestre</SelectItem>
                        <SelectItem value="6">6º Semestre</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.semestre && (
                      <p className="text-red-400 text-sm mt-1">{errors.semestre}</p>
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

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha *"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 text-sm block"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
              </button>
              <a
                href="/aluno"
                className="text-slate-400 hover:text-slate-300 text-sm block"
              >
                Voltar para Área do Aluno
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlunoLogin;
