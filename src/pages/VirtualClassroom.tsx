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
  CheckCircle2,
  ArrowRight,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCollection, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { PedagogicalSchedule } from './PedagogicalSchedule';

export function VirtualClassroom() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [forums, setForums] = useState<any[]>([]);
  const [forumMessages, setForumMessages] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [activeView, setActiveView] = useState<'inicio' | 'conteudo' | 'avaliacao' | 'forum' | 'cronograma'>('inicio');
  const [activeForum, setActiveForum] = useState<any>(null);
  const [newForumMessage, setNewForumMessage] = useState('');
  const [isSendingForumMessage, setIsSendingForumMessage] = useState(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [viewingCurriculum, setViewingCurriculum] = useState<any>(null);

  // Assessment taking state
  const [activeAssessment, setActiveAssessment] = useState<any>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, any>>({});
  const [submittingAssessment, setSubmittingAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Check for provisional student session
      const pEmail = localStorage.getItem('p_student_email');
      const pName = localStorage.getItem('p_student_name');

      if (currentUser || pEmail) {
        const loggedUser = currentUser ? {
          email: currentUser.email,
          displayName: currentUser.displayName,
          id: currentUser.uid
        } : {
          email: pEmail,
          displayName: pName,
          id: pEmail
        };
        setUser(loggedUser);
        fetchData(loggedUser.email || '');
      } else {
        navigate('/login-aluno');
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchData(studentEmail: string) {
    setLoading(true);
    try {
      const subs = await getCollection('subjects');
      const conts = await getCollection('contents');
      const assess = await getCollection('assessments');
      const allSubmissions = await getCollection('submissions');
      const coursesData = await getCollection('courses');
      const allForums = await getCollection('forums');
      const allMessages = await getCollection('forum_messages');
      
      const mySubmissions = (allSubmissions as any[]).filter(s => s.studentEmail === studentEmail);
      
      setSubjects(subs);
      setContents(conts);
      setAssessments(assess);
      setSubmissions(mySubmissions);
      setForums(allForums);
      setForumMessages(allMessages);
      setCourses(coursesData);
    } catch (err) {
      console.error("Error fetching student classroom data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleStartAssessment = (assessment: any) => {
    setActiveAssessment(assessment);
    setStudentAnswers({});
    setAssessmentResult(null);
  };

  const handleSubmitAssessment = async () => {
    if (!activeAssessment) return;
    setSubmittingAssessment(true);

    try {
      let automaticGrade = 0;
      let hasDiscursive = false;

      if (activeAssessment.type === 'test') {
        activeAssessment.questions.forEach((q: any) => {
          if (q.type === 'objective') {
            if (studentAnswers[q.id] === q.correctOption) {
              automaticGrade += Number(q.points) || 0;
            }
          } else {
            hasDiscursive = true;
          }
        });
      } else {
        hasDiscursive = true;
      }

      const totalGrade = hasDiscursive ? 0 : automaticGrade;
      const status = hasDiscursive ? 'Em Avaliação' : 'Avaliada';

      // Import database tools needed
      const { addDocument } = await import('../lib/firebase');
      
      const newSubmission = {
        assessmentId: activeAssessment.id,
        studentName: user.displayName || user.email,
        studentId: user.id,
        studentEmail: user.email,
        answers: studentAnswers,
        automaticGrade,
        manualGrade: 0,
        totalGrade,
        status,
        submittedAt: new Date().toISOString()
      };

      await addDocument('submissions', newSubmission);

      setAssessmentResult({
        automaticGrade,
        status,
        totalPoints: activeAssessment.totalPoints
      });
      
      // Refresh data
      if (user?.email) fetchData(user.email);
    } catch (err) {
      console.error("Error submitting assessment:", err);
      alert("Erro ao enviar avaliação.");
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const handleSendForumMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeForum || !newForumMessage.trim()) return;

    setIsSendingForumMessage(true);
    try {
      const { addDocument } = await import('../lib/firebase');
      
      const msgData = {
        forumId: activeForum.id,
        userId: user.id || user.email,
        userName: user.displayName || user.email,
        userRole: 'student',
        text: newForumMessage,
        createdAt: new Date().toISOString()
      };

      await addDocument('forum_messages', msgData);
      setNewForumMessage('');
      
      // Refresh messages
      const allMsgs = await getCollection('forum_messages') as any[];
      setForumMessages(allMsgs);
    } catch (err) {
      console.error("Error sending message to forum:", err);
      alert("Erro ao enviar mensagem.");
    } finally {
      setIsSendingForumMessage(false);
    }
  };

  const getSubmissionStatus = (assessmentId: string) => {
    const sub = submissions.find(s => s.assessmentId === assessmentId);
    return sub ? sub.status : 'Pendente';
  };

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
            <button 
              onClick={() => setActiveView('forum')}
              className={`flex flex-col items-center group ${activeView === 'forum' ? 'scale-110 opacity-100' : 'opacity-70'}`}
            >
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="text-[9px] font-bold text-white uppercase mt-1">Fórum</span>
            </button>
            <button 
              onClick={() => setActiveView('cronograma')}
              className={`flex flex-col items-center group ${activeView === 'cronograma' ? 'scale-110 opacity-100' : 'opacity-70'}`}
            >
              <CalendarIcon className="w-5 h-5 text-white" />
              <span className="text-[9px] font-bold text-white uppercase mt-1">Cronograma</span>
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
                    {filteredAssessments.map((a: any) => {
                      const status = getSubmissionStatus(a.id);
                      const submission = submissions.find(s => s.assessmentId === a.id);
                      
                      return (
                        <div key={a.id} className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between">
                          <div className="space-y-6">
                            <div className="flex justify-between items-start">
                              <div className="p-3 bg-gray-50 rounded-sm text-gray-400">
                                <ClipboardList className="w-6 h-6" />
                              </div>
                              <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-sm ${
                                status === 'Avaliada' ? 'bg-green-100 text-green-700' : 
                                status === 'Em Avaliação' ? 'bg-blue-100 text-blue-700' : 
                                'bg-red-100 text-red-700'
                              }`}>
                                {status === 'Avaliada' ? 'AVALIADA' : 
                                 status === 'Em Avaliação' ? 'EM CORREÇÃO' : 
                                 'A REALIZAR'}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest">
                                  {a.type === 'test' ? 'Teste Interativo' : 'Trabalho / Entrega'}
                                </span>
                              </div>
                              <h4 className="text-xl font-bold uppercase tracking-tight mb-2 leading-tight">{a.title}</h4>
                              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                                <Clock className="w-4 h-4" />
                                {status === 'Avaliada' || status === 'Em Avaliação' ? 
                                  `Realizada em: ${new Date(submission?.submittedAt).toLocaleDateString('pt-BR')}` :
                                  `Expira em: ${new Date(a.dueDate).toLocaleDateString('pt-BR')}`
                                }
                              </div>
                            </div>

                            {status === 'Avaliada' && (
                              <div className="bg-green-50 p-4 rounded-sm border border-green-100">
                                <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-1">Resultado Final:</p>
                                <div className="text-2xl font-black text-green-900">
                                  {submission.totalGrade} / {a.totalPoints} <span className="text-xs text-green-600 font-bold">PONTOS</span>
                                </div>
                                {submission.feedback && (
                                  <div className="mt-3 pt-3 border-t border-green-100 italic text-xs text-green-800">
                                    "{submission.feedback}"
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {status === 'Pendente' && (
                            <button 
                              onClick={() => handleStartAssessment(a)}
                              className="w-full bg-gray-900 text-white py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#E31E24] transition-all transform hover:-translate-y-1"
                            >
                              Iniciar Atividade
                            </button>
                          )}

                          {status === 'Em Avaliação' && (
                            <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest text-center">
                              Aguardando Correção do Professor
                            </div>
                          )}

                          {status === 'Avaliada' && (
                            <div className="w-full bg-green-100 text-green-700 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest text-center">
                              Concluída com Sucesso
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeView === 'forum' && (
              <motion.div key="subject-forum" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {!activeForum ? (
                  <div className="space-y-6">
                    <header className="flex justify-between items-center">
                      <h2 className="text-2xl font-black uppercase tracking-tight">Fórum de Discussão</h2>
                      <button onClick={() => setActiveView('inicio')} className="text-xs font-bold text-gray-400">Voltar</button>
                    </header>

                    <div className="space-y-4">
                      {forums.filter(f => f.subjectId === selectedSubject.id).length === 0 ? (
                        <div className="bg-gray-50 p-12 text-center rounded-sm">
                          <p className="text-sm font-bold text-gray-400 uppercase">Nenhum tópico de discussão iniciado.</p>
                        </div>
                      ) : (
                        forums.filter(f => f.subjectId === selectedSubject.id).map((f: any) => (
                          <button 
                            key={f.id}
                            onClick={() => setActiveForum(f)}
                            className="w-full bg-white p-6 rounded-sm border border-gray-100 flex items-center justify-between hover:shadow-lg hover:border-[#E31E24] transition-all group text-left"
                          >
                            <div className="flex items-center gap-6">
                              <div className="bg-gray-50 p-4 rounded-sm text-gray-400 group-hover:text-[#E31E24] group-hover:bg-red-50 transition-all">
                                <MessageSquare className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-[#E31E24] transition-colors">{f.title}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <p className="text-[10px] uppercase font-black text-gray-400">
                                    {forumMessages.filter(m => m.forumId === f.id).length} Participações
                                  </p>
                                  {f.isEvaluative && (
                                    <span className="bg-yellow-100 text-yellow-700 text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">
                                      Vale {f.points} pontos
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#E31E24] group-hover:translate-x-1 transition-all" />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-[600px] bg-white border border-gray-100 rounded-sm overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
                    <div className="bg-gray-900 p-6 text-white flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setActiveForum(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h3 className="text-xl font-black uppercase tracking-tight italic">{activeForum.title}</h3>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discussão Ativa • {selectedSubject.name}</p>
                        </div>
                      </div>
                      {activeForum.isEvaluative && (
                        <div className="bg-[#E31E24] px-4 py-2 rounded-sm shadow-lg shadow-[#E31E24]/20">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">Atividade Avaliativa</p>
                          <p className="text-sm font-black text-white leading-none">{activeForum.points} Pontos</p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50">
                      {forumMessages.filter(m => m.forumId === activeForum.id).length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                           <MessageSquare className="w-12 h-12 mb-4" />
                           <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma mensagem ainda.</p>
                        </div>
                      ) : (
                        forumMessages
                          .filter(m => m.forumId === activeForum.id)
                          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                          .map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.userRole === 'teacher' ? 'justify-start' : 'justify-end'}`}>
                              <div className={`max-w-[80%] ${msg.userRole === 'teacher' ? 'bg-white border-l-4 border-gray-900' : 'bg-red-50 border-r-4 border-[#E31E24]'} p-4 rounded-sm shadow-sm`}>
                                <div className="flex items-center justify-between gap-4 mb-2">
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${msg.userRole === 'teacher' ? 'text-gray-900' : 'text-[#E31E24]'}`}>
                                    {msg.userName} {msg.userRole === 'teacher' && '• Professor'}
                                  </span>
                                  <span className="text-[8px] font-bold text-gray-400 uppercase">
                                    {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">{msg.text}</p>
                              </div>
                            </div>
                          ))
                      )}
                    </div>

                    <form onSubmit={handleSendForumMessage} className="p-6 bg-white border-t border-gray-100 shrink-0">
                      <div className="flex gap-4">
                        <textarea 
                          rows={2}
                          placeholder="Digite sua contribuição para a discussão..."
                          className="flex-1 bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm focus:ring-2 focus:ring-[#E31E24]/20 outline-none resize-none transition-all"
                          value={newForumMessage}
                          onChange={e => setNewForumMessage(e.target.value)}
                        />
                        <button 
                          type="submit"
                          disabled={isSendingForumMessage || !newForumMessage.trim()}
                          className="bg-gray-900 text-white px-8 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#E31E24] transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                        >
                          {isSendingForumMessage ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Enviar'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
            {activeView === 'cronograma' && (
              <motion.div 
                key="subject-schedule"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <header className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Cronograma de Aulas</h2>
                  <button onClick={() => setActiveView('inicio')} className="text-xs font-bold text-gray-400">Voltar</button>
                </header>
                <PedagogicalSchedule viewOnly={true} />
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

        {/* Active Assessment Modal */}
        <AnimatePresence>
          {activeAssessment && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-3xl rounded-sm shadow-2xl p-0 overflow-hidden flex flex-col max-h-[95vh]"
              >
                {/* Modal Header */}
                <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#E31E24] p-3 rounded-sm">
                      <PenTool className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight italic">{activeAssessment.title}</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedSubject.name} • {activeAssessment.type === 'test' ? 'Teste Online' : 'Trabalho de Entrega'}</p>
                    </div>
                  </div>
                  {!assessmentResult && (
                    <button 
                      onClick={() => !submittingAssessment && setActiveAssessment(null)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  {assessmentResult ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <BarChart2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Avaliação Finalizada!</h3>
                      <p className="text-gray-500 font-medium uppercase text-xs tracking-widest mb-8">Suas respostas foram enviadas com sucesso para o sistema.</p>
                      
                      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                          <p className="text-lg font-black text-gray-900 uppercase">{assessmentResult.status}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nota Preliminar</p>
                          <p className="text-lg font-black text-[#E31E24]">{assessmentResult.automaticGrade} / {assessmentResult.totalPoints}</p>
                        </div>
                      </div>

                      {assessmentResult.status === 'Em Avaliação' && (
                        <p className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-yellow-50 px-6 py-3 rounded-full border border-yellow-100">
                          * Esta avaliação contém questões discursivas que serão revisadas pelo professor.
                        </p>
                      )}

                      <div className="w-full max-w-2xl mt-12 space-y-8 text-left">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                           <MessageSquare className="w-4 h-4 text-[#E31E24]" />
                           <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Feedback Detalhado por Questão</h4>
                        </div>

                        {activeAssessment.questions.map((q: any, idx: number) => {
                          const isCorrect = q.type === 'objective' && studentAnswers[q.id] === q.correctOption;
                          const studentChoice = studentAnswers[q.id];

                          return (
                            <div key={q.id} className="bg-gray-50 p-6 rounded-sm border border-gray-200">
                              <div className="flex items-start gap-4 mb-4">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black italic ${
                                  q.type === 'discursive' ? 'bg-gray-900 text-white' :
                                  isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                }`}>
                                  {idx + 1}
                                </span>
                                <h5 className="text-sm font-bold text-gray-900 leading-snug">{q.text}</h5>
                              </div>

                              {q.type === 'objective' ? (
                                <div className="ml-10 space-y-4">
                                  <div className="space-y-2">
                                    {q.options.map((opt: string, optIdx: number) => (
                                      <div 
                                        key={optIdx}
                                        className={`p-3 rounded-sm text-xs flex items-center justify-between border ${
                                          optIdx === q.correctOption 
                                          ? 'bg-green-50 border-green-200 text-green-900 border-l-4' 
                                          : optIdx === studentChoice 
                                          ? 'bg-red-50 border-red-200 text-red-900 border-l-4'
                                          : 'bg-white border-gray-100 text-gray-500 opacity-60'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <span className="font-black opacity-40 italic">{String.fromCharCode(65 + optIdx)})</span>
                                          <span className="font-medium">{opt}</span>
                                        </div>
                                        {optIdx === q.correctOption && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                        {optIdx === studentChoice && optIdx !== q.correctOption && <ArrowRight className="w-4 h-4 text-red-600" />}
                                      </div>
                                    ))}
                                  </div>

                                  <div className={`p-4 rounded-sm border-l-4 ${isCorrect ? 'bg-green-50 border-green-600' : 'bg-red-50 border-red-600'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      {isCorrect ? (
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-black text-green-700 uppercase tracking-widest italic">Muito bom! Você acertou.</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-black text-red-700 uppercase tracking-widest italic">Não foi dessa vez. A resposta correta era a {String.fromCharCode(65 + q.correctOption)}.</span>
                                        </div>
                                      )}
                                    </div>
                                    {q.explanation && (
                                      <div className="mt-2 text-xs text-gray-700 italic leading-relaxed">
                                        <p className="font-bold text-[9px] uppercase tracking-tighter text-gray-400 mb-1">Explicação do Professor:</p>
                                        {q.explanation}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="ml-10">
                                  <div className="bg-white p-4 border border-gray-100 rounded-sm italic text-gray-600 text-xs">
                                     <p className="font-bold text-[9px] uppercase tracking-tighter text-gray-400 mb-2">Sua Resposta:</p>
                                     {studentAnswers[q.id]}
                                  </div>
                                  <p className="mt-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Aguardando correção manual do professor.</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <button 
                        onClick={() => setActiveAssessment(null)}
                        className="mt-12 px-12 py-4 bg-gray-900 text-white rounded-sm font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                      >
                        Concluir e Voltar
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-8">
                      {activeAssessment.description && (
                        <div className="bg-blue-50 p-4 rounded-sm border-l-4 border-blue-500">
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Instruções do Professor:</p>
                          <p className="text-sm text-blue-900 italic">{activeAssessment.description}</p>
                        </div>
                      )}

                      {activeAssessment.type === 'test' ? (
                        <div className="space-y-12">
                          {activeAssessment.questions.map((q: any, idx: number) => (
                            <div key={q.id} className="space-y-4">
                              <div className="flex items-start gap-4">
                                <span className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-black italic">
                                  {idx + 1}
                                </span>
                                <div className="space-y-1">
                                  <h4 className="text-lg font-bold text-gray-900 leading-tight">{q.text}</h4>
                                  <p className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest italic">{q.points} Pontos • {q.type === 'objective' ? 'Múltipla Escolha' : 'Discursiva'}</p>
                                </div>
                              </div>

                              {q.type === 'objective' ? (
                                <div className="grid grid-cols-1 gap-3 ml-12">
                                  {q.options.map((opt: string, optIdx: number) => (
                                    <button
                                      key={optIdx}
                                      onClick={() => setStudentAnswers({ ...studentAnswers, [q.id]: optIdx })}
                                      className={`p-4 text-left rounded-sm border transition-all flex items-center gap-4 ${
                                        studentAnswers[q.id] === optIdx 
                                        ? 'bg-red-50 border-[#E31E24] ring-2 ring-[#E31E24]/10' 
                                        : 'bg-gray-50 border-gray-100 hover:border-gray-300'
                                      }`}
                                    >
                                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black italic border ${
                                        studentAnswers[q.id] === optIdx
                                        ? 'bg-[#E31E24] text-white border-[#E31E24]'
                                        : 'bg-white text-gray-400 border-gray-200'
                                      }`}>
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <span className={`text-sm font-medium ${studentAnswers[q.id] === optIdx ? 'text-red-900' : 'text-gray-600'}`}>
                                        {opt}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="ml-12 space-y-2">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Sua Resposta:</label>
                                  <textarea 
                                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm focus:ring-2 focus:ring-[#E31E24]/20 outline-none min-h-[150px] italic"
                                    placeholder="Escreva sua resposta detalhadamente aqui..."
                                    value={studentAnswers[q.id] || ''}
                                    onChange={e => setStudentAnswers({ ...studentAnswers, [q.id]: e.target.value })}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-6 py-12 flex flex-col items-center">
                          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-200 mb-4">
                            <Download className="w-10 h-10 text-gray-300" />
                          </div>
                          <div className="text-center">
                            <h4 className="text-xl font-bold uppercase tracking-tight text-gray-900">Entrega de Trabalho</h4>
                            <p className="text-xs text-gray-500 font-medium max-w-sm mt-2">Esta atividade requer a entrega de um arquivo ou link contendo o desenvolvimento do trabalho proposto.</p>
                          </div>
                          <div className="w-full space-y-4 max-w-md">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Link do Trabalho (Drive, Dropbox, etc)</label>
                              <input 
                                type="url"
                                className="w-full bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm outline-none focus:ring-2 focus:ring-[#E31E24]/20"
                                placeholder="https://..."
                                value={studentAnswers['deliveryUrl'] || ''}
                                onChange={e => setStudentAnswers({ ...studentAnswers, deliveryUrl: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Comentários Adicionais</label>
                              <textarea 
                                className="w-full bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm outline-none focus:ring-2 focus:ring-[#E31E24]/20 min-h-[100px] italic"
                                placeholder="Observações sobre seu trabalho..."
                                value={studentAnswers['comment'] || ''}
                                onChange={e => setStudentAnswers({ ...studentAnswers, comment: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Modal Footer */}
                      <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Clock className="w-4 h-4 text-gray-400" />
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                             Sua resposta será salva formalmente no sistema.
                           </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setActiveAssessment(null)}
                            className="px-6 py-4 rounded-sm font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={handleSubmitAssessment}
                            disabled={submittingAssessment}
                            className="bg-[#E31E24] text-white px-12 py-4 rounded-sm font-black text-xs uppercase tracking-widest shadow-xl shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            {submittingAssessment ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <PenTool className="w-4 h-4" />
                            )}
                            Enviar Atividade
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
