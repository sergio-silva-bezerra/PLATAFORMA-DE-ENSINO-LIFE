import React from 'react';
import { Search, ChevronRight, CreditCard, QrCode, ArrowRightLeft, Home } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const payments = [
  { id: '1', description: 'Mensalidade Reposição de Disciplina - Digital - EAD', period: 'DEZ/2025 - Técnico em Enfermagem', value: 'R$ 154,82', dueDate: '01/03/2026', status: 'Atrasado', canNegotiate: true },
  { id: '2', description: 'Acordo', period: 'OUT/2025 - Técnico em Enfermagem', value: 'R$ 112,34', dueDate: '02/03/2026', status: 'Atrasado', canNegotiate: true },
  { id: '3', description: 'Acordo', period: 'OUT/2025 - Técnico em Enfermagem', value: 'R$ 111,34', dueDate: '30/03/2026', status: 'Atrasado', canNegotiate: true },
  { id: '4', description: 'Mensalidade Reposição de Disciplina - Digital - EAD', period: 'JAN/2026 - Técnico em Enfermagem', value: 'R$ 150,32', dueDate: '01/04/2026', status: 'A vencer', canNegotiate: false },
  { id: '5', description: 'Acordo', period: 'OUT/2025 - Técnico em Enfermagem', value: 'R$ 109,12', dueDate: '29/04/2026', status: 'A vencer', canNegotiate: false },
  { id: '6', description: 'Mensalidade Reposição de Disciplina - Digital - EAD', period: 'FEV/2026 - Técnico em Enfermagem', value: 'R$ 150,32', dueDate: '01/05/2026', status: 'A vencer', canNegotiate: false },
];

export function StudentPayments() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <Home className="w-3 h-3" />
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#E31E24]">Carteira digital</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#E31E24]">Pagamentos</span>
        <ChevronRight className="w-3 h-3" />
        <span>A Pagar</span>
      </nav>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-800">Pagamentos</h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Veja seus pagamentos pendentes e o histórico de títulos quitados. Clique nas setas para visualizar seu detalhamento.</p>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Conectado ao Setor Financeiro</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-100">
        <button className="py-2 text-xs font-bold text-[#E31E24] border-b-2 border-[#E31E24]">A pagar</button>
        <button className="py-2 text-xs font-bold text-gray-400 border-b-2 border-transparent hover:text-gray-600">Histórico</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar" 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#E31E24]"
          />
        </div>
        <select className="bg-white border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#E31E24]">
          <option>Filtrar por todos os cursos</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-800 uppercase tracking-wider">Cobrança</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-800 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-800 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-800 uppercase tracking-wider">Situação</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-800 uppercase tracking-wider">Opções de pagamento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-800 uppercase tracking-wider text-right">Mais opções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[10px] text-gray-400 font-medium">{p.description}</p>
                    <p className="text-xs font-bold text-gray-800">{p.period}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-700">{p.value}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-700">{p.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider",
                      p.status === 'Atrasado' ? "bg-red-500" : "bg-blue-400"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E31E24] text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#C1191F]">
                        <QrCode className="w-3 h-3" />
                        PIX
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E31E24] text-[#E31E24] rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#E31E24]/5">
                        <CreditCard className="w-3 h-3" />
                        Crédito
                      </button>
                      {p.canNegotiate && (
                        <Link 
                          to="/aluno/carteira/negociacao"
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E31E24] text-[#E31E24] rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#E31E24]/5"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          Negociação
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#E31E24] hover:bg-gray-100 p-1 rounded transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
