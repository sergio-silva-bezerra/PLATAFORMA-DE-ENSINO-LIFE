import React from 'react';
import { ChevronRight, HelpCircle, FileText, FilePlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const activities = [
  {
    id: '1',
    name: 'Avaliação Institucional 20252',
    date: '23/10/2025',
    status: 'Aprovada',
    sentHours: '3h',
    approvedHours: '3h',
  },
  {
    id: '2',
    name: 'Avaliação Institucional 20251',
    date: '08/05/2025',
    status: 'Aprovada',
    sentHours: '3h',
    approvedHours: '3h',
  },
  {
    id: '3',
    name: 'Avaliação Institucional 20242',
    date: '03/10/2024',
    status: 'Aprovada',
    sentHours: '3h',
    approvedHours: '3h',
  },
  {
    id: '4',
    name: 'Avaliação Institucional 20241',
    date: '05/06/2024',
    status: 'Aprovada',
    sentHours: '3h',
    approvedHours: '3h',
  },
];

export function ComplementaryActivities() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Filmmaker</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#E31E24]">Atividades Complementares</span>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Section: Activities Table */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-2xl font-bold text-gray-800">Atividades</h1>
              
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Certificados</th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Incluso em</th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Horas Enviadas</th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Horas Aprovadas</th>
                      <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Baixar Atividade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="text-[11px] font-bold text-gray-700 leading-tight">{activity.name}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-[11px] font-bold text-gray-500">{activity.date}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-[11px] font-bold text-[#E31E24]">{activity.status}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <p className="text-[11px] font-bold text-gray-700">{activity.sentHours}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <p className="text-[11px] font-bold text-gray-700">{activity.approvedHours}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button className="text-[#E31E24] hover:scale-110 transition-transform inline-block">
                            <FileText className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <select className="bg-white border border-gray-200 rounded px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20">
                  <option>- Status das atividades -</option>
                  <option>Aprovada</option>
                  <option>Pendente</option>
                  <option>Reprovada</option>
                </select>

                <button className="flex items-center gap-2 text-[#E31E24] text-[10px] font-bold uppercase tracking-widest hover:underline">
                  Adicionar Atividade
                  <FilePlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Section: Progress Chart */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800">Carga Horária</h2>
              
              <div className="flex flex-col items-center space-y-6">
                {/* Legend */}
                <div className="w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#E31E24] rounded-full"></div>
                    <span className="text-[10px] font-bold text-gray-500">Horas concluídas - 15h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                    <span className="text-[10px] font-bold text-gray-400">Horas a concluir - 25h</span>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-gray-100"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={`${(15 / 40) * 251.2} 251.2`}
                      className="text-[#E31E24]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-[#E31E24]">15h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      </div>

      {/* Floating Help Button */}
      <button className="fixed bottom-8 right-8 bg-[#E31E24] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50">
        <HelpCircle className="w-8 h-8" />
      </button>
    </div>
  );
}
