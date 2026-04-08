import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, Home, FileText, Clock, CheckCircle2, AlertCircle, Download } from 'lucide-react';

export function StudentSecretariat() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const getTitle = (type: string | null) => {
    switch (type) {
      case 'segunda-chamada': return 'Segunda Chamada';
      case 'dispensa': return 'Dispensa de Disciplinas';
      case 'mudanca-curso': return 'Mudança de Curso';
      case 'transferencia-faculdade': return 'Transferência de Faculdade';
      case 'transferencia-polo': return 'Transferência de Polo EAD';
      case 'mudanca-turma': return 'Mudança de Turma';
      case 'mudanca-turno': return 'Mudança de Turno';
      case 'incluir-excluir': return 'Incluir/Excluir Disciplinas';
      case 'abrir-chamado': return 'Abrir Chamado';
      case 'acompanhar-chamados': return 'Acompanhar Chamados';
      case 'declaracoes': return 'Declarações e Históricos';
      case 'documentos': return 'Meus Documentos';
      case 'certificados': return 'Certificados e Diplomas';
      case 'estagios': return 'Portal de Estágios';
      default: return 'Secretaria Virtual';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <Home className="w-3 h-3" />
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#E31E24]">Solicitações</span>
        <ChevronRight className="w-3 h-3" />
        <span>{getTitle(type)}</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-1 flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{getTitle(type)}</h1>
          <p className="text-sm text-gray-500">Realize suas solicitações acadêmicas de forma rápida e segura através do nosso portal.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-[#E31E24] text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-[#C1191F] transition-colors">
            Nova Solicitação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {type === 'documentos' || type === 'declaracoes' || type === 'certificados' ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Documentos Disponíveis</h2>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total: 3</span>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { name: 'Declaração de Matrícula - 2026.1', date: '01/04/2026', size: '1.2 MB' },
                  { name: 'Histórico Escolar Parcial', date: '15/03/2026', size: '2.4 MB' },
                  { name: 'Comprovante de Vínculo Acadêmico', date: '10/02/2026', size: '0.8 MB' },
                ].map((doc, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-[#E31E24]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{doc.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Emitido em: {doc.date} • {doc.size}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#E31E24] text-[#E31E24] rounded text-[10px] font-bold uppercase tracking-wider hover:bg-[#E31E24]/5 transition-colors">
                      <Download className="w-3 h-3" />
                      Baixar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Minhas Solicitações Recentes</h2>
                <button className="text-[#E31E24] text-[10px] font-bold uppercase hover:underline">Ver todas</button>
              </div>
              <div className="divide-y divide-gray-50">
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{getTitle(type)}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Protocolo: #2026040100{i} • 01/04/2026</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold rounded-full uppercase tracking-wider">
                        Em Análise
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-blue-900">Informação Importante</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                O prazo médio para análise desta solicitação é de 5 dias úteis. Certifique-se de anexar todos os documentos necessários para evitar atrasos no processo.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Status do Processo</h3>
            <div className="space-y-6">
              {[
                { label: 'Solicitação Realizada', date: '01/04/2026', done: true },
                { label: 'Validação de Documentos', date: '01/04/2026', done: true },
                { label: 'Análise Acadêmica', date: 'Pendente', done: false },
                { label: 'Conclusão', date: 'Pendente', done: false },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {idx < 3 && (
                    <div className={`absolute left-2.5 top-6 w-0.5 h-6 ${step.done ? 'bg-[#E31E24]' : 'bg-gray-100'}`} />
                  )}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${step.done ? 'bg-[#E31E24] text-white' : 'bg-gray-100 text-gray-300'}`}>
                    {step.done ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className={`text-[11px] font-bold ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</p>
                    <p className="text-[9px] text-gray-400">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 text-white space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest">Dúvidas?</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Consulte nossa base de conhecimento ou entre em contato com o suporte acadêmico.</p>
            <button className="w-full py-2.5 bg-white text-gray-900 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors">
              Central de Ajuda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
