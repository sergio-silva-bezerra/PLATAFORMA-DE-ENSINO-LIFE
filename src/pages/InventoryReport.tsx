import React from 'react';
import { Package, AlertTriangle, TrendingDown, RefreshCw, Download, Filter } from 'lucide-react';

export default function InventoryReport() {
  const items = [
    { id: 1, name: 'Seringas 5ml (Descartáveis)', category: 'Consumíveis', stock: 1200, min: 500, unit: 'un', status: 'OK' },
    { id: 2, name: 'Luvas de Procedimento (M)', category: 'EPI', stock: 15, min: 20, unit: 'caixas', status: 'Crítico' },
    { id: 3, name: 'Gaze Estéril (Pacote)', category: 'Consumíveis', stock: 45, min: 50, unit: 'pacotes', status: 'Baixo' },
    { id: 4, name: 'Álcool 70% (1L)', category: 'Saneantes', stock: 24, min: 10, unit: 'frascos', status: 'OK' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatório de Insumos</h1>
          <p className="text-gray-500">Controle de estoque de materiais descartáveis para aulas presenciais.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="bg-[#E31E24] text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Total Itens</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Cadastrados no sistema</p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">Crítico</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">08</p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Abaixo do estoque mínimo</p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <TrendingDown className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Consumo</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">+12%</p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Aumento vs mês anterior</p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <RefreshCw className="w-5 h-5 text-green-500" />
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Pedidos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">03</p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Ordens de compra ativas</p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Estoque de Materiais - Campus Boa Vista</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
              <th className="px-6 py-4">Insumo / Material</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Estoque Atual</th>
              <th className="px-6 py-4">Mínimo</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="text-sm hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                <td className="px-6 py-4 text-gray-600">{item.category}</td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${item.status === 'Crítico' ? 'text-red-600' : item.status === 'Baixo' ? 'text-amber-600' : 'text-gray-800'}`}>
                    {item.stock} {item.unit}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{item.min} {item.unit}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    item.status === 'OK' ? 'bg-green-100 text-green-600' :
                    item.status === 'Baixo' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-[#E31E24] font-bold hover:underline">Repor Estoque</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 p-6 rounded-sm border border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-sm">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900">Reposição Automática</h3>
            <p className="text-sm text-blue-700">O sistema gera automaticamente sugestões de compra quando o estoque atinge o nível crítico.</p>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-sm font-bold text-sm">Configurar Alertas</button>
      </div>
    </div>
  );
}
