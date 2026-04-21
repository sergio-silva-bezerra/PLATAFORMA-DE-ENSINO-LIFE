import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Calendar, ArrowRight, Plus, X, Loader2 } from 'lucide-react';
import { getCollection, createCourse, createSubject } from '../lib/firebase';
import { Course, Subject } from '../types';

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  // Form states
  const [newCourse, setNewCourse] = useState({ name: '', modality: 'Presencial' as any, duration: '' });
  const [newSubject, setNewSubject] = useState({ name: '', courseId: '', tutor: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const coursesData = await getCollection('courses') as any;
      const subjectsData = await getCollection('subjects') as any;
      setCourses(coursesData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error fetching pedagogical data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCourse(newCourse.name, newCourse.modality, newCourse.duration);
    setShowCourseModal(false);
    setNewCourse({ name: '', modality: 'Presencial', duration: '' });
    fetchData();
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSubject(newSubject.name, newSubject.courseId, newSubject.tutor);
    setShowSubjectModal(false);
    setNewSubject({ name: '', courseId: '', tutor: '' });
    fetchData();
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E31E24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedagógico: Cursos e Disciplinas</h1>
          <p className="text-gray-500">Gerencie a estrutura curricular e o corpo docente.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowSubjectModal(true)}
            className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            Nova Disciplina
          </button>
          <button 
            onClick={() => setShowCourseModal(true)}
            className="bg-[#E31E24] text-white px-6 py-2.5 rounded-sm font-semibold flex items-center gap-2 hover:bg-[#C1191F] transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Novo Curso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Cursos Ativos ({courses.length})</h3>
          
          {courses.length === 0 ? (
            <div className="bg-white p-12 text-center border border-dashed border-gray-200 rounded-sm">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Nenhum curso cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
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
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        +
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#E31E24]">
                      Detalhes
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Disciplinas Cadastradas</h3>
            <div className="space-y-4">
              {subjects.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Nenhuma disciplina cadastrada.</p>
              ) : (
                subjects.map((subject: any) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 rounded-sm border border-gray-50 hover:border-[#E31E24]/20 hover:bg-gray-50/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center text-gray-400">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{subject.name}</p>
                        <p className="text-[10px] uppercase font-bold text-gray-400">
                          Curse ID: {subject.courseId} | Tutor: {subject.tutorName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Criado em</p>
                      <p className="text-xs font-semibold text-gray-700">{new Date(subject.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#151619] text-white p-6 rounded-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">Resumo Real</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#E31E24]" />
                  <span className="text-sm text-gray-400">Cursos Ativos</span>
                </div>
                <span className="font-bold">{courses.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#E31E24]" />
                  <span className="text-sm text-gray-400">Disciplinas</span>
                </div>
                <span className="font-bold">{subjects.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Novo Curso</h2>
              <button onClick={() => setShowCourseModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nome do Curso</label>
                <input 
                  type="text" 
                  value={newCourse.name}
                  onChange={e => setNewCourse({...newCourse, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm focus:ring-2 focus:ring-[#E31E24]/20"
                  placeholder="Ex: Técnico em Enfermagem"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Modalidade</label>
                  <select 
                    value={newCourse.modality}
                    onChange={e => setNewCourse({...newCourse, modality: e.target.value as any})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Semipresencial">Semipresencial</option>
                    <option value="EAD">EAD</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Duração</label>
                  <input 
                    type="text" 
                    value={newCourse.duration}
                    onChange={e => setNewCourse({...newCourse, duration: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                    placeholder="Ex: 4 Semestres"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#E31E24] text-white py-4 rounded-sm font-black text-xs uppercase tracking-widest mt-4">Criar Curso</button>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Nova Disciplina</h2>
              <button onClick={() => setShowSubjectModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Curso Vinculado</label>
                <select 
                  value={newSubject.courseId}
                  onChange={e => setNewSubject({...newSubject, courseId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  required
                >
                  <option value="">Selecione um curso</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nome da Disciplina</label>
                <input 
                  type="text" 
                  value={newSubject.name}
                  onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  placeholder="Ex: Anatomia Humana"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nome do Professor/Tutor</label>
                <input 
                  type="text" 
                  value={newSubject.tutor}
                  onChange={e => setNewSubject({...newSubject, tutor: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  placeholder="Ex: Dr. Ricardo Santos"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-[#E31E24] text-white py-4 rounded-sm font-black text-xs uppercase tracking-widest mt-4">Criar Disciplina</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
