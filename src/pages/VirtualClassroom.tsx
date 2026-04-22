import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Home, 
  BookOpen, 
  PenTool, 
  BarChart2, 
  AlertTriangle, 
  ClipboardList, 
  MessageSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  Video,
  FileText,
  Music,
  Clock,
  Loader2,
  Download,
  Eye,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCollection } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export function VirtualClassroom() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [activeView, setActiveView] = useState<'inicio' | 'conteudo' | 'avaliacao'>('inicio');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [viewingCurriculum, setViewingCurriculum] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const subs = await getCollection('subjects');
      const conts = await getCollection('contents');
      const assess = await getCollection('assessments');
      const coursesData = await getCollection('courses');
      
      setSubjects(subs);
      setContents(conts);
      setAssessments(assess);
      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching student classroom data:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredContents = contents.filter(c => c.subjectId === selectedSubject?.id);
  const filteredAssessments = assessments.filter(a => a.subjectId === selectedSubject?.id);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#E31E24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => selectedSubject ? setSelectedSubject(null) : navigate('/aluno')}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors md:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            <span className="text-[10px] font-black leading-none mt-1">ser</span>
            <span className="text-[8px] font-medium leading-none">educacional</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            {selectedSubject ? selectedSubject.name : 'SALA VIRTUAL DO ALUNO'}
          </span>
        </div>
        <button className="bg-[#E31E24] p-2 rounded-sm text-white hover:bg-[#C1191F] transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Navigation Bar (only visible when in a subject) */}
      {selectedSubject && (
        <div className="px-6 mt-4">
          <nav className="bg-[#E31E24] rounded-sm h-12 flex items-center justify-around relative px-4">
            <button 
              onClick={() => setActiveView('inicio')}
              className={`flex flex-col items-center group ${activeView === 'inicio' ? 'scale-110 opacity-100' : 'opacity-70'}`}
            >
              <Home className="w-5 h-5 text-white" />
              <span className="text-[9px] font-bold text-white uppercase mt-1">Início</span>
            </button>
            <button 
              onClick={() => setActiveView('conteudo')}
              className={`flex flex-col items-center group ${activeView === 'conteudo' ? 'scale-110 opacity-100' : 'opacity-70'}`}
            >
              <BookOpen className="w-5 h-5 text-white" />
              <span className="text-[9px] font-bold text-white uppercase mt-1">Conteúdo</span>
            </button>
            <button 
              onClick={() => setActiveView('avaliacao')}
              className={`flex flex-col items-center group ${activeView === 'avaliacao' ? 'scale-110 opacity-100' : 'opacity-70'}`}
            >
              <PenTool className="w-5 h-5 text-white" />
              <span className="text-[9px] font-bold text-white uppercase mt-1">Avaliação</span>
            </button>
          </nav>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {!selectedSubject ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">
                Olá, SÉRGIO SILVA BEZERRA
              </h1>
              <div className="flex gap-2">
                <div className="bg-gray-100 p-3 rounded-sm flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase text-gray-400">Progresso Geral</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="bg-[#E31E24] h-full w-[15%]"></div>
                  </div>
                  <span className="text-xs font-black text-gray-900">15%</span>
                </div>
              </div>
            </div>

            {/* Disciplines Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 uppercase">Minhas Disciplinas</h2>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-gray-900">{subjects.length}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase">Ativas</span>
                </div>
              </div>

              {subjects.length === 0 ? (
                <div className="bg-gray-50 p-20 text-center rounded-sm border-2 border-dashed border-gray-200">
                  <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase text-xs">Nenhuma disciplina vinculada ao seu curso ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedSubject(item);
                        setActiveView('inicio');
                      }}
                      className="bg-[#1a1a2e] rounded-sm aspect-[4/3] relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                    >
                      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                      <img 
                        src={`https://picsum.photos/seed/${item.id}/600/400`} 
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                      
                      <div className="absolute bottom-6 left-6 right-6 space-y-1">
                        <p className="text-[#E31E24] text-[10px] font-black uppercase tracking-widest">
                          Prof. {item.tutorName}
                        </p>
                        <h3 className="text-white text-lg font-bold leading-tight uppercase tracking-tight">
                          {item.name}
                        </h3>
                      </div>

                      <div className="absolute top-6 right-6">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-sm border border-white/10">
                          <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {activeView === 'inicio' && (
              <motion.div 
                key="subject-home" 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="bg-[#151619] p-8 rounded-sm text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BookOpen className="w-48 h-48 rotate-12" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <button 
                      onClick={() => setSelectedSubject(null)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-white transition-colors mb-4"
                    >
                      <ChevronLeft className="w-4 h-4" /> Voltar para disciplinas
                    </button>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">{selectedSubject.name}</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Professor Corresponsável: {selectedSubject.tutorName}</p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                        <p className="text-[10px] font-black text-gray-500 uppercase">Arquivos</p>
                        <p className="text-xl font-black">{filteredContents.length}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                        <p className="text-[10px] font-black text-gray-500 uppercase">Avaliações</p>
                        <p className="text-xl font-black">{filteredAssessments.length}</p>
                      </div>
                      {courses.find(c => c.id === selectedSubject.courseId) && (
                        <button 
                          onClick={() => {
                            setViewingCurriculum(courses.find(c => c.id === selectedSubject.courseId));
                            setShowCurriculumModal(true);
                          }}
                          className="bg-[#E31E24]/20 border border-[#E31E24]/50 p-4 rounded-sm hover:bg-[#E31E24]/30 transition-colors"
                        >
                          <p className="text-[10px] font-black text-[#E31E24] uppercase">Matriz Curricular</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Eye className="w-4 h-4 text-white" />
                            <span className="text-lg font-black text-white uppercase">Ver Grade</span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setActiveView('conteudo')}
                    className="p-8 border border-gray-100 rounded-sm hover:border-[#E31E24] hover:bg-red-50 text-left transition-all group"
                  >
                    <BookOpen className="w-8 h-8 text-gray-300 mb-4 group-hover:text-[#E31E24] group-hover:scale-110 transition-all" />
                    <h3 className="text-xl font-bold uppercase mb-2">Acessar Conteúdo</h3>
                    <p className="text-xs text-gray-500">Vídeos, apostilas e materiais complementares.</p>
                  </button>
                  <button 
                    onClick={() => setActiveView('avaliacao')}
                    className="p-8 border border-gray-100 rounded-sm hover:border-[#E31E24] hover:bg-red-50 text-left transition-all group"
                  >
                    <PenTool className="w-8 h-8 text-gray-300 mb-4 group-hover:text-[#E31E24] group-hover:scale-110 transition-all" />
                    <h3 className="text-xl font-bold uppercase mb-2">Realizar Avaliações</h3>
                    <p className="text-xs text-gray-500">Testes de conhecimento e exames finais.</p>
                  </button>
                </div>
              </motion.div>
            )}

            {activeView === 'conteudo' && (
              <motion.div key="subject-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <header className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Conteúdo de Estudo</h2>
                  <button onClick={() => setActiveView('inicio')} className="text-xs font-bold text-gray-400">Voltar</button>
                </header>
                
                {filteredContents.length === 0 ? (
                  <div className="bg-gray-50 p-12 text-center rounded-sm">
                    <p className="text-sm font-bold text-gray-400 uppercase">Nenhum material publicado nesta disciplina ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredContents.map((c: any) => (
                      <a 
                        key={c.id} 
                        href={c.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white p-6 rounded-sm border border-gray-100 flex items-center justify-between hover:shadow-lg hover:border-[#E31E24] transition-all group"
                      >
                        <div className="flex items-center gap-6">
                          <div className="bg-gray-50 p-4 rounded-sm text-gray-400 group-hover:text-[#E31E24] group-hover:bg-red-50 transition-all">
                            {c.type === 'video' && <Video className="w-6 h-6" />}
                            {c.type === 'pdf' && <FileText className="w-6 h-6" />}
                            {c.type === 'audio' && <Music className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{c.title}</h4>
                            <p className="text-[10px] uppercase font-black text-gray-400 mt-1">{c.type} • Publicado em {new Date(c.createdAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#E31E24] group-hover:translate-x-1 transition-all" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeView === 'avaliacao' && (
              <motion.div key="subject-assess" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <header className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Atividades e Provas</h2>
                  <button onClick={() => setActiveView('inicio')} className="text-xs font-bold text-gray-400">Voltar</button>
                </header>

                {filteredAssessments.length === 0 ? (
                  <div className="bg-gray-50 p-12 text-center rounded-sm">
                    <p className="text-sm font-bold text-gray-400 uppercase">Nenhuma avaliação disponível no momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAssessments.map((a: any) => (
                      <div key={a.id} className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="p-3 bg-gray-50 rounded-sm text-gray-400"><ClipboardList className="w-6 h-6" /></div>
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-sm">Em Aberto</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold uppercase tracking-tight mb-2">{a.title}</h4>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                            <Clock className="w-4 h-4" />
                            Expira em: {new Date(a.dueDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <button className="w-full bg-gray-900 text-white py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                          Iniciar Avaliação
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Back Button */}
        <div className="flex justify-center pt-12">
          {!selectedSubject ? (
            <button 
              onClick={() => navigate('/aluno')}
              className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Voltar para o Portal
            </button>
          ) : (
            <button 
              onClick={() => setSelectedSubject(null)}
              className="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Voltar para disciplinas
            </button>
          )}
        </div>

        {/* Curriculum View Modal */}
        <AnimatePresence>
          {showCurriculumModal && viewingCurriculum && (
            <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-2xl rounded-sm shadow-2xl p-8 overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Matriz Curricular</h2>
                    <p className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest">{viewingCurriculum.name}</p>
                  </div>
                  <button onClick={() => setShowCurriculumModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar text-left">
                  {viewingCurriculum.curriculumText ? (
                    <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 whitespace-pre-wrap text-sm text-gray-700 font-medium leading-relaxed font-sans">
                      {viewingCurriculum.curriculumText}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <FileText className="w-12 h-12 text-gray-100 mb-4" />
                      <p className="text-gray-400 font-bold uppercase text-xs">Visualização de texto não disponível para este curso.</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                    Documento Oficial • {viewingCurriculum.modality}
                  </p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowCurriculumModal(false)}
                      className="px-6 py-2.5 rounded-sm font-bold text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Fechar
                    </button>
                    {viewingCurriculum.curriculumUrl && (
                      <a 
                        href={viewingCurriculum.curriculumUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#E31E24] text-white px-8 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Baixar PDF
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
