import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ClipboardList, Clock } from 'lucide-react';

export function SecretariatDashboard() {
  const navigate = useNavigate();
  const stats = [
    { label: 'Novos Alunos', value: '124', icon: Users, color: 'bg-red-600' },
    { label: 'Solicitações Pendentes', value: '45', icon: FileText, color: 'bg-red-500' },
    { label: 'Documentos para Validar', value: '12', icon: ClipboardList, color: 'bg-red-400' },
    { label: 'Tempo Médio Resposta', value: '2.4 dias', icon: Clock, color: 'bg-red-700' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Painel da Secretaria</h1>
        <p className="text-gray-500">Gerencie solicitações acadêmicas e registros de alunos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => {
              if (stat.label === 'Solicitações Pendentes') navigate('/secretaria/solicitacoes');
              if (stat.label === 'Documentos para Validar') navigate('/secretaria/documentos');
              if (stat.label === 'Novos Alunos') navigate('/secretaria/alunos');
            }}
            className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={`${stat.color} p-3 rounded-sm text-white group-hover:scale-110 transition-transform`}>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Solicitações Recentes</h2>
            <button 
              onClick={() => navigate('/secretaria/solicitacoes')}
              className="text-[#E31E24] text-xs font-bold hover:underline"
            >
              Ver Todas
            </button>
          </div>
          <div className="space-y-4">
            {[
              { student: 'Sérgio Silva Bezerra', type: 'Segunda Chamada', date: 'Há 10 min', status: 'Novo' },
              { student: 'Ana Paula Santos', type: 'Dispensa de Disciplina', date: 'Há 25 min', status: 'Em Análise' },
              { student: 'Carlos Eduardo', type: 'Mudança de Curso', date: 'Há 2 horas', status: 'Pendente' },
              { student: 'Juliana Lima', type: 'Transferência', date: 'Há 5 horas', status: 'Concluído' },
            ].map((req, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate('/secretaria/solicitacoes')}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-bold text-gray-800">{req.student}</p>
                  <p className="text-xs text-gray-500">{req.type}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-medium text-gray-400 block mb-1">{req.date}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                    req.status === 'Novo' ? 'bg-red-600 text-white' : 
                    req.status === 'Em Análise' ? 'bg-red-100 text-red-600' : 
                    req.status === 'Concluído' ? 'bg-gray-100 text-gray-500' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Alertas de Documentação</h2>
          <div className="space-y-4">
            {[
              { student: 'Roberto Silva', issue: 'RG Ilegível', status: 'Crítico' },
              { student: 'Marcia Gomes', issue: 'Histórico Pendente', status: 'Atenção' },
              { student: 'Lucas Ferreira', issue: 'Foto de Perfil', status: 'Normal' },
            ].map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-sm">
                <div>
                  <p className="font-bold text-gray-800">{alert.student}</p>
                  <p className="text-xs text-gray-500">{alert.issue}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                  alert.status === 'Crítico' ? 'bg-red-600 text-white shadow-sm' : 
                  alert.status === 'Atenção' ? 'bg-red-100 text-red-600' : 'bg-red-50 text-red-500'
                }`}>
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
