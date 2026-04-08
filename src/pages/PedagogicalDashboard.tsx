import React from 'react';
import { GraduationCap, Users, BookOpen, BarChart3, Clock, CheckCircle } from 'lucide-react';

export function PedagogicalDashboard() {
  const stats = [
    { label: 'Turmas Ativas', value: '12', icon: GraduationCap, color: 'bg-purple-500' },
    { label: 'Alunos Matriculados', value: '450', icon: Users, color: 'bg-blue-500' },
    { label: 'Média de Desempenho', value: '8.4', icon: BarChart3, color: 'bg-green-500' },
    { label: 'Frequência Média', value: '92%', icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Painel Pedagógico</h1>
        <p className="text-gray-500">Gestão acadêmica, acompanhamento de turmas e desempenho de alunos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Acompanhamento de Turmas</h2>
          <div className="space-y-4">
            {[
              { course: 'Direção em Cinema', module: 'Módulo B', progress: 75, status: 'Em andamento' },
              { course: 'Produção Audiovisual', module: 'Módulo A', progress: 100, status: 'Concluído' },
              { course: 'Roteiro para Cinema', module: 'Módulo C', progress: 30, status: 'Iniciando' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{item.course}</p>
                    <p className="text-xs text-gray-500">{item.module}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                    item.status === 'Concluído' ? 'bg-green-100 text-green-600' : 
                    item.status === 'Em andamento' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-[#E31E24] h-1.5 rounded-full transition-all" 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Alertas de Desempenho</h2>
          <div className="space-y-4">
            {[
              { student: 'Sérgio Silva Bezerra', issue: 'Excelente desempenho em Cinema', type: 'Positivo' },
              { student: 'Marcia Gomes', issue: 'Baixa frequência em Roteiro', type: 'Atenção' },
              { student: 'Lucas Ferreira', issue: 'Atividade pendente há 3 dias', type: 'Alerta' },
            ].map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    alert.type === 'Positivo' ? 'bg-green-100 text-green-600' : 
                    alert.type === 'Atenção' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {alert.type === 'Positivo' ? <CheckCircle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{alert.student}</p>
                    <p className="text-[10px] text-gray-500">{alert.issue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
