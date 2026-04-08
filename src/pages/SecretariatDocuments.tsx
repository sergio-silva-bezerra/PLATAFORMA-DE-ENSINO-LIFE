import React, { useState } from 'react';
import { Search, Filter, FileText, CheckCircle, XCircle, Clock, Download, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_DOCUMENTS = [
  { id: '1', student: 'Sérgio Silva Bezerra', type: 'RG / CPF', date: '2026-04-01', status: 'Pendente', category: 'Identificação' },
  { id: '2', student: 'Ana Paula Santos', type: 'Histórico Escolar', date: '2026-03-28', status: 'Validado', category: 'Acadêmico' },
  { id: '3', student: 'Carlos Eduardo', type: 'Comprovante de Residência', date: '2026-04-02', status: 'Recusado', category: 'Endereço' },
  { id: '4', student: 'Juliana Lima', type: 'Título de Eleitor', date: '2026-03-25', status: 'Validado', category: 'Identificação' },
];

export function SecretariatDocuments() {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [filter, setFilter] = useState('Todos');

  const handleStatusChange = (id: string, newStatus: 'Validado' | 'Recusado') => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, status: newStatus } : doc
    ));
  };

  const filteredDocs = documents.filter(doc => 
    filter === 'Todos' || doc.status === filter
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Documentos</h1>
          <p className="text-gray-500">Valide e gerencie a documentação enviada pelos alunos para matrícula e solicitações.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total', value: documents.length, icon: FileText, color: 'bg-gray-500' },
          { label: 'Pendentes', value: documents.filter(d => d.status === 'Pendente').length, icon: Clock, color: 'bg-orange-500' },
          { label: 'Validados', value: documents.filter(d => d.status === 'Validado').length, icon: CheckCircle, color: 'bg-green-500' },
          { label: 'Recusados', value: documents.filter(d => d.status === 'Recusado').length, icon: XCircle, color: 'bg-red-500' },
        ].map((stat, idx) => (
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por aluno ou documento..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24]"
            />
          </div>
          <div className="flex gap-2">
            {['Todos', 'Pendente', 'Validado', 'Recusado'].map((s) => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                  filter === s 
                    ? "bg-[#E31E24] text-white shadow-lg shadow-[#E31E24]/20" 
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data Envio</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{doc.student}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 font-medium">{doc.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{doc.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(doc.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      doc.status === 'Validado' ? "bg-green-100 text-green-700" : 
                      doc.status === 'Pendente' ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                    )}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#E31E24] hover:bg-gray-50 rounded-lg transition-colors" title="Visualizar">
                        <Eye className="w-4 h-4" />
                      </button>
                      {doc.status === 'Pendente' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(doc.id, 'Validado')}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Validar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(doc.id, 'Recusado')}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Recusar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
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
