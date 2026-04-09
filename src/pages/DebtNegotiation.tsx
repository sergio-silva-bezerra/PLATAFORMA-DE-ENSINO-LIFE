import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const debts = [
  { id: '1', description: 'MENSALIDADE REPOSIÇÃO DE DISCIPLINA - DIGITAL - EAD', code: '19228915', status: 'ATRASADO', dueDate: '01/03/2026', value: 150.32, fine: 1.50, interest: 0.75, total: 152.57 },
  { id: '2', description: 'ACORDO', code: '18866785', status: 'ATRASADO', dueDate: '02/03/2026', value: 109.12, fine: 1.09, interest: 0.53, total: 110.74 },
  { id: '3', description: 'ACORDO', code: '18866786', status: 'ATRASADO', dueDate: '30/03/2026', value: 109.12, fine: 1.09, interest: 0.02, total: 110.23 },
];

export function DebtNegotiation() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalNegotiation = debts
    .filter(d => selected.includes(d.id))
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">TÉCNICO EM ENFERMAGEM - LIFE - Alcindo Cacela</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">RESPONSÁVEL FINANCEIRO</p>
            <p className="text-sm font-bold text-gray-600 uppercase">SÉRGIO SILVA BEZERRA</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-800">Mensalidades, acordos, renegociações e outros</h3>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-4 py-3 w-12"></th>
                  <th className="px-4 py-3">DESCRIÇÃO</th>
                  <th className="px-4 py-3 text-center">STATUS</th>
                  <th className="px-4 py-3 text-center">VENCIMENTO</th>
                  <th className="px-4 py-3 text-center">VALOR</th>
                  <th className="px-4 py-3 text-center">MULTA</th>
                  <th className="px-4 py-3 text-center">JUROS</th>
                  <th className="px-4 py-3 text-right">TOTAL DA NEGOCIAÇÃO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {debts.map((debt) => (
                  <tr key={debt.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-6">
                      <input 
                        type="checkbox" 
                        checked={selected.includes(debt.id)}
                        onChange={() => toggleSelect(debt.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#E31E24] focus:ring-[#E31E24]"
                      />
                    </td>
                    <td className="px-4 py-6">
                      <p className="text-[10px] font-bold text-gray-600 leading-relaxed">{debt.description}</p>
                      <p className="text-[10px] text-gray-400">outro - Cód. {debt.code}</p>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <span className="px-3 py-1 bg-red-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                        {debt.status}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-center text-[10px] font-bold text-gray-600">{debt.dueDate}</td>
                    <td className="px-4 py-6 text-center text-[10px] font-bold text-gray-600">R${debt.value.toFixed(2).replace('.', ',')}</td>
                    <td className="px-4 py-6 text-center">
                      <p className="text-[9px] text-gray-400">De R$3,01</p>
                      <p className="text-[10px] font-bold text-gray-600">Por R${debt.fine.toFixed(2).replace('.', ',')}</p>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <p className="text-[9px] text-gray-400">De R$1,50</p>
                      <p className="text-[10px] font-bold text-gray-600">Por R${debt.interest.toFixed(2).replace('.', ',')}</p>
                    </td>
                    <td className="px-4 py-6 text-right text-[10px] font-bold text-gray-600">R${debt.total.toFixed(2).replace('.', ',')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-gray-100">
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-gray-400 uppercase tracking-tight">Valor total a ser negociado</h4>
            <p className="text-2xl font-bold text-gray-700">R${totalNegotiation.toFixed(2).replace('.', ',')}</p>
          </div>
          <button 
            disabled={selected.length === 0}
            className={cn(
              "px-12 py-4 rounded font-black text-sm uppercase tracking-widest transition-all",
              selected.length > 0 
                ? "bg-[#E31E24] text-white hover:bg-[#C1191F] shadow-lg shadow-red-100" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            Confirmar Negociação
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
