import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Search, Filter, X, Download, Send, Check } from 'lucide-react';
import { MOCK_REQUESTS, MOCK_STUDENTS } from '../constants';
import { cn } from '../lib/utils';

export function Requests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAnalyze = (request: any) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'Concluído' } : req
    ));
    setIsModalOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 relative">
      {showSuccess && (
        <div className="fixed top-8 right-8 bg-[#E31E24] text-white px-6 py-4 rounded-sm shadow-2xl z-[60] flex items-center gap-3 animate-in slide-in-from-right duration-300">
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-bold">Solicitação Aprovada!</p>
            <p className="text-xs opacity-90">O documento foi enviado para o portal do aluno.</p>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitações e Requerimentos</h1>
        <p className="text-gray-500">Gerencie pedidos de documentos, trancamentos e outros serviços.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {requests.filter(r => r.status === 'Em Análise' || r.status === 'Pendente').length}
            </p>
            <p className="text-sm text-gray-500">Aguardando Análise</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">05</p>
            <p className="text-sm text-gray-500">Urgentes</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {requests.filter(r => r.status === 'Concluído').length}
            </p>
            <p className="text-sm text-gray-500">Concluídos (Mês)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por aluno ou tipo de solicitação..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24]"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-sm text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Solicitante</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo de Solicitação</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((request) => {
                const student = MOCK_STUDENTS.find(s => s.id === request.studentId);
                return (
                  <tr key={request.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{student?.name}</p>
                      <p className="text-xs text-gray-500">{student?.course}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 rounded-md text-gray-500">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{request.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(request.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        request.status === 'Concluído' ? "bg-green-100 text-green-700" : 
                        request.status === 'Em Análise' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleAnalyze(request)}
                        className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                      >
                        Analisar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 text-white rounded-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Detalhes da Solicitação</h2>
                  <p className="text-xs text-gray-500">Protocolo: #2026040100{selectedRequest.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aluno</p>
                  <p className="text-sm font-bold text-gray-900">
                    {MOCK_STUDENTS.find(s => s.id === selectedRequest.studentId)?.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo</p>
                  <p className="text-sm font-bold text-gray-900">{selectedRequest.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data da Solicitação</p>
                  <p className="text-sm font-bold text-gray-900">{new Date(selectedRequest.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Atual</p>
                  <span className={cn(
                    "inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    selectedRequest.status === 'Concluído' ? "bg-green-100 text-green-700" : 
                    selectedRequest.status === 'Em Análise' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-sm border border-gray-100 space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Documentos Anexados</h3>
                <div className="flex items-center justify-between p-3 bg-white rounded-sm border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-700">Comprovante_Residencia.pdf</span>
                  </div>
                  <button className="text-[#E31E24] hover:underline text-[10px] font-bold uppercase">Visualizar</button>
                </div>
              </div>

              {selectedRequest.status !== 'Concluído' ? (
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-sm text-sm font-bold hover:bg-gray-50 transition-colors"
                  >
                    Indeferir
                  </button>
                  <button 
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="flex-[2] px-6 py-3 bg-[#E31E24] text-white rounded-sm text-sm font-bold hover:bg-[#C1191F] transition-all shadow-lg shadow-[#E31E24]/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Aprovar e Enviar Documento
                  </button>
                </div>
              ) : (
                <div className="pt-4">
                  <div className="bg-green-50 border border-green-100 p-4 rounded-sm flex items-center gap-3 text-green-700">
                    <Check className="w-5 h-5" />
                    <p className="text-sm font-bold">Esta solicitação já foi concluída e o documento enviado.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
