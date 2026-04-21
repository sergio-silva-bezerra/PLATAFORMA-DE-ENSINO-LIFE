import React, { useEffect, useState } from 'react';
import { Play, FileText, Calendar, GraduationCap, HelpCircle, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { GamificationBadges } from '../components/GamificationBadges';
import { getCollection } from '../lib/firebase';

const timeline = ['2024.2', '2025.1', '2025.2', '2026.1', '2026.2'];

export function StudentDashboard() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCollection('subjects');
        setSubjects(data);
      } catch (err) {
        console.error("Error fetching student dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#E31E24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Course Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Seu Curso Técnico</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          Ambiente de Teste Real
        </p>
      </div>

      {/* Banner */}
      <div className="relative bg-[#E31E24] rounded-sm overflow-hidden h-[240px] flex items-center px-12 group shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="z-10 space-y-4 max-w-md">
          <div className="space-y-1">
            <p className="text-white font-black text-2xl uppercase tracking-tighter">Olá, Sérgio!</p>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <div className="p-1.5 bg-white/20 rounded-sm">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold">Bem-vindo ao seu novo Ambiente Real de Aprendizagem.</span>
            </div>
          </div>
          <button className="bg-red-500 text-white px-8 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20">
            PERSONALIZAR PERFIL
          </button>
        </div>
        
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:block">
           <div className="w-48 h-48 border-8 border-white/10 rounded-sm overflow-hidden rotate-3 hover:rotate-0 transition-transform">
              <img 
                src="https://picsum.photos/seed/nursing/400/400" 
                alt="Course" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
           </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-sm border border-gray-100 shadow-sm">
        <button className="p-1 text-[#E31E24] hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center justify-around relative mx-8">
          <div className="absolute h-[1px] bg-gray-200 w-full top-1/2 -translate-y-1/2 z-0"></div>
          {timeline.map((year, idx) => (
            <div key={year} className="relative z-10 flex flex-col items-center">
              <div className={cn(
                "w-3 h-3 rounded-sm border-2 transition-all",
                year === '2026.1' ? "bg-[#E31E24] border-[#E31E24] scale-125 shadow-lg shadow-[#E31E24]/20" : "bg-white border-gray-300"
              )}></div>
              <span className={cn(
                "absolute top-6 text-[10px] font-black whitespace-nowrap",
                year === '2026.1' ? "text-[#E31E24]" : "text-gray-300"
              )}>
                {year}
              </span>
            </div>
          ))}
        </div>
        <button className="p-1 text-[#E31E24] hover:bg-gray-50 rounded-full transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Subjects List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Suas Disciplinas Ativas</h2>
            <Link to="/aluno/sala-virtual" className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest hover:underline">
              Ver Todas no AVA 3.0
            </Link>
          </div>

          {subjects.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-sm border-2 border-dashed border-gray-100">
               <GraduationCap className="w-12 h-12 text-gray-100 mx-auto mb-4" />
               <p className="text-gray-400 font-bold uppercase text-xs">Nenhuma disciplina vinculada ao seu currículo ainda.</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden hover:border-[#E31E24] transition-colors">
                <div className="p-6 flex justify-between items-start">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#E31E24] font-black text-[10px] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-sm">VIRTUAL</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {subject.id}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-800 leading-tight max-w-sm uppercase tracking-tight">{subject.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      DOCENTE: <span className="text-gray-900">{subject.tutorName}</span>
                    </p>
                    <Link 
                      to="/aluno/sala-virtual"
                      className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all w-fit shadow-xl shadow-black/10"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      Entrar na Sala Virtual
                    </Link>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                     <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-sm flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-gray-300">--</span>
                        <div className="w-full bg-[#E31E24] py-1 text-center mt-auto">
                          <span className="text-[8px] font-black text-white uppercase">GRADE</span>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Abertura</p>
                      <p className="text-xs font-black text-gray-700">{new Date(subject.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200"></div>
                    <div>
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Progresso</p>
                      <div className="w-32 bg-gray-200 h-1.5 rounded-sm overflow-hidden mt-1">
                        <div className="bg-red-600 h-full w-[0%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#151619] rounded-sm shadow-xl p-8 text-white relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#E31E24]">Financeiro Real</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">Após as primeiras matrículas reais, seu extrato financeiro aparecerá aqui.</p>
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-center">Abrir Extrato</button>
            </div>
          </div>

          <GamificationBadges />

          <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações Operacionais</p>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { label: 'Secretaria Digital', icon: FileText, path: '/aluno/secretaria' },
                { label: 'Biblioteca Virtual', icon: GraduationCap, path: '/aluno/sala-virtual' },
                { label: 'Chat de Suporte', icon: HelpCircle, path: '/aluno/ajuda' },
              ].map((item) => (
                <Link 
                  key={item.label} 
                  to={item.path}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-4 h-4 text-[#E31E24]" />
                    <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 group-hover:text-[#E31E24] transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <button className="fixed bottom-8 right-8 bg-red-600 text-white p-4 rounded-sm shadow-2xl hover:scale-110 transition-transform z-50">
        <HelpCircle className="w-8 h-8" />
      </button>
    </div>
  );
}
