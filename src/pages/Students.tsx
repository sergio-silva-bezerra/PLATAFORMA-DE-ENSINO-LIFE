import React from 'react';
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';
import { cn } from '../lib/utils';

export function Students() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Secretaria: Gestão de Alunos</h1>
          <p className="text-gray-500">Visualize e gerencie todos os alunos matriculados.</p>
        </div>
        <button className="bg-[#E31E24] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-[#C1191F] transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Novo Aluno
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nome, CPF ou matrícula..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24]"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Matrícula</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Curso</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Financeiro</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E31E24]/10 flex items-center justify-center text-[#E31E24] font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{student.registration}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.course}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      student.status === 'Ativo' ? "bg-green-100 text-green-700" : 
                      student.status === 'Trancado' ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-medium",
                      student.financialStatus === 'Em dia' ? "text-green-600" : 
                      student.financialStatus === 'Pendente' ? "text-amber-600" : "text-red-600"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        student.financialStatus === 'Em dia' ? "bg-green-600" : 
                        student.financialStatus === 'Pendente' ? "bg-amber-600" : "bg-red-600"
                      )} />
                      {student.financialStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-[#E31E24] hover:bg-[#E31E24]/5 rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#E31E24] hover:bg-[#E31E24]/5 rounded-lg transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
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
