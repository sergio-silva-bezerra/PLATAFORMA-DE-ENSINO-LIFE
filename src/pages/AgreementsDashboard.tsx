import React from 'react';
import { Handshake, FileText, Calendar, Building2, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export default function AgreementsDashboard() {
  const agreements = [
    { id: 1, partner: 'Hospital Geral de Roraima', type: 'Convênio de Estágio', expiry: '15/12/2027', status: 'Vigente', slots: 50 },
    { id: 2, partner: 'Maternidade Nossa Sra. Nazaré', type: 'Convênio de Estágio', expiry: '20/06/2026', status: 'Vigente', slots: 30 },
    { id: 3, partner: 'Clínica Santa Maria', type: 'Cooperação Técnica', expiry: '10/05/2026', status: 'Renovação', slots: 10 },
    { id: 4, partner: 'Posto de Saúde Central', type: 'Convênio de Estágio', expiry: '01/01/2026', status: 'Vencido', slots: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Convênios</h1>
          <p className="text-gray-500">Gestão de contratos com hospitais e clínicas parceiras em Roraima.</p>
        </div>
        <button className="bg-[#E31E24] text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Convênio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-sm">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Parceiros Ativos</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-sm">
            <Handshake className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Vagas de Estágio</p>
            <p className="text-2xl font-bold text-gray-900">105</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-sm">
            <FileText className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Em Renovação</p>
            <p className="text-2xl font-bold text-gray-900">03</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">Contratos de Cooperação</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="Buscar parceiro..." className="text-xs p-2 border border-gray-200 rounded-sm w-64" />
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
              <th className="px-6 py-4">Instituição Parceira</th>
              <th className="px-6 py-4">Tipo de Contrato</th>
              <th className="px-6 py-4">Vencimento</th>
              <th className="px-6 py-4">Vagas</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agreements.map((a) => (
              <tr key={a.id} className="text-sm hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800">{a.partner}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Boa Vista, RR</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{a.type}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {a.expiry}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-700">{a.slots}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    a.status === 'Vigente' ? 'bg-green-100 text-green-600' :
                    a.status === 'Renovação' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button className="text-blue-600 font-bold hover:underline">Editar</button>
                    <button className="text-[#E31E24] font-bold hover:underline">PDF</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Últimas Atividades
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 text-sm border-l-2 border-gray-100 pl-4 py-1">
                <div>
                  <p className="text-gray-800 font-medium">Renovação de contrato enviada para assinatura digital.</p>
                  <p className="text-xs text-gray-500">Hospital da Criança • Há 2 horas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-sm border border-amber-100">
          <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Alertas de Vencimento
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-sm border border-amber-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700">Clínica Santa Maria</span>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">Vence em 30 dias</span>
            </div>
            <div className="p-3 bg-white rounded-sm border border-amber-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700">Posto de Saúde Central</span>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">Vencido</span>
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-sm">Iniciar Processo de Renovação</button>
        </div>
      </div>
    </div>
  );
}
