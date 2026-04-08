import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const scheduleData = [
  {
    day: 'Segunda-feira',
    classes: [
      { time: '19:00 - 20:40', subject: 'Análise Fílmica e Crítica Cinematográfica', room: 'Sala 302 - Bloco A', tutor: 'Tereza Carla Souza Pereira' },
      { time: '20:50 - 22:30', subject: 'Direção em Cinema', room: 'Laboratório de Vídeo', tutor: 'Franthiesco Anthonio Ballerini Manso' },
    ]
  },
  {
    day: 'Terça-feira',
    classes: [
      { time: '19:00 - 22:30', subject: 'Laboratório de Projetos Inovadores', room: 'Sala 105 - Bloco B', tutor: 'Adilson da Silva' },
    ]
  },
  {
    day: 'Quarta-feira',
    classes: [
      { time: '19:00 - 20:40', subject: 'Análise Fílmica e Crítica Cinematográfica', room: 'Sala 302 - Bloco A', tutor: 'Tereza Carla Souza Pereira' },
      { time: '20:50 - 22:30', subject: 'Direção em Cinema', room: 'Laboratório de Vídeo', tutor: 'Franthiesco Anthonio Ballerini Manso' },
    ]
  },
  {
    day: 'Quinta-feira',
    classes: [
      { time: '19:00 - 22:30', subject: 'Atividades Complementares / Estágio', room: 'Campo / Externo', tutor: '-' },
    ]
  },
  {
    day: 'Sexta-feira',
    classes: [
      { time: '19:00 - 22:30', subject: 'Seminários Temáticos', room: 'Auditório Principal', tutor: 'Convidado' },
    ]
  }
];

export function Schedule() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <span>Filmmaker</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#E31E24]">Quadro de Horários</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quadro de Horários</h1>
          <p className="text-xs text-gray-500 mt-1">Consulte os horários das suas aulas presenciais e atividades do semestre.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Semestre Atual</p>
            <p className="text-sm font-bold text-[#E31E24]">2026.1</p>
          </div>
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#E31E24]">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 gap-6">
        {scheduleData.map((daySchedule, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{daySchedule.day}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {daySchedule.classes.map((cls, cIdx) => (
                <div key={cIdx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600">{cls.time}</p>
                      <h3 className="text-base font-bold text-gray-800 mt-1">{cls.subject}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                          <MapPin className="w-3 h-3" />
                          {cls.room}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                          <span className="text-gray-300">|</span>
                          Tutor: <span className="text-gray-600">{cls.tutor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-[#E31E24] uppercase tracking-widest hover:underline">
                    Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={() => navigate('/aluno')}
          className="flex items-center gap-2 bg-[#E31E24] text-white px-8 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#C1191F] transition-colors shadow-lg"
        >
          Voltar
        </button>
      </div>

      {/* Floating Help Button */}
      <button className="fixed bottom-8 right-8 bg-[#E31E24] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50">
        <HelpCircle className="w-8 h-8" />
      </button>
    </div>
  );
}
