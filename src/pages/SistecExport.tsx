import React, { useState } from 'react';
import { Download, FileCheck, Globe, Database, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function SistecExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [step, setStep] = useState(0);

  const handleExport = () => {
    setIsExporting(true);
    setStep(1);
    setTimeout(() => setStep(2), 1500);
    setTimeout(() => setStep(3), 3000);
    setTimeout(() => {
      setIsExporting(false);
      setStep(4);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exportação SISTEC/MEC</h1>
        <p className="text-gray-500">Validação nacional de diplomas e registros acadêmicos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-sm border border-blue-100">
              <Globe className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-bold text-blue-900">Integração Governamental</h3>
                <p className="text-sm text-blue-700">Este módulo prepara os arquivos XML/CSV conforme o padrão exigido pelo Sistema Nacional de Informações da Educação Profissional e Tecnológica (SISTEC).</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800">Parâmetros de Exportação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Ciclo de Matrícula</label>
                  <select className="w-full p-2 border border-gray-200 rounded-sm text-sm">
                    <option>2026.1 - Técnico em Enfermagem</option>
                    <option>2025.2 - Técnico em Enfermagem</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Tipo de Registro</label>
                  <select className="w-full p-2 border border-gray-200 rounded-sm text-sm">
                    <option>Concluintes (Diplomas)</option>
                    <option>Matrículas Ativas</option>
                    <option>Evasão/Trancamento</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-4 bg-[#E31E24] text-white rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-[#c41a1f] transition-colors disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isExporting ? 'Processando Dados...' : 'Gerar Arquivo de Validação'}
            </button>
          </div>

          {step > 0 && (
            <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800">Log de Processamento</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  {step >= 1 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />}
                  <span className={step >= 1 ? 'text-gray-700' : 'text-gray-400'}>Consolidando registros acadêmicos...</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {step >= 2 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />}
                  <span className={step >= 2 ? 'text-gray-700' : 'text-gray-400'}>Validando CPFs junto à base cadastral...</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {step >= 3 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />}
                  <span className={step >= 3 ? 'text-gray-700' : 'text-gray-400'}>Gerando assinatura digital do lote...</span>
                </div>
                {step === 4 && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-sm border border-green-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5" />
                      <span className="font-bold">Arquivo pronto para download!</span>
                    </div>
                    <button className="text-xs bg-green-600 text-white px-3 py-1 rounded font-bold">Baixar XML</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              Estatísticas SISTEC
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Validado:</span>
                <span className="font-bold text-gray-800">1.240</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Pendentes:</span>
                <span className="font-bold text-amber-600">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Erros de CPF:</span>
                <span className="font-bold text-red-600">2</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-sm border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-amber-900">Atenção</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  A exportação deve ser realizada mensalmente. Alunos não validados no SISTEC não terão seus diplomas reconhecidos nacionalmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
