import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Home, 
  BookOpen,
  Upload, 
  FilePlus, 
  Users, 
  MessageSquare,
  Search,
  Plus,
  Video,
  FileText,
  Music,
  CheckCircle2,
  MoreVertical,
  Clock,
  ChevronRight,
  X,
  Loader2,
  AlertTriangle,
  Download,
  Eye,
  Link2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getCollection, publishContent, createAssessment, auth, getTeacherSubjects } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { cn } from '../lib/utils';

export function TeacherClassroom() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inicio' | 'conteudo' | 'avaliacoes' | 'alunos' | 'forum'>('inicio');
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Modals
  const [showContentModal, setShowContentModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [viewingCurriculum, setViewingCurriculum] = useState<any>(null);

  // Forms
  const [newContent, setNewContent] = useState({ subjectId: '', title: '', type: 'pdf' as any, url: '' });
  const [newAssessment, setNewAssessment] = useState({ subjectId: '', title: '', dueDate: '' });

  useEffect(() => {
    // 1. Check for firebase auth first
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Check if we have a provisional session in localStorage
      const altEmail = localStorage.getItem('p_teacher_email');
      const altName = localStorage.getItem('p_teacher_name');

      if (currentUser) {
        // If it's an anonymous/provisional session or we have an altEmail saved
        if (currentUser.isAnonymous && altEmail) {
          const altUser = { email: altEmail, displayName: altName, uid: currentUser.uid };
          setUser(altUser);
          fetchTeacherDataByEmail(altEmail);
        } else {
          // Standard Google Login
          setUser(currentUser);
          fetchTeacherData(currentUser.uid);
        }
      } else {
        // 2. Fallback if not even guest
        if (altEmail) {
          // This case shouldn't strictly happen if ProfessorLogin signs them in, 
          // but for robustness we trigger the fetch if we have the data
          const altUser = { email: altEmail, displayName: altName, uid: altEmail };
          setUser(altUser);
          fetchTeacherDataByEmail(altEmail);
        } else {
          setLoading(false);
          navigate('/acesso-professor');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  async function fetchTeacherDataByEmail(email: string) {
    setLoading(true);
    try {
      // Find subjects by email using server-side query
      const subs = await getCollection('subjects', [where('tutorEmail', '==', email.toLowerCase())]) as any[];
      
      const subjectIds = subs.map(s => s.id);
      const courseIds = [...new Set(subs.map(s => s.courseId))];
      
      if (subjectIds.length > 0) {
        // Fetch contents, assessments and courses
        const allConts = await getCollection('contents') as any[];
        const allAssess = await getCollection('assessments') as any[];
        const allCourses = await getCollection('courses') as any[];
        
        const filteredConts = allConts.filter(c => subjectIds.includes(c.subjectId));
        const filteredAssess = allAssess.filter(a => subjectIds.includes(a.subjectId));
        const filteredCourses = allCourses.filter(c => courseIds.includes(c.id));
        
        setSubjects(subs);
        setContents(filteredConts);
        setAssessments(filteredAssess);
        setCourses(filteredCourses);
      } else {
        setSubjects([]);
        setContents([]);
        setAssessments([]);
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching teacher data by email:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeacherData(uid: string) {
    setLoading(true);
    try {
      // 1. Fetch subjects by UID
      let subs = await getTeacherSubjects(uid);
      
      // 2. Also search by Email (in case pedagogical assigned by email only)
      if (auth.currentUser?.email) {
        const emailSubs = await getCollection('subjects', [where('tutorEmail', '==', auth.currentUser.email.toLowerCase())]) as any[];
        
        // Merge results avoiding duplicates
        const existingIds = new Set(subs.map(s => s.id));
        emailSubs.forEach(s => {
          if (!existingIds.has(s.id)) {
            subs.push(s);
          }
        });
      }
      
      const subjectIds = subs.map(s => s.id);
      const courseIds = [...new Set(subs.map(s => (s as any).courseId))];
      
      if (subjectIds.length > 0) {
        const allConts = await getCollection('contents') as any[];
        const allAssess = await getCollection('assessments') as any[];
        const allCourses = await getCollection('courses') as any[];
        
        const filteredConts = allConts.filter(c => subjectIds.includes(c.subjectId));
        const filteredAssess = allAssess.filter(a => subjectIds.includes(a.subjectId));
        const filteredCourses = allCourses.filter(c => courseIds.includes(c.id));
        
        setSubjects(subs);
        setContents(filteredConts);
        setAssessments(filteredAssess);
        setCourses(filteredCourses);
      } else {
        setSubjects([]);
        setContents([]);
        setAssessments([]);
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching teacher data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handlePublishContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const finalSubjectId = newContent.subjectId || selectedSubject?.id;
    if (!finalSubjectId) {
      alert("Selecione uma disciplina primeiro.");
      return;
    }
    const subject = subjects.find(s => s.id === finalSubjectId);
    await publishContent(
      finalSubjectId, 
      subject?.name || 'N/A',
      newContent.title, 
      newContent.type, 
      newContent.url,
      user.uid || user.email,
      user.displayName || user.email
    );
    setShowContentModal(false);
    setNewContent({ subjectId: '', title: '', type: 'pdf', url: '' });
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      fetchTeacherData(user.uid);
    } else {
      fetchTeacherDataByEmail(user.email);
    }
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const finalSubjectId = newAssessment.subjectId || selectedSubject?.id;
    if (!finalSubjectId) {
      alert("Selecione uma disciplina primeiro.");
      return;
    }
    await createAssessment(finalSubjectId, newAssessment.title, newAssessment.dueDate);
    setShowAssessmentModal(false);
    setNewAssessment({ subjectId: '', title: '', dueDate: '' });
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      fetchTeacherData(user.uid);
    } else {
      fetchTeacherDataByEmail(user.email);
    }
  };

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
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#E31E24] uppercase tracking-tighter">Portal do Professor</span>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              REAL TIME ACADEMIC PANEL
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-black text-gray-900">{user?.displayName || user?.email || 'Professor'}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Professor Titular</span>
          </div>
          <button className="bg-[#E31E24] p-2 rounded-sm text-white hover:bg-[#C1191F] transition-colors shadow-lg shadow-[#E31E24]/20">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="px-6 mt-4 max-w-7xl mx-auto">
        <nav className="bg-[#1a1a2e] rounded-sm h-14 flex items-center justify-around relative px-4 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <button 
            onClick={() => {
              setActiveTab('inicio');
              setSelectedSubject(null);
            }}
            className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'inicio' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'inicio' ? 'text-white' : 'text-white/70'}`} />
            <span className="text-[9px] font-bold text-white uppercase mt-1">Início</span>
            {activeTab === 'inicio' && <motion.div layoutId="activeTabT" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
          </button>

          {selectedSubject && (
            <>
              <button 
                onClick={() => setActiveTab('conteudo')}
                className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'conteudo' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                <Upload className={`w-5 h-5 ${activeTab === 'conteudo' ? 'text-white' : 'text-white/70'}`} />
                <span className="text-[9px] font-bold text-white uppercase mt-1">Conteúdo</span>
                {activeTab === 'conteudo' && <motion.div layoutId="activeTabT" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
              </button>

              <button 
                onClick={() => setActiveTab('avaliacoes')}
                className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'avaliacoes' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                <FilePlus className={`w-5 h-5 ${activeTab === 'avaliacoes' ? 'text-white' : 'text-white/70'}`} />
                <span className="text-[9px] font-bold text-white uppercase mt-1">Avaliações</span>
                {activeTab === 'avaliacoes' && <motion.div layoutId="activeTabT" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
              </button>

              <button 
                onClick={() => setActiveTab('alunos')}
                className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'alunos' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                <Users className={`w-5 h-5 ${activeTab === 'alunos' ? 'text-white' : 'text-white/70'}`} />
                <span className="text-[9px] font-bold text-white uppercase mt-1">Alunos</span>
                {activeTab === 'alunos' && <motion.div layoutId="activeTabT" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
              </button>

              <button 
                onClick={() => setActiveTab('forum')}
                className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'forum' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                <MessageSquare className={`w-5 h-5 ${activeTab === 'forum' ? 'text-white' : 'text-white/70'}`} />
                <span className="text-[9px] font-bold text-white uppercase mt-1">Fórum</span>
                {activeTab === 'forum' && <motion.div layoutId="activeTabT" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
              </button>
            </>
          )}
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'inicio' && (
            <motion.div 
              key="inicio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                    Olá, {user?.displayName?.split(' ')[0] || 'Professor'}
                  </h1>
                  <p className="text-gray-500 font-medium">Gestão das disciplinas e interações acadêmicas.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate('/aluno/sala-virtual')}
                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all border border-gray-200"
                  >
                    <BookOpen className="w-4 h-4" />
                    Visualizar como Aluno
                  </button>
                  <button 
                    onClick={() => setShowContentModal(true)}
                    className="flex items-center gap-2 bg-[#E31E24] text-white px-6 py-3 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#C1191F] transition-all shadow-xl shadow-[#E31E24]/20"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Material
                  </button>
                  <button 
                    onClick={() => setShowAssessmentModal(true)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Nova Atividade
                  </button>
                </div>
              </div>

              {/* Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Disciplinas', value: subjects.length.toString().padStart(2, '0'), color: 'bg-red-50 text-red-600', icon: BookOpen },
                  { label: 'Avaliações Ativas', value: assessments.length.toString().padStart(2, '0'), color: 'bg-red-100/50 text-red-700', icon: Clock },
                  { label: 'Novos Fóruns', value: '00', color: 'bg-red-200/30 text-red-800', icon: MessageSquare },
                  { label: 'Materiais Publicados', value: contents.length.toString().padStart(2, '0'), color: 'bg-red-50 text-red-500', icon: CheckCircle2 },
                ].map((stat, idx) => (
                  <div key={idx} className={`${stat.color} p-6 rounded-sm border border-current/10 flex items-center justify-between`}>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{stat.label}</p>
                      <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                    </div>
                    <stat.icon className="w-8 h-8 opacity-20" />
                  </div>
                ))}
              </div>

              {/* Disciplines Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Suas Disciplinas</h2>
                </div>

                {subjects.length === 0 ? (
                  <div className="bg-gray-50 p-12 text-center rounded-sm border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase text-xs">Nenhuma disciplina cadastrada no painel pedagógico.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subjects.map((item, idx) => (
                      <div 
                        key={idx}
                        className="bg-white rounded-sm border border-gray-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all"
                      >
                        <div className="h-32 bg-gray-900 relative overflow-hidden">
                          <img 
                            src={`https://picsum.photos/seed/${item.id}/600/300`} 
                            alt={item.name} 
                            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          <div className="absolute bottom-4 left-6">
                            <h3 className="text-white font-bold leading-tight uppercase tracking-tight">{item.name}</h3>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                              ID: {item.id} 
                              <span className="w-1 h-1 bg-gray-300 rounded-full" />
                              <Clock className="w-3 h-3" /> {(item as any).hours || 0}h
                            </span>
                            <span className="font-black text-[#E31E24] uppercase">Tutor: {item.tutorName}</span>
                          </div>

                          {/* Matriz Curricular Section for Teacher */}
                          {courses.find(c => c.id === item.courseId) && (
                            <div className="pt-2 border-t border-gray-50">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matriz Curricular</span>
                                <div className="flex items-center gap-2">
                                  {courses.find(c => c.id === item.courseId)?.curriculumText && (
                                    <button 
                                      onClick={() => {
                                        setViewingCurriculum(courses.find(c => c.id === item.courseId));
                                        setShowCurriculumModal(true);
                                      }}
                                      className="text-[9px] font-bold text-blue-600 hover:underline uppercase"
                                    >
                                      Ver Texto
                                    </button>
                                  )}
                                  {courses.find(c => c.id === item.courseId)?.curriculumUrl && (
                                    <a 
                                      href={courses.find(c => c.id === item.courseId)?.curriculumUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-[9px] font-bold text-green-600 hover:underline uppercase"
                                    >
                                      <Download className="w-3 h-3" />
                                      PDF
                                    </a>
                                  )}
                                  {!courses.find(c => c.id === item.courseId)?.curriculumText && !courses.find(c => c.id === item.courseId)?.curriculumUrl && (
                                    <span className="text-[9px] font-bold text-gray-300 uppercase italic">Não disponível</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          <button 
                            onClick={() => {
                              setSelectedSubject(item);
                              setActiveTab('conteudo');
                            }}
                            className="w-full py-3 bg-gray-50 rounded-sm text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-[#E31E24] hover:text-white transition-all shadow-sm"
                          >
                            Gerenciar Disciplina
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {activeTab === 'conteudo' && selectedSubject && (
            <motion.div 
              key="conteudo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#E31E24] uppercase tracking-widest">
                  <BookOpen className="w-3 h-3" />
                  Sala de Aula Virtual
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{selectedSubject.name}</h2>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Conteúdos Publicados</h2>
                <button 
                  onClick={() => setShowContentModal(true)}
                  className="bg-[#E31E24] text-white p-2 rounded-sm shadow-lg hover:bg-red-700"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <aside className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ação Rápida</h3>
                    <button 
                      onClick={() => {
                        setSelectedSubject(null);
                        setActiveTab('inicio');
                      }}
                      className="w-full flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-sm hover:border-[#E31E24] group transition-all text-left text-xs font-bold text-gray-600 hover:text-[#E31E24]"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Trocar Disciplina
                    </button>
                  </div>
                </aside>

                <div className="md:col-span-3 space-y-4">
                  {contents.filter(c => c.subjectId === selectedSubject.id).length === 0 ? (
                    <div className="border-2 border-dashed border-gray-100 rounded-sm p-20 text-center">
                      <p className="text-gray-400 font-bold uppercase text-xs">Nenhum material publicado para esta disciplina.</p>
                    </div>
                  ) : (
                    contents.filter(c => c.subjectId === selectedSubject.id).map((file, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-50 rounded-sm text-gray-400 group-hover:text-[#E31E24] transition-colors">
                            {file.type === 'video' && <Video className="w-6 h-6" />}
                            {file.type === 'pdf' && <FileText className="w-6 h-6" />}
                            {file.type === 'audio' && <Music className="w-6 h-6" />}
                            {file.type === 'link' && <Link2 className="w-6 h-6" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-gray-800">{file.title}</h4>
                              <span className={cn(
                                "text-[9px] font-black uppercase px-2 py-0.5 rounded-sm",
                                file.status === 'Aprovado' ? "bg-green-100 text-green-700" :
                                file.status === 'Ajuste Necessário' ? "bg-orange-100 text-orange-700 animate-pulse" :
                                "bg-blue-100 text-blue-700"
                              )}>
                                {file.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">
                                {new Date(file.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            {file.feedback && (
                              <div className="mt-2 bg-red-50 p-3 rounded-sm border-l-2 border-[#E31E24] space-y-1">
                                <p className="text-[9px] font-black text-[#E31E24] uppercase tracking-widest flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  Feedback da Coordenação
                                </p>
                                <p className="text-xs text-red-700 italic leading-relaxed">{file.feedback}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 text-gray-400 hover:text-[#E31E24] hover:bg-white rounded-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-sm">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  <div 
                    onClick={() => setShowContentModal(true)}
                    className="border-2 border-dashed border-gray-100 rounded-sm p-12 flex flex-col items-center justify-center gap-4 hover:border-[#E31E24] hover:bg-red-50 transition-all group cursor-pointer"
                  >
                    <div className="bg-gray-50 p-4 rounded-full text-gray-400 group-hover:scale-110 group-hover:bg-[#E31E24] group-hover:text-white transition-all">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-700">Clique para publicar novos materiais</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'avaliacoes' && selectedSubject && (
            <motion.div 
              key="avaliacoes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                  <FilePlus className="w-3 h-3" />
                  Avaliações e Atividades
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{selectedSubject.name}</h2>
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => {
                    setSelectedSubject(null);
                    setActiveTab('inicio');
                  }}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#E31E24] transition-colors"
                >
                  <ChevronRight className="w-3 h-3 rotate-180" />
                  Voltar às Disciplinas
                </button>
                <button 
                  onClick={() => setShowAssessmentModal(true)}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10"
                >
                  Nova Avaliação
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.filter(a => a.subjectId === selectedSubject.id).length === 0 ? (
                  <div className="col-span-full border-2 border-dashed border-gray-100 rounded-sm p-20 text-center">
                    <p className="text-gray-400 font-bold uppercase text-xs">Nenhuma avaliação criada para esta disciplina.</p>
                  </div>
                ) : (
                  assessments.filter(a => a.subjectId === selectedSubject.id).map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-4 hover:border-[#E31E24] transition-all">
                      <div className="flex justify-between items-start">
                        <div className="bg-gray-100 p-2 text-gray-500 rounded-sm"><FilePlus className="w-5 h-5" /></div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[9px] font-black uppercase rounded-sm">Ativa</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Disciplina ID: {item.subjectId}</p>
                      </div>
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Vence em: {new Date(item.dueDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <button className="text-[#E31E24] font-black uppercase text-[10px] tracking-widest">Corrigir</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'alunos' && selectedSubject && (
            <motion.div 
              key="alunos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                  <Users className="w-3 h-3" />
                  Alunos e Desempenho
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{selectedSubject.name}</h2>
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => {
                    setSelectedSubject(null);
                    setActiveTab('inicio');
                  }}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#E31E24] transition-colors"
                >
                  <ChevronRight className="w-3 h-3 rotate-180" />
                  Voltar às Disciplinas
                </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-12 text-center">
                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase text-xs">Os dados dos alunos desta disciplina aparecerão conforme as matrículas reais forem feitas.</p>
              </div>
            </motion.div>
          )}
          {activeTab === 'forum' && selectedSubject && (
            <motion.div 
              key="forum"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                  <MessageSquare className="w-3 h-3" />
                  Fórum de Discussão
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{selectedSubject.name}</h2>
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => {
                    setSelectedSubject(null);
                    setActiveTab('inicio');
                  }}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#E31E24] transition-colors"
                >
                  <ChevronRight className="w-3 h-3 rotate-180" />
                  Voltar às Disciplinas
                </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase text-xs">O fórum desta disciplina será habilitado em breve para interação com os alunos.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Content Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase text-gray-900 tracking-tight">Publicar Material</h2>
              <button onClick={() => setShowContentModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handlePublishContent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disciplina</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  value={newContent.subjectId || selectedSubject?.id || ''}
                  onChange={e => setNewContent({...newContent, subjectId: e.target.value})}
                  required
                >
                  <option value="">Selecione a disciplina</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título do Material</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  placeholder="Ex: Aula 01 - Introdução"
                  value={newContent.title}
                  onChange={e => setNewContent({...newContent, title: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                    value={newContent.type}
                    onChange={e => setNewContent({...newContent, type: e.target.value as any})}
                  >
                    <option value="pdf">PDF / Documento</option>
                    <option value="video">Vídeo Aula</option>
                    <option value="audio">Podcast / Áudio</option>
                    <option value="link">Link Externo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL do Arquivo</label>
                  <input 
                    type="url" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                    placeholder="https://..."
                    value={newContent.url}
                    onChange={e => setNewContent({...newContent, url: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#E31E24] text-white py-4 rounded-sm font-black text-xs uppercase tracking-widest mt-4">Publicar Conteúdo</button>
            </form>
          </div>
        </div>
      )}

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase text-gray-900 tracking-tight">Nova Avaliação</h2>
              <button onClick={() => setShowAssessmentModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreateAssessment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disciplina</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  value={newAssessment.subjectId || selectedSubject?.id || ''}
                  onChange={e => setNewAssessment({...newAssessment, subjectId: e.target.value})}
                  required
                >
                  <option value="">Selecione a disciplina</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título da Avaliação</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm"
                  placeholder="Ex: Prova Mensal - Unidade 01"
                  value={newAssessment.title}
                  onChange={e => setNewAssessment({...newAssessment, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data de Vencimento</label>
                <input 
                  type="date" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm transition-all"
                  value={newAssessment.dueDate}
                  onChange={e => setNewAssessment({...newAssessment, dueDate: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-sm font-black text-xs uppercase tracking-widest mt-4">Criar Avaliação</button>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Helper (Avisos) */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-gray-900 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group relative">
          <AlertTriangle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-[#E31E24] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">3</span>
          <div className="absolute right-full mr-4 bg-white p-4 rounded-sm shadow-2xl border border-gray-100 w-64 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Alertas do Sistema</p>
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-600">• <strong>5 alunos</strong> com baixo desempenho na Unidade 01.</p>
              <p className="text-xs font-medium text-gray-600">• <strong>Avaliação</strong> vence amanhã para Anatomia.</p>
            </div>
          </div>
        </button>
      </div>
      {/* Curriculum View Modal */}
      {showCurriculumModal && viewingCurriculum && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl p-8 animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Matriz Curricular</h2>
                <p className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest">{viewingCurriculum.name}</p>
              </div>
              <button onClick={() => setShowCurriculumModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              {viewingCurriculum.curriculumText ? (
                <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 whitespace-pre-wrap text-sm text-gray-700 font-medium leading-relaxed">
                  {viewingCurriculum.curriculumText}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="w-12 h-12 text-gray-100 mb-4" />
                  <p className="text-gray-400 font-bold uppercase text-xs">Nenhum texto disponível para esta matriz.</p>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                Visualização oficial • {viewingCurriculum.modality}
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
          </div>
        </div>
      )}
    </div>
  );
}
