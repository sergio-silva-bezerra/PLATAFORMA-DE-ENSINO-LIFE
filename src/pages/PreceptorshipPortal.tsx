import React from 'react';
import { ClipboardList, Users, MapPin, Calendar, Star, CheckCircle2 } from 'lucide-react';

export default function PreceptorshipPortal() {
  const placements = [
    { id: 1, hospital: 'Hospital Geral de Roraima (HGR)', unit: 'UTI Adulto', students: 5, preceptor: 'Dr. Ricardo Menezes', status: 'Em Andamento' },
    { id: 2, hospital: 'Maternidade Nossa Senhora de Nazaré', unit: 'Centro Obstétrico', students: 3, preceptor: 'Enf. Cláudia Souza', status: 'Iniciando' },
    { id: 3, hospital: 'Hospital da Criança Santo Antônio', unit: 'Pediatria', students: 4, preceptor: 'Enf. Marcos Lima', status: 'Finalizado' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portal de Preceptoria</h1>
          <p className="text-gray-500">Gestão de estágios supervisionados e avaliações em campo.</p>
        </div>
        <button className="bg-[#E31E24] text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Novo Campo de Estágio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Alunos em Campo', value: '42', color: 'blue' },
          { label: 'Hospitais Parceiros', value: '08', color: 'purple' },
          { label: 'Avaliações Pendentes', value: '15', color: 'amber' },
          { label: 'Horas Totais Mês', value: '1.240h', color: 'green' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800 text-sm">Campos de Estágio Ativos</h2>
              <span className="text-xs text-gray-500">Boa Vista, RR</span>
            </div>
            <div className="divide-y divide-gray-100">
              {placements.map((p) => (
                <div key={p.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-50 rounded-sm">
                      <ClipboardList className="w-6 h-6 text-[#E31E24]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{p.hospital}</h3>
                      <p className="text-xs text-gray-500">{p.unit} • Preceptor: {p.preceptor}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                          <Users className="w-3 h-3" /> {p.students} Alunos
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                          <Calendar className="w-3 h-3" /> Seg a Sex, 07h-13h
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.status === 'Em Andamento' ? 'bg-blue-100 text-blue-600' :
                      p.status === 'Iniciando' ? 'bg-amber-100 text-amber-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {p.status}
                    </span>
                    <br />
                    <button className="text-xs font-bold text-[#E31E24] hover:underline">Lançar Notas</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-amber-500" />
              Avaliações Recentes
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Sérgio Silva Bezerra</p>
                    <p className="text-[10px] text-gray-500">Nota: 9.5 • HGR / UTI</p>
                    <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Validado pela Coordenação
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-sm hover:bg-gray-50">
              Ver Todas Avaliações
            </button>
          </div>

          <div className="bg-blue-600 p-6 rounded-sm text-white">
            <h3 className="font-bold mb-2 text-sm">App do Preceptor</h3>
            <p className="text-xs text-blue-100 leading-relaxed mb-4">
              Supervisores podem baixar o app mobile para registrar frequência via QR Code diretamente no hospital.
            </p>
            <button className="w-full py-2 bg-white text-blue-600 text-xs font-bold rounded-sm">
              Gerar Link de Acesso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
