import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, CreditCard, HeartPulse, UserCog, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'aluno' | 'admin' | 'secretaria' | 'financeiro' | 'pedagogico' | 'professor'>('aluno');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'aluno') {
      navigate('/aluno');
      return;
    }

    // Simple mock validation for admin roles
    const credentials: Record<string, { id: string; pass: string; path: string }> = {
      admin: { id: 'admin', pass: 'admin123', path: '/admin' },
      secretaria: { id: 'secretaria', pass: 'sec123', path: '/secretaria' },
      financeiro: { id: 'financeiro', pass: 'fin123', path: '/financeiro' },
      pedagogico: { id: 'pedagogico', pass: 'ped123', path: '/pedagogico' },
      professor: { id: 'professor', pass: 'prof123', path: '/professor/sala-virtual' },
    };

    const cred = credentials[role];
    if (identifier === cred.id && password === cred.pass) {
      navigate(cred.path);
    } else {
      setError(`Credenciais inválidas para o perfil ${role}. Tente novamente.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side - Visual/Branding */}
        <div className="md:w-1/2 bg-[#E31E24] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white p-2 rounded-sm">
                <HeartPulse className="text-[#E31E24] w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-3xl tracking-tighter leading-none">Life</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Cursos Técnicos</span>
              </div>
            </div>
            
            <div className="mb-8 rounded-sm overflow-hidden shadow-2xl border-4 border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                alt="Profissionais da Saúde" 
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-white/80 text-lg max-w-xs font-medium leading-relaxed">
              Sua jornada acadêmica começa aqui. Acesse o portal e explore todas as possibilidades.
            </p>
          </div>

          <div className="relative z-10 pt-12">
             <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-white/30 rounded-sm overflow-hidden">
                   <div className="bg-white h-full w-1/3"></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Versão 2.0.26</span>
             </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bem-vindo!</h2>
            <p className="text-gray-500 mt-2 font-medium">Selecione seu perfil e faça login no portal.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <button 
              onClick={() => setRole('aluno')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all group",
                role === 'aluno' 
                  ? "border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24]" 
                  : "border-gray-100 hover:border-gray-200 text-gray-400"
              )}
            >
              <HeartPulse className={cn("w-6 h-6", role === 'aluno' ? "scale-110" : "group-hover:scale-110")} />
              <span className="text-[10px] font-black uppercase tracking-wider">Aluno</span>
            </button>
            
            <button 
              onClick={() => setRole('admin')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all group",
                role === 'admin' 
                  ? "border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24]" 
                  : "border-gray-100 hover:border-gray-200 text-gray-400"
              )}
            >
              <UserCog className={cn("w-6 h-6", role === 'admin' ? "scale-110" : "group-hover:scale-110")} />
              <span className="text-[10px] font-black uppercase tracking-wider">Admin</span>
            </button>

            <button 
              onClick={() => setRole('secretaria')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all group",
                role === 'secretaria' 
                  ? "border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24]" 
                  : "border-gray-100 hover:border-gray-200 text-gray-400"
              )}
            >
              <BookOpen className={cn("w-6 h-6", role === 'secretaria' ? "scale-110" : "group-hover:scale-110")} />
              <span className="text-[10px] font-black uppercase tracking-wider">Secretaria</span>
            </button>

            <button 
              onClick={() => setRole('financeiro')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all group",
                role === 'financeiro' 
                  ? "border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24]" 
                  : "border-gray-100 hover:border-gray-200 text-gray-400"
              )}
            >
              <CreditCard className={cn("w-6 h-6", role === 'financeiro' ? "scale-110" : "group-hover:scale-110")} />
              <span className="text-[10px] font-black uppercase tracking-wider">Financeiro</span>
            </button>

            <button 
              onClick={() => setRole('pedagogico')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all group",
                role === 'pedagogico' 
                  ? "border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24]" 
                  : "border-gray-100 hover:border-gray-200 text-gray-400"
              )}
            >
              <BookOpen className={cn("w-6 h-6", role === 'pedagogico' ? "scale-110" : "group-hover:scale-110")} />
              <span className="text-[10px] font-black uppercase tracking-wider">Pedagógico</span>
            </button>

            <button 
              onClick={() => setRole('professor')}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all group",
                role === 'professor' 
                  ? "border-[#E31E24] bg-[#E31E24]/5 text-[#E31E24]" 
                  : "border-gray-100 hover:border-gray-200 text-gray-400"
              )}
            >
              <User className={cn("w-6 h-6", role === 'professor' ? "scale-110" : "group-hover:scale-110")} />
              <span className="text-[10px] font-black uppercase tracking-wider">Professor</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-sm text-xs font-bold animate-shake">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">CPF, E-mail ou Matrícula</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === 'aluno' ? "Digite seus dados" : `Usuário ${role}`}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:outline-none focus:ring-4 focus:ring-[#E31E24]/10 focus:border-[#E31E24] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:outline-none focus:ring-4 focus:ring-[#E31E24]/10 focus:border-[#E31E24] transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#E31E24] focus:ring-[#E31E24]" />
                <span className="text-xs text-gray-500 font-medium group-hover:text-gray-700">Lembrar de mim</span>
              </label>
              <button type="button" className="text-xs font-bold text-[#E31E24] hover:underline">Esqueceu a senha?</button>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#E31E24] text-white py-4 rounded-sm font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#C1191F] transition-all shadow-xl shadow-[#E31E24]/20 group mt-8"
            >
              Entrar no Portal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-10 font-medium">
            Ainda não tem acesso? <button className="text-[#E31E24] font-bold hover:underline">Solicite aqui</button>
          </p>
        </div>
      </div>
    </div>
  );
}
