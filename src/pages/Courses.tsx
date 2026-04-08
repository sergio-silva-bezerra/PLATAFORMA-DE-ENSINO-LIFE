import React from 'react';
import { BookOpen, Users, Calendar, ArrowRight, Plus } from 'lucide-react';
import { MOCK_COURSES, MOCK_SUBJECTS } from '../constants';

export function Courses() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedagógico: Cursos e Disciplinas</h1>
          <p className="text-gray-500">Gerencie a estrutura curricular e o corpo docente.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            Nova Disciplina
          </button>
          <button className="bg-[#E31E24] text-white px-6 py-2.5 rounded-sm font-semibold flex items-center gap-2 hover:bg-[#C1191F] transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Novo Curso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Cursos Ativos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_COURSES.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-[#E31E24]/10 p-3 rounded-sm text-[#E31E24]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md">
                    {course.modality}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#E31E24] transition-colors">{course.name}</h4>
                <p className="text-sm text-gray-500 mt-1">Duração: {course.duration}</p>
                
                <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                        P{i}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#E31E24]">
                    Detalhes
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Disciplinas do Semestre</h3>
            <div className="space-y-4">
              {MOCK_SUBJECTS.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-4 rounded-sm border border-gray-50 hover:border-[#E31E24]/20 hover:bg-gray-50/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center text-gray-400">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{subject.name}</p>
                      <p className="text-xs text-gray-500">Tutor: {subject.tutor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Início</p>
                    <p className="text-sm font-semibold text-gray-700">{new Date(subject.startDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#151619] text-white p-6 rounded-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">Resumo Pedagógico</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#E31E24]" />
                  <span className="text-sm text-gray-400">Professores</span>
                </div>
                <span className="font-bold">42</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#E31E24]" />
                  <span className="text-sm text-gray-400">Disciplinas</span>
                </div>
                <span className="font-bold">156</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
                <div className="bg-[#E31E24] h-2 rounded-full w-[75%]"></div>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Conclusão de Semestre: 75%</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              {['Lançar Notas', 'Quadro de Horários', 'Alocação de Tutores', 'Relatórios Finais'].map((action) => (
                <button key={action} className="w-full text-left px-4 py-3 rounded-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#E31E24] transition-all flex items-center justify-between group">
                  {action}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
