import React, { useState } from 'react';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function AboutCourse() {
  const [activeTab, setActiveTab] = useState('O CURSO');

  const tabs = ['O CURSO', 'MATRIZ CURRICULAR', 'CORPO DOCENTE'];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Técnico em Enfermagem</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#E31E24]">Sobre o Curso</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">Sobre o curso</h1>

        {/* Content Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
          {/* Tabs */}
          <div className="flex items-center gap-8 px-8 border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2",
                  activeTab === tab
                    ? "text-[#E31E24] border-[#E31E24]"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'O CURSO' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Técnico em Enfermagem</h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  O curso Técnico em Enfermagem prepara o profissional para atuar na promoção, prevenção, recuperação e reabilitação da saúde, sob a supervisão do enfermeiro. Com foco prático e humanizado, o curso abrange desde cuidados básicos até procedimentos técnicos complexos em diversos ambientes de saúde.
                </p>
              </div>
            )}
            {activeTab === 'MATRIZ CURRICULAR' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Matriz Curricular</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((sem) => (
                    <div key={sem} className="border border-gray-100 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700">{sem}º Semestre</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Carga Horária: 400h</span>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-xs text-gray-600">• Anatomia e Fisiologia Humana</p>
                        <p className="text-xs text-gray-600">• Fundamentos de Enfermagem</p>
                        <p className="text-xs text-gray-600">• Ética e Bioética Profissional</p>
                        <p className="text-xs text-gray-600">• Microbiologia e Parasitologia</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'CORPO DOCENTE' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Corpo Docente</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Dr. Ricardo Santos', role: 'Doutor em Ciências da Saúde' },
                    { name: 'Dra. Maria Oliveira', role: 'Mestre em Enfermagem' },
                    { name: 'Carlos Mendes', role: 'Especialista em Bioética' },
                  ].map((prof) => (
                    <div key={prof.name} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">
                        {prof.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{prof.name}</p>
                        <p className="text-xs text-gray-500">{prof.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <button className="fixed bottom-8 right-8 bg-[#E31E24] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50">
        <HelpCircle className="w-8 h-8" />
      </button>

      {/* Footer mimic from screenshot */}
      <footer className="bg-[#E31E24] text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Links Úteis</h4>
            <div className="space-y-2">
              <p className="text-xs font-bold hover:underline cursor-pointer">Núcleo Trabalhabilidade</p>
              <p className="text-xs font-bold hover:underline cursor-pointer">GO Kursos</p>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Coordenação do seu curso</h4>
            <p className="text-xs font-bold">Coordenação Acadêmica de Enfermagem</p>
          </div>
          <div className="flex justify-end items-center">
            <div className="flex items-center gap-2">
               <div className="bg-white p-1 rounded">
                 <div className="bg-[#E31E24] w-6 h-6 flex items-center justify-center">
                    <span className="font-black text-[10px]">é</span>
                 </div>
               </div>
               <span className="font-black text-2xl tracking-tighter italic">ser <span className="font-light">educacional</span></span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
