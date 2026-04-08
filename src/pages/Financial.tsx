import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Download, Search, Filter } from 'lucide-react';
import { MOCK_PAYMENTS, MOCK_STUDENTS } from '../constants';
import { cn } from '../lib/utils';

export function Financial() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro: Gestão de Cobranças</h1>
          <p className="text-gray-500">Controle de mensalidades, inadimplência e faturamento.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </button>
          <button className="bg-[#E31E24] text-white px-6 py-2.5 rounded-sm font-semibold hover:bg-[#C1191F] transition-colors shadow-sm">
            Gerar Boletos em Lote
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-sm">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-sm">+14.2%</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Recebido (Mês)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">R$ 84.230,00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">128 pendentes</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">A Receber</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">R$ 58.270,00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">5.2% taxa</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Inadimplência</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">R$ 12.450,00</p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por aluno ou número do boleto..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-sm text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrar por Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PAYMENTS.map((payment) => {
                const student = MOCK_STUDENTS.find(s => s.id === payment.studentId);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{student?.name}</p>
                      <p className="text-xs text-gray-500">Mat: {student?.registration}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">R$ {payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        payment.status === 'Pago' ? "bg-green-100 text-green-700" : 
                        payment.status === 'Pendente' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      )}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#E31E24] hover:underline text-sm font-bold">
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
