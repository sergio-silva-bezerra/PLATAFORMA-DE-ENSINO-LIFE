import React from 'react';
import { Play, FileText, Calendar, GraduationCap, HelpCircle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const subjects = [
  {
    id: '1',
    name: 'Anatomia e Fisiologia Humana',
    tutor: 'Dr. Ricardo Santos',
    startDate: '30/03/2026',
    grade: '--',
    average: 0,
  },
  {
    id: '2',
    name: 'Fundamentos de Enfermagem',
    tutor: 'Dra. Maria Oliveira',
    startDate: '20/01/2026',
    grade: '--',
    average: 40,
  },
  {
    id: '3',
    name: 'Ética e Bioética Profissional',
    tutor: 'Carlos Mendes',
    startDate: '20/01/2026',
    grade: '--',
    average: 60,
  },
];

const timeline = ['2024.2', '2025.1', '2025.2', '2026.1', '2026.2'];

export function StudentDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Course Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Técnico em Enfermagem</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          RR - BOA VISTA (GARDEN SHOPPING - UNAMA)
        </p>
      </div>

      {/* Banner */}
      <div className="relative bg-[#E31E24] rounded-sm overflow-hidden h-[240px] flex items-center px-12 group">
        <div className="z-10 space-y-4 max-w-md">
          <div className="space-y-1">
            <p className="text-white font-bold text-lg">Olá, Sérgio!</p>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <div className="p-1.5 bg-white/20 rounded-sm">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span>Olá, bem-vindo(a) ao novo Portal do Aluno.</span>
            </div>
          </div>
          <button className="bg-[#4CAF50] text-white px-8 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-[#43a047] transition-colors shadow-lg">
            INICIAR PASSEIO
          </button>
        </div>

        {/* Abstract shapes mimicking the banner in screenshot */}
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full">
             <div className="absolute inset-0 flex items-center justify-end pr-12 pointer-events-auto">
                <div className="w-40 h-40 rounded-sm overflow-hidden border-4 border-white/20 shadow-2xl">
                   <img 
                      src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=400&q=80" 
                      alt="Saúde" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                   />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between px-4 py-2 bg-white rounded-sm border border-gray-100 shadow-sm">
        <button className="p-1 text-[#E31E24] hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex items-center justify-around relative mx-8">
          <div className="absolute h-[1px] bg-gray-200 w-full top-1/2 -translate-y-1/2 z-0"></div>
          {timeline.map((year, idx) => (
            <div key={year} className="relative z-10 flex flex-col items-center">
              <div className={cn(
                "w-3 h-3 rounded-sm border-2 transition-all",
                year === '2026.1' ? "bg-[#E31E24] border-[#E31E24] scale-125" : "bg-white border-gray-300"
              )}></div>
              <span className={cn(
                "absolute top-6 text-[10px] font-bold whitespace-nowrap",
                year === '2026.1' ? "text-[#E31E24]" : "text-gray-400"
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
          {/* Department Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/aluno/carteira/pagamentos" className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-50 text-[#E31E24] rounded-sm group-hover:bg-[#E31E24] group-hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Financeiro</span>
              </div>
              <p className="text-xs font-bold text-gray-700">1 Boleto Pendente</p>
              <p className="text-[9px] text-gray-400 mt-1">Vencimento em 10/04</p>
            </Link>

            <Link to="/aluno/secretaria?type=acompanhar-chamados" className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secretaria</span>
              </div>
              <p className="text-xs font-bold text-gray-700">Solicitação em Análise</p>
              <p className="text-[9px] text-gray-400 mt-1">Protocolo #20260401</p>
            </Link>

            <Link to="/aluno/sala-virtual" className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pedagógico</span>
              </div>
              <p className="text-xs font-bold text-gray-700">Nova Atividade</p>
              <p className="text-[9px] text-gray-400 mt-1">Direção em Cinema</p>
            </Link>
          </div>

          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 font-bold text-[10px]">@</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">EAD</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 leading-tight max-w-md">{subject.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    TUTOR (A): <span className="text-gray-600">{subject.tutor}</span>
                  </p>
                  <Link 
                    to="/aluno/sala-virtual"
                    className="flex items-center gap-2 px-4 py-2 border border-[#E31E24] text-[#E31E24] rounded-sm text-xs font-bold hover:bg-[#E31E24]/5 transition-colors w-fit"
                  >
                    <div className="p-1 bg-[#E31E24]/10 rounded-sm">
                      <Play className="w-3 h-3 fill-[#E31E24]" />
                    </div>
                    Sala de Aula Virtual
                  </Link>
                </div>

                <div className="flex flex-col items-center gap-1">
                   <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-sm flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-gray-400">{subject.grade}</span>
                      <div className="w-full bg-blue-100 py-1 text-center mt-auto">
                        <span className="text-[8px] font-bold text-blue-600 uppercase">1ª AVALIAÇÃO</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">DATA DE INÍCIO</p>
                    <p className="text-xs font-bold text-gray-700">{subject.startDate}</p>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-200"></div>
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-1">NOTA MÉDIA DA TURMA</p>
                    <div className="w-full bg-gray-200 h-1.5 rounded-sm overflow-hidden">
                      <div className="bg-blue-400 h-full" style={{ width: `${subject.average}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Nav */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button className="px-6 py-2 border border-gray-800 text-gray-800 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              SEMESTRE PASSADO
            </button>
            <button className="px-6 py-2 border border-gray-800 text-gray-800 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors flex items-center gap-2">
              PRÓXIMO SEMESTRE
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payments */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-8 flex flex-col items-center text-center space-y-4">
               <div className="relative">
                  <div className="w-16 h-16 bg-gray-50 rounded-sm flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-sm shadow-sm">
                    <div className="bg-amber-400 w-4 h-4 rounded-sm flex items-center justify-center text-white text-[8px] font-bold">$</div>
                  </div>
               </div>
               <p className="text-xs text-gray-600 font-medium leading-relaxed">Acesse a página de pagamentos e visualize seus boletos</p>
            </div>
            <button className="w-full py-3 bg-gray-50 border-t border-gray-100 text-[#E31E24] text-xs font-bold hover:bg-gray-100 transition-colors">
              Ver Pagamentos
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acesso Rápido</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { label: 'Sobre o Curso', icon: FileText, path: '/aluno/sobre-curso' },
                { label: 'Atividades Complementares', icon: GraduationCap, path: '/aluno/atividades-complementares' },
                { label: 'Sala de Aula Virtual', icon: Play, path: '/aluno/sala-virtual' },
                { label: 'Quadro de Horários', icon: Calendar, path: '/aluno/horarios' },
              ].map((item) => (
                <Link 
                  key={item.label} 
                  to={item.path}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5 text-[#E31E24]" />
                    <span className="text-xs font-bold text-gray-600">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#E31E24] transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Service Center / Departments */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Central de Atendimento</p>
            </div>
            <div className="p-4 space-y-3">
              <Link to="/aluno/secretaria" className="flex items-center gap-3 p-3 rounded-sm hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-100">
                <div className="p-2 bg-blue-100 rounded-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Secretaria Acadêmica</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Solicitações e Documentos</p>
                </div>
              </Link>
              
              <Link to="/aluno/carteira/pagamentos" className="flex items-center gap-3 p-3 rounded-sm hover:bg-green-50 transition-colors group border border-transparent hover:border-green-100">
                <div className="p-2 bg-red-100 rounded-sm text-[#E31E24] group-hover:bg-[#E31E24] group-hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Setor Financeiro</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Pagamentos e Negociações</p>
                </div>
              </Link>

              <Link to="/aluno/sala-virtual" className="flex items-center gap-3 p-3 rounded-sm hover:bg-purple-50 transition-colors group border border-transparent hover:border-purple-100">
                <div className="p-2 bg-purple-100 rounded-sm text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Coordenação Pedagógica</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Conteúdo e Avaliações</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <ChevronLeft className="w-4 h-4 text-gray-300 cursor-pointer" />
              <span className="text-sm font-bold text-gray-500">Março de 2026</span>
              <ChevronRight className="w-4 h-4 text-gray-300 cursor-pointer" />
            </div>
            
            <div className="grid grid-cols-7 gap-y-4 text-center">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
                <span key={`${day}-${idx}`} className="text-[10px] font-black text-[#E31E24]">{day}</span>
              ))}
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className={cn(
                    "text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-sm transition-colors",
                    i + 1 === 31 ? "bg-[#E31E24] text-white" : "text-gray-400 hover:bg-gray-100 cursor-pointer"
                  )}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
               <p className="text-[10px] font-bold text-gray-400">Não há compromisso(s) para hoje</p>
               <button className="w-full mt-4 bg-[#4CAF50] text-white py-3 rounded font-bold text-[10px] uppercase tracking-widest hover:bg-[#43a047] transition-colors">
                 VER TODOS OS EVENTOS
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <button className="fixed bottom-8 right-8 bg-[#4CAF50] text-white p-4 rounded-sm shadow-2xl hover:scale-110 transition-transform z-50">
        <HelpCircle className="w-8 h-8" />
      </button>
    </div>
  );
}
