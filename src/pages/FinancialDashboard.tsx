import React from 'react';
import { DollarSign, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';

export function FinancialDashboard() {
  const stats = [
    { label: 'Receita Mensal', value: 'R$ 45.230,00', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Pagamentos Pendentes', value: 'R$ 12.450,00', icon: CreditCard, color: 'bg-blue-500' },
    { label: 'Crescimento', value: '+12.5%', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Inadimplência', value: '4.2%', icon: AlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Painel Financeiro</h1>
        <p className="text-gray-500">Gerencie pagamentos, negociações e relatórios financeiros.</p>
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
          <h2 className="text-xl font-bold text-gray-900">Pagamentos Recentes</h2>
          <div className="space-y-4">
            {[
              { student: 'Sérgio Silva Bezerra', value: 'R$ 450,00', method: 'PIX', date: 'Há 5 min', status: 'Confirmado' },
              { student: 'Ana Paula Santos', value: 'R$ 450,00', method: 'Boleto', date: 'Há 45 min', status: 'Pendente' },
              { student: 'Carlos Eduardo', value: 'R$ 1.200,00', method: 'Cartão', date: 'Há 2 horas', status: 'Confirmado' },
              { student: 'Juliana Lima', value: 'R$ 320,00', method: 'Boleto', date: 'Há 5 horas', status: 'Atrasado' },
            ].map((pay, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-bold text-gray-800">{pay.student}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">{pay.method}</p>
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      pay.status === 'Confirmado' ? 'bg-green-100 text-green-600' : 
                      pay.status === 'Pendente' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {pay.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#E31E24]">{pay.value}</p>
                  <span className="text-[10px] font-medium text-gray-400">{pay.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Negociações em Aberto</h2>
          <div className="space-y-4">
            {[
              { student: 'Roberto Silva', value: 'R$ 2.450,00', status: 'Em Análise' },
              { student: 'Marcia Gomes', value: 'R$ 1.100,00', status: 'Aguardando' },
              { student: 'Lucas Ferreira', value: 'R$ 850,00', status: 'Aprovado' },
            ].map((neg, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-bold text-gray-800">{neg.student}</p>
                  <p className="text-xs text-gray-500">{neg.value}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                  neg.status === 'Em Análise' ? 'bg-blue-100 text-blue-600' : 
                  neg.status === 'Aguardando' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                }`}>
                  {neg.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
