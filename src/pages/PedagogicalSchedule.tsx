import React, { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_EVENTS = [
  { id: '1', title: 'Aula Magna: O Futuro do Cinema', date: '2026-04-10', time: '19:00', room: 'Auditório Principal', type: 'Aula' },
  { id: '2', title: 'Workshop de Edição Avançada', date: '2026-04-12', time: '14:00', room: 'Lab 03', type: 'Workshop' },
  { id: '3', title: 'Entrega de Projetos - Módulo B', date: '2026-04-15', time: '23:59', room: 'Online', type: 'Prazo' },
  { id: '4', title: 'Seminário de Roteiro', date: '2026-04-18', time: '19:30', room: 'Sala 204', type: 'Seminário' },
];

export function PedagogicalSchedule() {
  const [events, setEvents] = useState(MOCK_EVENTS);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cronograma de Aulas</h1>
          <p className="text-gray-500">Gerencie o calendário acadêmico, aulas presenciais e prazos de entrega.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#E31E24] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all">
          <Plus className="w-5 h-5" />
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View (Simplified) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Abril 2026</h2>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
              <span key={d} className="text-[10px] font-black text-gray-400 uppercase">{d}</span>
            ))}
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "aspect-square flex items-center justify-center text-xs font-bold rounded-lg cursor-pointer transition-all",
                  i + 1 === 10 ? "bg-[#E31E24] text-white shadow-lg shadow-[#E31E24]/20" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-50 space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Legenda</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600 font-medium">Aula Presencial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-600 font-medium">Workshop / Evento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600 font-medium">Prazo de Entrega</span>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Próximos Eventos</h2>
            <button className="text-[#E31E24] text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#E31E24]/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-[#E31E24]/5 group-hover:border-[#E31E24]/20 transition-all">
                    <span className="text-[10px] font-black text-gray-400 uppercase">{new Date(event.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                    <span className="text-2xl font-black text-gray-900 group-hover:text-[#E31E24]">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                        event.type === 'Aula' ? "bg-blue-100 text-blue-600" :
                        event.type === 'Workshop' ? "bg-purple-100 text-purple-600" : "bg-red-100 text-red-600"
                      )}>
                        {event.type}
                      </span>
                      <h3 className="text-base font-bold text-gray-800">{event.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.room}
                      </div>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
