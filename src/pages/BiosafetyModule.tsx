import React from 'react';
import { ShieldAlert, Lock, Unlock, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

export default function BiosafetyModule() {
  const modules = [
    { id: 1, title: 'Introdução à Biossegurança em Saúde', status: 'Concluído', score: 100 },
    { id: 2, title: 'Equipamentos de Proteção Individual (EPIs)', status: 'Concluído', score: 95 },
    { id: 3, title: 'Descarte de Resíduos Infectantes', status: 'Pendente', score: 0 },
    { id: 4, title: 'Protocolos de Higienização das Mãos', status: 'Bloqueado', score: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Módulo de Biossegurança</h1>
        <p className="text-gray-500">Requisito obrigatório para acesso aos laboratórios e campos de estágio.</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-sm flex items-start gap-4">
        <ShieldAlert className="w-8 h-8 text-amber-600 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-amber-900">Trava de Segurança Ativa</h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            Conforme as normas da instituição, o agendamento de aulas práticas e estágios está condicionado à conclusão de 100% dos módulos de biossegurança com nota mínima de 8.0.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-gray-800">Trilha de Aprendizagem</h2>
          <div className="space-y-3">
            {modules.map((m) => (
              <div key={m.id} className={`p-6 rounded-sm border ${
                m.status === 'Concluído' ? 'bg-white border-green-100' :
                m.status === 'Pendente' ? 'bg-white border-amber-100' :
                'bg-gray-50 border-gray-100'
              } flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-sm ${
                    m.status === 'Concluído' ? 'bg-green-100' :
                    m.status === 'Pendente' ? 'bg-amber-100' :
                    'bg-gray-200'
                  }`}>
                    {m.status === 'Concluído' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> :
                     m.status === 'Pendente' ? <BookOpen className="w-5 h-5 text-amber-600" /> :
                     <Lock className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${m.status === 'Bloqueado' ? 'text-gray-400' : 'text-gray-800'}`}>
                      {m.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">
                      {m.status} {m.status === 'Concluído' && `• Nota: ${m.score}`}
                    </p>
                  </div>
                </div>
                {m.status !== 'Bloqueado' && (
                  <button className={`px-4 py-1.5 rounded-sm text-xs font-bold ${
                    m.status === 'Concluído' ? 'text-green-600 border border-green-200 hover:bg-green-50' :
                    'bg-[#E31E24] text-white hover:bg-[#c41a1f]'
                  }`}>
                    {m.status === 'Concluído' ? 'Revisar' : 'Iniciar Módulo'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm text-center space-y-4">
            <div className="inline-flex p-4 bg-red-50 rounded-full">
              <Lock className="w-10 h-10 text-[#E31E24]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Status de Acesso Prático</h3>
              <p className="text-2xl font-black text-red-600 mt-1 uppercase">Bloqueado</p>
            </div>
            <p className="text-xs text-gray-500">
              Você ainda possui 2 módulos pendentes. Conclua-os para liberar seu agendamento de laboratório.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Regras do Laboratório
            </h3>
            <ul className="space-y-3">
              {[
                'Uso obrigatório de jaleco branco.',
                'Sapatos fechados e cabelos presos.',
                'Proibido consumo de alimentos.',
                'Descarte correto de perfurocortantes.'
              ].map((rule, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
