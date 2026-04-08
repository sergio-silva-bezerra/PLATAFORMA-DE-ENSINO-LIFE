import React from 'react';
import { Search, HelpCircle, Plus, ChevronUp, ChevronDown } from 'lucide-react';

const subjects = [
  { id: '1', name: 'Direção em cinema', code: 'GEAD348100', period: '3' },
  { id: '2', name: 'Análise fílmica e crítica cinematográfica', code: 'GEAD348200', period: '3' },
  { id: '3', name: 'Laboratório de projetos inovadores', code: 'GEAD456000', period: '3' },
];

export function SubjectValues() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-800">Consultar valor</h1>
        <p className="text-sm text-gray-500 font-medium">Valores para o dia 31.03.2026</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar disciplina ou código" 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#E31E24]"
              />
            </div>
            <button className="px-8 py-3 border border-[#E31E24] text-[#E31E24] rounded font-bold text-xs uppercase tracking-wider hover:bg-[#E31E24]/5 transition-colors">
              Consultar valores
            </button>
          </div>

          <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 w-12"></th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 flex items-center gap-1 cursor-pointer hover:text-[#E31E24] transition-colors">
                    Disciplina
                    <div className="flex flex-col -space-y-1 opacity-40">
                      <ChevronUp className="w-2 h-2" />
                      <ChevronDown className="w-2 h-2" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 flex items-center gap-1 cursor-pointer hover:text-[#E31E24] transition-colors">
                    Código
                    <div className="flex flex-col -space-y-1 opacity-40">
                      <ChevronUp className="w-2 h-2" />
                      <ChevronDown className="w-2 h-2" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-800 flex items-center gap-1 cursor-pointer hover:text-[#E31E24] transition-colors">
                    Período
                    <div className="flex flex-col -space-y-1 opacity-40">
                      <ChevronUp className="w-2 h-2" />
                      <ChevronDown className="w-2 h-2" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#E31E24] focus:ring-[#E31E24]" />
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-700">{s.name}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{s.code}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-700">{s.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 flex justify-end">
              <button className="text-[#E31E24] text-[10px] font-bold flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" />
                Ver mais
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center text-center space-y-6 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Valor das disciplinas para o dia atual (31.03.2026)</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-300 rounded-sm relative">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-gray-300"></div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-gray-300"></div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-800">Nenhuma disciplina selecionada</p>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Selecione ao lado para visualizar os valores das disciplinas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="bg-[#E31E24] -mx-4 p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">LINKS ÚTEIS</p>
            <div className="space-y-2">
              <p className="text-xs font-medium hover:underline cursor-pointer">Núcleo Trabalhabilidade</p>
              <p className="text-xs font-medium hover:underline cursor-pointer">GO Cursos</p>
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">COORDENAÇÃO DO SEU CURSO</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rotate-45"></div>
             </div>
             <span className="text-2xl font-black italic">ser <span className="font-light not-italic text-sm">educacional</span></span>
          </div>
      </div>
      <div className="bg-[#C1191F] -mx-4 py-4 text-center">
        <p className="text-[10px] text-white/60 font-medium">Todos os direitos reservados</p>
      </div>

      {/* Floating Help Button */}
      <button className="fixed bottom-8 right-8 bg-[#4CAF50] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50">
        <HelpCircle className="w-8 h-8" />
      </button>
    </div>
  );
}
