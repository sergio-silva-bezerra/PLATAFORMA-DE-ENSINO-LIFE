import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Calendar, ArrowRight, Plus, X, Loader2, Link as LinkIcon, FileText, Upload, Download, Eye, Trash2 } from 'lucide-react';
import { getCollection, createCourse, createSubject, db, updateCourseCurriculum, deleteCourse } from '../lib/firebase';
import { where } from 'firebase/firestore';
import { Course, Subject } from '../types';

export function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // Form states
  const [newCourse, setNewCourse] = useState({ name: '', modality: 'Presencial' as any, duration: '' });
  const [newSubject, setNewSubject] = useState({ name: '', courseId: '', tutorId: '', tutorName: '', tutorEmail: '' });
  const [curriculumForm, setCurriculumForm] = useState({ courseId: '', url: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const coursesData = await getCollection('courses') as any;
      const subjectsData = await getCollection('subjects') as any;
      const teachersData = await getCollection('users', [where('role', '==', 'teacher')]) as any;
      
      setCourses(coursesData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error fetching pedagogical data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCourse(newCourse.name, newCourse.modality, newCourse.duration);
      setShowCourseModal(false);
      setNewCourse({ name: '', modality: 'Presencial', duration: '' });
      await fetchData();
    } catch (error: any) {
      console.error("Failed to create course:", error);
      alert("Erro ao criar curso. Verifique suas permissões.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If no teacher is selected from the list, we can still use the manual input if we had one
      // But let's force selection for better logic
      if (!newSubject.tutorId && !newSubject.tutorName) {
        alert("Por favor, selecione ou informe um professor.");
        setLoading(false);
        return;
      }

      await createSubject(newSubject.name, newSubject.courseId, newSubject.tutorName, newSubject.tutorId, newSubject.tutorEmail);
      setShowSubjectModal(false);
      setNewSubject({ name: '', courseId: '', tutorId: '', tutorName: '', tutorEmail: '' });
      await fetchData();
    } catch (error: any) {
      console.error("Failed to create subject:", error);
      alert("Erro ao criar disciplina. Verifique suas permissões.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateCourseCurriculum(curriculumForm.courseId, curriculumForm.url, curriculumForm.text);
      setShowCurriculumModal(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to update curriculum:", error);
      alert("Erro ao atualizar matriz curricular.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o curso "${courseName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setLoading(true);
    try {
      await deleteCourse(courseId);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Erro ao excluir curso. Verifique se existem disciplinas vinculadas.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCurriculum = (course: Course) => {
    setCurriculumForm({
      courseId: course.id,
      url: course.curriculumUrl || '',
      text: course.curriculumText || ''
    });
    setShowCurriculumModal(true);
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
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowSubjectModal(true)}
            className="bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            + Nova Disciplina
          </button>
          <button 
            onClick={() => setShowCourseModal(true)}
            className="bg-[#E31E24] text-white px-6 py-3 rounded-sm font-semibold flex items-center gap-2 hover:bg-[#C1191F] transition-colors shadow-sm"
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
            <div className="grid grid-cols-1 gap-6">
              {courses.map((course) => {
                const courseSubjects = subjects.filter(s => s.courseId === course.id);
                const isExpanded = expandedCourse === course.id;

                return (
                  <div key={course.id} className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden transition-all">
                    <div 
                      className="p-6 cursor-pointer hover:bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-[#E31E24]/10 p-3 rounded-sm text-[#E31E24]">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{course.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded">
                              {course.modality}
                            </span>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Duração: {course.duration}</p>
                            <p className="text-xs text-[#E31E24] font-bold uppercase tracking-wider">{courseSubjects.length} Disciplinas</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {isExpanded ? (
                          <div className="flex items-center gap-2">
                             <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCourse(course.id, course.name);
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                              title="Excluir Curso"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#E31E24]">
                              Ocultar Disciplinas
                              <ArrowRight className="w-4 h-4 rotate-90 transition-transform" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#E31E24]">
                            Ver Disciplinas
                            <ArrowRight className="w-4 h-4 transition-transform" />
                          </div>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-50 bg-gray-50/30 p-6 space-y-4">
                        <div className="flex items-center justify-between bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">Matriz Curricular</h5>
                              <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Gestão de Grade Acadêmica</p>
                            </div>
                            
                            <div className="h-6 w-[1px] bg-gray-100 hidden md:block"></div>

                            {course.curriculumUrl || course.curriculumText ? (
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenCurriculum(course);
                                  }}
                                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E31E24] bg-red-50 px-4 py-2 rounded-sm hover:bg-red-100 transition-all cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Visualizar / Editar
                                </button>
                                {course.curriculumUrl && (
                                  <a 
                                    href={course.curriculumUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-100 px-4 py-2 rounded-sm hover:bg-gray-200 transition-all"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    PDF
                                  </a>
                                )}
                              </div>
                            ) : (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenCurriculum(course);
                                }}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-[#E31E24] px-4 py-2 rounded-sm hover:bg-[#C1191F] transition-all cursor-pointer shadow-lg shadow-[#E31E24]/20"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                Upload Matriz Curricular
                              </button>
                            )}
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewSubject({...newSubject, courseId: course.id});
                              setShowSubjectModal(true);
                            }}
                            className="bg-gray-900 text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10 flex items-center gap-2"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Adicionar Disciplina
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {courseSubjects.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4 italic">Nenhuma disciplina vinculada a este curso.</p>
                          ) : (
                            courseSubjects.map((subject: any) => (
                              <div key={subject.id} className="bg-white flex items-center justify-between p-4 rounded-sm border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-gray-50 rounded-sm flex items-center justify-center text-gray-300">
                                    <Calendar className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900 text-sm">{subject.name}</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-[10px] uppercase font-bold text-gray-400">
                                        Tutor: {subject.tutorName}
                                      </p>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const loginUrl = window.location.origin + '/acesso-professor';
                                          navigator.clipboard.writeText(loginUrl);
                                          alert('Link do Portal do Professor copiado!');
                                        }}
                                        title="Copiar link de acesso para o professor"
                                        className="text-[#E31E24] hover:scale-110 transition-transform p-1"
                                      >
                                        <LinkIcon className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Iniciado em</p>
                                  <p className="text-xs font-semibold text-gray-700">{new Date(subject.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-tight">Todas as Disciplinas</h3>
            <div className="space-y-4">
              {subjects.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Nenhuma disciplina cadastrada no sistema.</p>
              ) : (
                subjects.map((subject: any) => {
                  const courseName = courses.find(c => c.id === subject.courseId)?.name || 'Curso não encontrado';
                  return (
                    <div key={subject.id} className="flex items-center justify-between p-4 rounded-sm border border-gray-50 hover:bg-gray-50/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center text-gray-400">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{subject.name}</p>
                          <p className="text-[11px] uppercase font-bold text-[#E31E24]">
                            {courseName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tutor</p>
                        <div className="flex items-center justify-end gap-2">
                          <p className="text-xs font-semibold text-gray-700">{subject.tutorName}</p>
                          <button 
                            onClick={() => {
                              const loginUrl = window.location.origin + '/acesso-professor';
                              navigator.clipboard.writeText(loginUrl);
                              alert('Link do Portal do Professor copiado!');
                            }}
                            className="text-[#E31E24] hover:scale-110 transition-transform p-1"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
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

            <div className="mt-8 pt-6 border-t border-white/10 italic text-gray-500 text-[10px]">
              Links de acesso individuais disponíveis na listagem de disciplinas.
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professor / Tutor</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  value={newSubject.tutorId}
                  onChange={e => {
                    const selected = teachers.find(t => t.uid === e.target.value);
                    setNewSubject({
                      ...newSubject, 
                      tutorId: e.target.value,
                      tutorName: selected ? selected.name : '',
                      tutorEmail: selected ? (selected.email || '') : ''
                    });
                  }}
                  required
                >
                  <option value="">Selecione um professor</option>
                  {teachers.map(t => <option key={t.uid} value={t.uid}>{t.name}</option>)}
                  <option value="manual">-- Informar Manualmente (Sem Acesso) --</option>
                </select>
                
                {newSubject.tutorId === 'manual' && (
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm mt-2"
                    placeholder="Nome do Professor Externo"
                    value={newSubject.tutorName}
                    onChange={e => setNewSubject({...newSubject, tutorName: e.target.value})}
                    required
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-mail do Professor</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  placeholder="email@professor.com"
                  value={newSubject.tutorEmail}
                  onChange={e => setNewSubject({...newSubject, tutorEmail: e.target.value})}
                  required
                />
                <p className="text-[9px] text-gray-400 italic">Este e-mail será usado para o login provisório do docente.</p>
              </div>
              <button type="submit" className="w-full bg-[#E31E24] text-white py-4 rounded-sm font-black text-xs uppercase tracking-widest mt-4">Criar Disciplina</button>
            </form>
          </div>
        </div>
      )}
      {/* Curriculum Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Matriz Curricular</h2>
              <button onClick={() => setShowCurriculumModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleUpdateCurriculum} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL do PDF da Matriz</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-100 rounded-sm p-3 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <input 
                      type="url" 
                      value={curriculumForm.url}
                      onChange={e => setCurriculumForm({...curriculumForm, url: e.target.value})}
                      className="bg-transparent border-none outline-none w-full text-sm"
                      placeholder="https://exemplo.com/matriz.pdf"
                    />
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 italic">Insira o link direto para o arquivo PDF (OneDrive, Dropbox, Google Drive, etc).</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Texto da Matriz (Visualização Rápida)</label>
                <textarea 
                  value={curriculumForm.text}
                  onChange={e => setCurriculumForm({...curriculumForm, text: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm h-64 resize-none focus:ring-2 focus:ring-[#E31E24]/20"
                  placeholder="Descreva as disciplinas e a grade curricular em formato de texto..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button 
                  type="button"
                  onClick={() => setShowCurriculumModal(false)}
                  className="px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-gray-900 text-white px-8 py-3 rounded-sm font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-black transition-all"
                >
                  Salvar Matriz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
