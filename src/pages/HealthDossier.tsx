import React from 'react';
import { ShieldCheck, FileText, Syringe, HeartPulse, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function HealthDossier() {
  const students = [
    { id: 1, name: 'Sérgio Silva Bezerra', course: 'Técnico em Enfermagem', vaccination: 'Completa', insurance: 'Ativa', status: 'Apto' },
    { id: 2, name: 'Maria Oliveira', course: 'Técnico em Enfermagem', vaccination: 'Pendente (Hepatite B)', insurance: 'Ativa', status: 'Restrito' },
    { id: 3, name: 'João Santos', course: 'Técnico em Enfermagem', vaccination: 'Completa', insurance: 'Vencida', status: 'Bloqueado' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dossiê de Saúde</h1>
          <p className="text-gray-500">Controle de vacinação e apólices de seguro para estágio.</p>
        </div>
        <button className="bg-[#E31E24] text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Relatório de Aptidão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-sm">
              <Syringe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Vacinação em Dia</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[85%]"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-sm">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Seguros Ativos</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[92%]"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-sm">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pendências Críticas</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
          <p className="text-xs text-red-500 mt-2 font-medium">Alunos impedidos de iniciar estágio.</p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Status de Saúde por Aluno</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
              <th className="px-6 py-4">Aluno</th>
              <th className="px-6 py-4">Carteira de Vacinação</th>
              <th className="px-6 py-4">Seguro de Acidentes</th>
              <th className="px-6 py-4">Status Estágio</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr key={student.id} className="text-sm hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.course}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {student.vaccination === 'Completa' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className={student.vaccination === 'Completa' ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                      {student.vaccination}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={student.insurance === 'Ativa' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {student.insurance}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    student.status === 'Apto' ? 'bg-green-100 text-green-600' :
                    student.status === 'Restrito' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-[#E31E24] font-bold hover:underline">Ver Dossiê</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
