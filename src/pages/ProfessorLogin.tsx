import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, LogIn, ArrowRight, Loader2, User, Lock } from 'lucide-react';
import { signIn, getCollection, db } from '../lib/firebase';
import { where } from 'firebase/firestore';

export function ProfessorLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Alternative login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signIn();
      navigate('/professor/sala-virtual');
    } catch (err: any) {
      console.error("Teacher Google login failed:", err);
      setError("Falha na autenticação via Google. Tente o acesso provisório abaixo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlternativeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Temporary logic: Check if any subject has this tutorEmail and password is '123'
      // or check in users collection
      const subjects = await getCollection('subjects', [where('tutorEmail', '==', email.toLowerCase())]) as any[];
      
      if (subjects.length > 0 && password === '123') {
        // Successful mock login
        // We store the email in localStorage to identify the teacher in the next screen
        localStorage.setItem('p_teacher_email', email.toLowerCase());
        localStorage.setItem('p_teacher_name', subjects[0].tutorName);
        navigate('/professor/sala-virtual');
      } else {
        // Also check in users collection if they are already registered as teachers
        const users = await getCollection('users', [
          where('email', '==', email.toLowerCase()),
          where('role', '==', 'teacher')
        ]) as any[];

        if (users.length > 0 && password === '123') {
          localStorage.setItem('p_teacher_email', email.toLowerCase());
          localStorage.setItem('p_teacher_name', users[0].name);
          navigate('/professor/sala-virtual');
        } else {
          setError("Credenciais inválidas. Verifique o e-mail cadastrado ou use a conta Google.");
        }
      }
    } catch (err) {
      console.error("Alternative login failed:", err);
      setError("Erro ao processar login. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="max-w-md w-full bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-100 p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#E31E24] p-3 rounded-sm mb-4 text-white">
            <HeartPulse className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-center">Portal do Professor</h1>
          <p className="text-gray-500 text-sm text-center mt-2 font-medium">Acesso exclusivo Life Cursos Técnicos.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest mb-6 animate-shake">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-sm font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm group disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-[#E31E24] animate-spin" />
            ) : (
              <LogIn className="w-5 h-5 text-[#E31E24]" />
            )}
            Acessar com Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-white px-4 text-gray-300">Ou acesso provisório</span>
            </div>
          </div>

          <form onSubmit={handleAlternativeLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Cadastrado</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail oficial"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-[#E31E24] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha (Padrão: 123)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:border-[#E31E24] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#151619] text-white py-4 rounded-sm font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg shadow-black/10 mt-6 disabled:opacity-50"
            >
              Entrar no Ambiente
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#E31E24] transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            Voltar ao Portal Principal
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
