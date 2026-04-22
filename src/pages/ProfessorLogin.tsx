import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, LogIn, ArrowRight, Loader2 } from 'lucide-react';
import { signIn } from '../lib/firebase';

export function ProfessorLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signIn();
      // After sign in, redirect to teacher panel
      navigate('/professor/sala-virtual');
    } catch (err: any) {
      console.error("Teacher Google login failed:", err);
      setError("Falha na autenticação. Verifique se você está cadastrado como professor no sistema.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="max-w-md w-full bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-100 p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#E31E24] p-3 rounded-sm mb-4">
            <HeartPulse className="text-white w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-center">Portal do Professor</h1>
          <p className="text-gray-500 text-sm text-center mt-2 font-medium">Acesso exclusivo para docentes da Life Cursos Técnicos.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-sm border border-dashed border-gray-200">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-4">Identificação Obrigatória</p>
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
              Entrar com Conta Google
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Informações de Acesso</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E31E24] mt-1 shrink-0"></div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Você deve utilizar o e-mail institucional ou o e-mail cadastrado pelo setor Pedagógico.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E31E24] mt-1 shrink-0"></div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Este link é pessoal e intransferível. Caso não tenha acesso, entre em contato com a coordenação.</p>
              </div>
            </div>
          </div>
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
