import React from 'react';
import { Microscope, Users, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

export default function LabManagement() {
  const labs = [
    { id: 1, name: 'Laboratório de Anatomia', benches: 12, occupied: 8, nextClass: 'Anatomia I', time: '14:00 - 16:00' },
    { id: 2, name: 'Laboratório de Práticas de Enfermagem', benches: 10, occupied: 10, nextClass: 'Fundamentos II', time: '16:00 - 18:00' },
    { id: 3, name: 'Laboratório de Microbiologia', benches: 8, occupied: 2, nextClass: 'Biossegurança', time: '19:00 - 21:00' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Laboratórios</h1>
          <p className="text-gray-500">Controle de ocupação física e agendamento de bancadas em Boa Vista.</p>
        </div>
        <button className="bg-[#E31E24] text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-50 rounded-sm">
                  <Microscope className="w-6 h-6 text-[#E31E24]" />
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  lab.occupied === lab.benches ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {lab.occupied === lab.benches ? 'Lotado' : 'Disponível'}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">{lab.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> Campus Boa Vista - Bloco B
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Ocupação de Bancadas:</span>
                <span className="font-bold text-gray-800">{lab.occupied} / {lab.benches}</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${lab.occupied === lab.benches ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${(lab.occupied / lab.benches) * 100}%` }}
                />
              </div>
              
              <div className="pt-4 border-t border-gray-50 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Próxima Aula</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">{lab.nextClass}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lab.time}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button className="w-full py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-sm hover:bg-gray-100">
                Ver Mapa de Bancadas
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-sm">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Solicitações de Agendamento</h2>
            <p className="text-xs text-gray-500">Pedidos de professores para aulas extras ou reposições.</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <p className="text-sm font-bold text-gray-800">Prof. Dr. Ricardo Menezes</p>
                  <p className="text-xs text-gray-500">Lab. Anatomia • 15/04 às 14:00 • 20 Alunos</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-600 text-white text-[10px] font-bold rounded uppercase">Aprovar</button>
                <button className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">Recusar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
