import React from 'react';
import { 
  Settings, 
  Home, 
  BookOpen, 
  PenTool, 
  BarChart2, 
  AlertTriangle, 
  ClipboardList, 
  MessageSquare,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function VirtualClassroom() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            <span className="text-[10px] font-black leading-none mt-1">ser</span>
            <span className="text-[8px] font-medium leading-none">educacional</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            TÉCNICO EM ENFERMAGEM - MÓDULO B
          </span>
        </div>
        <button className="bg-[#E31E24] p-2 rounded-sm text-white hover:bg-[#C1191F] transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Navigation Bar */}
      <div className="px-6 mt-4">
        <nav className="bg-[#E31E24] rounded-sm h-12 flex items-center justify-around relative px-4">
          {/* Active Indicator (Início) */}
          <div className="absolute left-[10%] -top-4 flex flex-col items-center">
            <div className="bg-[#C1191F] p-3 rounded-sm shadow-lg border-4 border-white">
              <Home className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex flex-col items-center pt-6 opacity-0">
             <span className="text-[10px] font-bold text-white uppercase">Início</span>
          </div>

          <button className="flex flex-col items-center group">
            <BookOpen className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-bold text-white/70 uppercase mt-1">Conteúdo</span>
          </button>

          <button className="flex flex-col items-center group">
            <PenTool className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-bold text-white/70 uppercase mt-1">Avaliação</span>
          </button>

          <button className="flex flex-col items-center group">
            <BarChart2 className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-bold text-white/70 uppercase mt-1">Desempenho</span>
          </button>

          <button className="flex flex-col items-center group">
            <AlertTriangle className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            <span className="text-[9px] font-bold text-white/70 uppercase mt-1">Aviso</span>
          </button>
        </nav>
        <div className="flex justify-around mt-1 px-4">
           <span className="text-[9px] font-bold text-gray-800 uppercase w-20 text-center">Início</span>
           <span className="text-[9px] font-bold text-gray-400 uppercase w-20 text-center opacity-0">Conteúdo</span>
           <span className="text-[9px] font-bold text-gray-400 uppercase w-20 text-center opacity-0">Avaliação</span>
           <span className="text-[9px] font-bold text-gray-400 uppercase w-20 text-center opacity-0">Desempenho</span>
           <span className="text-[9px] font-bold text-gray-400 uppercase w-20 text-center opacity-0">Aviso</span>
        </div>
      </div>

      {/* Welcome Section */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Seja bem-vindo(a), SÉRGIO SILVA BEZERRA
        </h1>

        <div className="space-y-3">
          <button className="w-full bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl p-4 flex items-center gap-4 group">
            <div className="bg-[#E31E24] p-3 rounded-full text-white">
              <ClipboardList className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700">Organize seus estudos</span>
          </button>

          <button className="w-full bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl p-4 flex items-center gap-4 group">
            <div className="bg-[#E31E24] p-3 rounded-full text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700">Fale com o mediador</span>
          </button>
        </div>

        {/* Disciplines Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Disciplinas</h2>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-gray-900">0/2</span>
              <span className="text-xs font-bold text-gray-500 uppercase">Concluídos</span>
            </div>
          </div>

          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Pesquisar disciplina"
              className="w-full bg-gray-100 border-none rounded-sm py-3 pl-4 pr-10 text-sm font-medium focus:ring-2 focus:ring-[#E31E24]/20"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Anatomia e Fisiologia Humana', prof: 'DR. RICARDO SANTOS', color: 'bg-[#1a1a2e]' },
              { title: 'Fundamentos de Enfermagem', prof: 'DRA. MARIA OLIVEIRA', color: 'bg-[#1a1a2e]' }
            ].map((item, idx) => (
              <div 
                key={idx}
                className={`${item.color} rounded-sm aspect-[4/3] relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
              >
                {/* Background Pattern/Image Placeholder */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute top-6 left-6 right-6 space-y-1">
                  <p className="text-white text-[10px] font-black uppercase tracking-tighter opacity-70">
                    Prof. {item.prof}
                  </p>
                  <h3 className="text-white text-lg font-bold leading-tight uppercase">
                    {item.title}
                  </h3>
                </div>

                {/* Bottom Overlay for hover effect */}
                <div className="absolute inset-0 bg-[#E31E24]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="bg-white text-[#E31E24] px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-widest">Acessar</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back to Portal Button */}
        <div className="flex justify-center pt-12">
          <button 
            onClick={() => navigate('/aluno')}
            className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Voltar para o Portal do Aluno
          </button>
        </div>
      </main>
    </div>
  );
}
