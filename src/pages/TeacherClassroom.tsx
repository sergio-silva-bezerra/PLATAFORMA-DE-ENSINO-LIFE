import React, { useEffect, useState, useMemo } from 'react';
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
  Link2,
  BarChart2,
  Calendar as CalendarIcon,
  Send,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getCollection, publishContent, createAssessment, auth, getTeacherSubjects, updateDocument, addDocument } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { cn } from '../lib/utils';
import { PedagogicalSchedule } from './PedagogicalSchedule';

export function TeacherClassroom() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inicio' | 'conteudo' | 'avaliacoes' | 'alunos' | 'forum' | 'cronograma'>('inicio');
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [forums, setForums] = useState<any[]>([]);
  const [forumMessages, setForumMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Modals & Forum States
  const [showContentModal, setShowContentModal] = useState(false);
  const [showForumModal, setShowForumModal] = useState(false);
  const [isSubmittingForum, setIsSubmittingForum] = useState(false);
  const [activeForum, setActiveForum] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const filteredContents = useMemo(() => {
    if (!selectedSubject) return [];
    return contents.filter(c => c.subjectId === selectedSubject.id);
  }, [contents, selectedSubject]);

  const filteredAssessments = useMemo(() => {
    if (!selectedSubject) return [];
    return assessments.filter(a => a.subjectId === selectedSubject.id);
  }, [assessments, selectedSubject]);

  const filteredForums = useMemo(() => {
    if (!selectedSubject) return [];
    return forums.filter(f => f.subjectId === selectedSubject.id);
  }, [forums, selectedSubject]);

  const filteredMessages = useMemo(() => {
    if (!activeForum) return [];
    return forumMessages.filter(m => m.forumId === activeForum.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [forumMessages, activeForum]);

  // Modals
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssessmentSubmissions, setSelectedAssessmentSubmissions] = useState<any>(null);
  const [gradingSubmission, setGradingSubmission] = useState<any>(null);
  const [manualGrade, setManualGrade] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);
  
  const [viewingCurriculum, setViewingCurriculum] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Forms
  const [newContent, setNewContent] = useState({ subjectId: '', title: '', type: 'pdf' as any, url: '' });
  const [newForum, setNewForum] = useState({ title: '', description: '', points: 0, isEvaluative: false });
  const [newAssessment, setNewAssessment] = useState({ 
    subjectId: '', 
    title: '', 
    description: '',
    type: 'assignment' as 'test' | 'assignment',
    dueDate: '',
    questions: [] as any[],
    totalPoints: 10
  });

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
      
      const allUsers = await getCollection('users') as any[];
      setUsers(allUsers);
      
      if (subjectIds.length > 0) {
        // Fetch contents, assessments and courses efficiently
        // Note: Using chunks of 10 for 'in' queries is safer but here we optimize by fetching only what's needed
        const contentsQuery = [where('subjectId', 'in', subjectIds.slice(0, 10))];
        const assessmentsQuery = [where('subjectId', 'in', subjectIds.slice(0, 10))];
        const forumsQuery = [where('subjectId', 'in', subjectIds.slice(0, 10))];
        
        const [filteredConts, filteredAssess, allSubmissions, allCourses, filteredForums, allMessages] = await Promise.all([
          getCollection('contents', contentsQuery),
          getCollection('assessments', assessmentsQuery),
          getCollection('submissions'),
          getCollection('courses'),
          getCollection('forums', forumsQuery),
          getCollection('forum_messages')
        ]);
        
        const finalCourses = (allCourses as any[]).filter(c => courseIds.includes(c.id));
        
        setSubjects(subs);
        setContents(filteredConts);
        setAssessments(filteredAssess);
        setSubmissions(allSubmissions);
        setForums(filteredForums);
        setForumMessages(allMessages);
        setCourses(finalCourses);
      } else {
        setSubjects([]);
        setContents([]);
        setAssessments([]);
        setSubmissions([]);
        setForums([]);
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
      
      const allUsers = await getCollection('users') as any[];
      setUsers(allUsers);
      
      if (subjectIds.length > 0) {
        const allConts = await getCollection('contents') as any[];
        const allAssess = await getCollection('assessments') as any[];
        const allSubmissions = await getCollection('submissions') as any[];
        const allCourses = await getCollection('courses') as any[];
        const allForums = await getCollection('forums') as any[];
        const allMessages = await getCollection('forum_messages') as any[];
        
        const filteredConts = allConts.filter(c => subjectIds.includes(c.subjectId));
        const filteredAssess = allAssess.filter(a => subjectIds.includes(a.subjectId));
        const filteredCourses = allCourses.filter(c => courseIds.includes(c.id));
        const filteredForums = allForums.filter(f => subjectIds.includes(f.subjectId));
        
        setSubjects(subs);
        setContents(filteredConts);
        setAssessments(filteredAssess);
        setSubmissions(allSubmissions);
        setForums(filteredForums);
        setForumMessages(allMessages);
        setCourses(filteredCourses);
      } else {
        setSubjects([]);
        setContents([]);
        setAssessments([]);
        setSubmissions([]);
        setForums([]);
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching teacher data:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleReplyFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyText.trim()) return;

    setSubmittingReply(true);
    try {
      await updateDocument('contents', replyingTo.id, {
        teacherReply: replyText,
        teacherReplyAt: new Date().toISOString()
      });
      setReplyText('');
      setReplyingTo(null);
      // Refresh teacher data
      if (auth.currentUser && !auth.currentUser.isAnonymous) {
        fetchTeacherData(user.uid);
      } else {
        fetchTeacherDataByEmail(user.email);
      }
    } catch (err) {
      console.error("Error replying to feedback:", err);
      alert("Erro ao enviar resposta.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!gradingSubmission) return;
    setIsSubmittingGrade(true);
    try {
      const totalGrade = (gradingSubmission.automaticGrade || 0) + Number(manualGrade);
      
      await updateDocument('submissions', gradingSubmission.id, {
        manualGrade: Number(manualGrade),
        totalGrade,
        feedback: feedbackText,
        status: 'Avaliada',
        gradedAt: new Date().toISOString()
      });

      // Update local state
      setSubmissions(submissions.map(s => s.id === gradingSubmission.id ? {
        ...s,
        manualGrade: Number(manualGrade),
        totalGrade,
        feedback: feedbackText,
        status: 'Avaliada'
      } : s));
      
      setGradingSubmission(null);
      alert("Avaliação concluída com sucesso!");
    } catch (err) {
      console.error("Error grading submission:", err);
      alert("Erro ao salvar nota.");
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  const handleCreateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !newForum.title.trim()) return;

    setIsSubmittingForum(true);
    try {
      const forumData = {
        subjectId: selectedSubject.id,
        teacherId: user.uid || user.email,
        title: newForum.title,
        description: newForum.description,
        points: newForum.isEvaluative ? Number(newForum.points) : 0,
        createdAt: new Date().toISOString()
      };

      const forumId = await addDocument('forums', forumData);
      
      // Send initial message from teacher if description is provided
      if (newForum.description.trim()) {
        await addDocument('forum_messages', {
          forumId,
          userId: user.uid || user.email,
          userName: user.displayName || user.name || 'Professor',
          userRole: 'teacher',
          text: newForum.description,
          createdAt: new Date().toISOString()
        });
      }

      setNewForum({ title: '', description: '', points: 0, isEvaluative: false });
      setShowForumModal(false);
      
      // Refresh
      if (auth.currentUser && !auth.currentUser.isAnonymous) {
        fetchTeacherData(user.uid);
      } else {
        fetchTeacherDataByEmail(user.email);
      }
    } catch (err) {
      console.error("Error creating forum:", err);
      alert("Erro ao criar fórum.");
    } finally {
      setIsSubmittingForum(false);
    }
  };

  const handleSendMessage = async () => {
    if (!activeForum || !newMessage.trim()) return;

    setIsSendingMessage(true);
    try {
      const msgData = {
        forumId: activeForum.id,
        userId: user.uid || user.email,
        userName: user.displayName || user.name || 'Professor',
        userRole: 'teacher',
        text: newMessage,
        createdAt: new Date().toISOString()
      };

      await addDocument('forum_messages', msgData);
      setNewMessage('');
      
      // Refresh messages
      const allMsgs = await getCollection('forum_messages') as any[];
      setForumMessages(allMsgs);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Erro ao enviar mensagem.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handlePublishContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const finalSubjectId = newContent.subjectId || selectedSubject?.id;
    if (!finalSubjectId) {
      alert("Selecione uma disciplina primeiro.");
      return;
    }
    const targetSubject = subjects.find(s => s.id === finalSubjectId);
    const teacher = users.find(u => u.uid === user.uid);
    const teacherName = teacher?.name || user.displayName || user.email;

    await publishContent(
      finalSubjectId, 
      targetSubject?.name || 'N/A',
      newContent.title, 
      newContent.type, 
      newContent.url,
      user.uid,
      teacherName
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
    
    // The total points is what the teacher assigned in the form
    const totalPoints = newAssessment.totalPoints;

    try {
      await createAssessment({
        ...newAssessment,
        subjectId: finalSubjectId,
        teacherId: user.uid,
        totalPoints,
        createdAt: new Date().toISOString()
      });
      setShowAssessmentModal(false);
      setNewAssessment({ 
        subjectId: '', 
        title: '', 
        description: '',
        type: 'assignment',
        dueDate: '',
        questions: [],
        totalPoints: 10
      });
      if (auth.currentUser && !auth.currentUser.isAnonymous) {
        fetchTeacherData(user.uid);
      } else {
        fetchTeacherDataByEmail(user.email);
      }
    } catch (err) {
      console.error("Error creating assessment:", err);
      alert("Erro ao criar avaliação.");
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

              <button 
                onClick={() => setActiveTab('cronograma')}
                className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'cronograma' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
              >
                <CalendarIcon className={`w-5 h-5 ${activeTab === 'cronograma' ? 'text-white' : 'text-white/70'}`} />
                <span className="text-[9px] font-bold text-white uppercase mt-1">Cronograma</span>
                {activeTab === 'cronograma' && <motion.div layoutId="activeTabT" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
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
                  <div className="bg-gray-900 p-4 rounded-sm border border-gray-800">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Estatísticas</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Arquivos</p>
                        <p className="text-2xl font-black text-white italic">{filteredContents.length}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Atividades</p>
                        <p className="text-2xl font-black text-[#E31E24] italic">{filteredAssessments.length}</p>
                      </div>
                    </div>
                  </div>
                </aside>

                <div className="md:col-span-3 space-y-4">
                  {filteredContents.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-100 rounded-sm p-20 text-center">
                      <p className="text-gray-400 font-bold uppercase text-xs">Nenhum material publicado para esta disciplina.</p>
                    </div>
                  ) : (
                    filteredContents.map((file) => (
                      <div key={file.id} className="bg-white p-4 rounded-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
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
                                
                                {file.teacherReply ? (
                                  <div className="mt-2 pt-2 border-t border-red-100">
                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Sua Resposta:</p>
                                    <p className="text-xs text-blue-800 italic">{file.teacherReply}</p>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setReplyingTo(file)}
                                    className="mt-2 text-[9px] font-black text-[#E31E24] uppercase hover:underline"
                                  >
                                    Responder Coordenação
                                  </button>
                                )}
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
                  assessments.filter(a => a.subjectId === selectedSubject.id).map((item, idx) => {
                    const count = submissions.filter(s => s.assessmentId === item.id).length;
                    const pendingCount = submissions.filter(s => s.assessmentId === item.id && s.status === 'Em Avaliação').length;

                    return (
                      <div key={idx} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-4 hover:border-[#E31E24] transition-all group">
                        <div className="flex justify-between items-start">
                          <div className="bg-gray-100 p-2 text-gray-500 rounded-sm group-hover:bg-[#E31E24] group-hover:text-white transition-colors">
                            <BarChart2 className="w-5 h-5" />
                          </div>
                          <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-sm ${
                            item.type === 'test' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {item.type === 'test' ? 'Teste' : 'Trabalho'}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                            {count} Entregas {pendingCount > 0 && <span className="text-[#E31E24]">({pendingCount} pendentes)</span>}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-[9px] text-gray-400 font-black uppercase">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(item.dueDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedAssessmentSubmissions(item);
                              setShowSubmissionModal(true);
                            }}
                            className="bg-gray-900 text-white px-4 py-2 rounded-sm font-black uppercase text-[9px] tracking-widest hover:bg-[#E31E24] transition-all"
                          >
                            Ver Entregas
                          </button>
                        </div>
                      </div>
                    );
                  })
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
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest">
                      <MessageSquare className="w-3 h-3" />
                      Fórum de Discussão
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{selectedSubject.name}</h2>
                  </div>
                  <button 
                    onClick={() => setShowForumModal(true)}
                    className="flex items-center gap-2 bg-[#E31E24] text-white px-6 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Tópico
                  </button>
                </div>
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

              {activeForum ? (
                <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden flex flex-col h-[600px]">
                  <div className="bg-gray-900 p-4 text-white flex justify-between items-center shrink-0">
                    <div>
                      <h4 className="font-bold uppercase tracking-tight text-sm italic">{activeForum.title}</h4>
                      {activeForum.points > 0 && (
                        <p className="text-[9px] font-bold text-[#E31E24] uppercase tracking-widest mt-0.5 italic">Vale até {activeForum.points} pontos</p>
                      )}
                    </div>
                    <button 
                      onClick={() => setActiveForum(null)}
                      className="text-[10px] font-black uppercase text-gray-400 hover:text-white"
                    >
                      Sair da Discussão
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 custom-scrollbar">
                    {filteredMessages.map((msg: any) => (
                      <div key={msg.id} className={`flex flex-col ${msg.userId === (user.uid || user.email) ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] rounded-sm p-4 shadow-sm ${
                          msg.userRole === 'teacher' 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-white border border-gray-200 text-gray-900'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                             <span className={`text-[9px] font-black uppercase tracking-widest ${msg.userRole === 'teacher' ? 'text-[#E31E24]' : 'text-gray-400'}`}>
                               {msg.userName} {msg.userRole === 'teacher' && '• Professor'}
                             </span>
                          </div>
                          <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <p className={`text-[8px] mt-2 font-medium opacity-50 ${msg.userRole === 'teacher' ? 'text-white' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                    <div className="flex gap-2">
                      <textarea 
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-sm p-3 text-xs focus:ring-1 focus:ring-[#E31E24] outline-none min-h-[50px] resize-none"
                        placeholder="Escreva sua participação..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={isSendingMessage || !newMessage.trim()}
                        className="bg-[#E31E24] text-white px-6 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#C1191F] transition-all disabled:opacity-50"
                      >
                        {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredForums.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-12 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold uppercase text-[10px]">Crie o primeiro tópico de discussão para esta disciplina.</p>
                    </div>
                  ) : (
                    filteredForums.map((f: any) => (
                      <button 
                        key={f.id}
                        onClick={() => setActiveForum(f)}
                        className="bg-white p-6 rounded-sm border border-gray-100 flex items-center justify-between hover:border-[#E31E24] hover:shadow-lg transition-all group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-50 rounded-sm text-gray-400 group-hover:text-[#E31E24] group-hover:bg-red-50 transition-all">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 uppercase tracking-tight">{f.title}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">
                              Criado em {new Date(f.createdAt).toLocaleDateString('pt-BR')}
                              {f.points > 0 && ` • Vale ${f.points} pontos`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Participações</p>
                              <p className="text-lg font-black text-gray-900 italic">{forumMessages.filter(m => m.forumId === f.id).length}</p>
                           </div>
                           <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#E31E24] group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'cronograma' && (
            <motion.div 
              key="cronograma"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PedagogicalSchedule />
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
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold uppercase text-gray-900 tracking-tight italic">Nova Atividade Acadêmica</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Configure os parâmetros da avaliação</p>
              </div>
              <button 
                onClick={() => {
                  setShowAssessmentModal(false);
                  setNewAssessment({ ...newAssessment, questions: [] });
                }}
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleCreateAssessment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disciplina</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm focus:ring-2 focus:ring-[#E31E24]/20 outline-none"
                    value={newAssessment.subjectId || selectedSubject?.id || ''}
                    onChange={e => setNewAssessment({...newAssessment, subjectId: e.target.value})}
                    required
                  >
                    <option value="">Selecione a disciplina</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título da Atividade</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm focus:ring-2 focus:ring-[#E31E24]/20 outline-none"
                    placeholder="Ex: Prova Mensal - Anatomia"
                    value={newAssessment.title}
                    onChange={e => setNewAssessment({...newAssessment, title: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo de Atividade</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm focus:ring-2 focus:ring-[#E31E24]/20 outline-none"
                    value={newAssessment.type}
                    onChange={e => setNewAssessment({...newAssessment, type: e.target.value as any})}
                  >
                    <option value="test">Teste Interativo (Questões Online)</option>
                    <option value="assignment">Trabalho (Entrega de Arquivo)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Limite de Entrega</label>
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm focus:ring-2 focus:ring-[#E31E24]/20 outline-none"
                    value={newAssessment.dueDate}
                    onChange={e => setNewAssessment({...newAssessment, dueDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instruções / Descrição</label>
                <textarea 
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-sm focus:ring-2 focus:ring-[#E31E24]/20 outline-none"
                  rows={2}
                  placeholder="Instruções para o aluno..."
                  value={newAssessment.description}
                  onChange={e => setNewAssessment({...newAssessment, description: e.target.value})}
                />
              </div>

              <div className="w-full md:w-64 pt-4 border-t border-gray-50">
                <div className="bg-gray-900 p-4 rounded-sm">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 block">Pontuação Total da Atividade</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      className="w-24 bg-white/10 border border-white/20 rounded-sm p-2 text-lg font-black text-white focus:ring-2 focus:ring-[#E31E24] outline-none"
                      value={newAssessment.totalPoints}
                      onChange={e => setNewAssessment({...newAssessment, totalPoints: Number(e.target.value)})}
                      min={0}
                    />
                    <span className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest">Valor Máximo</span>
                  </div>
                  {newAssessment.type === 'test' && newAssessment.questions.length > 0 && (
                    <p className="text-[9px] font-bold text-gray-500 mt-2 uppercase tracking-tighter">
                      Soma das questões: {newAssessment.questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0)} pts
                    </p>
                  )}
                </div>
              </div>

              {newAssessment.type === 'test' && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#E31E24]" />
                      Questões do Teste
                    </h3>
                    <button 
                      type="button"
                      onClick={() => {
                        const newQ = {
                          id: Math.random().toString(36).substr(2, 9),
                          text: '',
                          type: 'objective',
                          options: ['', '', '', ''],
                          correctOption: 0,
                          points: 1
                        };
                        setNewAssessment({
                          ...newAssessment,
                          questions: [...newAssessment.questions, newQ]
                        });
                      }}
                      className="text-[10px] font-black text-[#E31E24] hover:underline uppercase tracking-widest"
                    >
                      + Adicionar Questão
                    </button>
                  </div>

                  <div className="space-y-6">
                    {newAssessment.questions.map((q, qIdx) => (
                      <div key={q.id} className="bg-gray-50 p-6 rounded-sm border border-gray-200 relative group/q">
                        <button 
                          type="button"
                          onClick={() => {
                            const updated = newAssessment.questions.filter((_, i) => i !== qIdx);
                            setNewAssessment({ ...newAssessment, questions: updated });
                          }}
                          className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover/q:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <span className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center rounded-full text-xs font-black">
                            {qIdx + 1}
                          </span>
                          <div className="flex-1 space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Enunciado da Questão</label>
                            <input 
                              type="text"
                              className="w-full bg-white border border-gray-200 rounded-sm p-2 text-sm focus:ring-1 focus:ring-[#E31E24] outline-none"
                              placeholder="Digite a pergunta..."
                              value={q.text}
                              onChange={e => {
                                const updated = [...newAssessment.questions];
                                updated[qIdx].text = e.target.value;
                                setNewAssessment({ ...newAssessment, questions: updated });
                              }}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tipo de Questão</label>
                            <select 
                              className="w-full bg-white border border-gray-200 rounded-sm p-2 text-xs"
                              value={q.type}
                              onChange={e => {
                                const updated = [...newAssessment.questions];
                                updated[qIdx].type = e.target.value as any;
                                setNewAssessment({ ...newAssessment, questions: updated });
                              }}
                            >
                              <option value="objective">Múltipla Escolha (Objetiva)</option>
                              <option value="discursive">Discursiva (Subjetiva)</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pontuação</label>
                            <input 
                              type="number"
                              className="w-full bg-white border border-gray-200 rounded-sm p-2 text-xs"
                              value={q.points}
                              onChange={e => {
                                const updated = [...newAssessment.questions];
                                updated[qIdx].points = Number(e.target.value);
                                setNewAssessment({ ...newAssessment, questions: updated });
                              }}
                            />
                          </div>
                        </div>

                        {q.type === 'objective' && (
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alternativas (Marque a correta)</label>
                              {q.options.map((opt: string, optIdx: number) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                  <input 
                                    type="radio"
                                    name={`correct-${q.id}`}
                                    checked={q.correctOption === optIdx}
                                    onChange={() => {
                                      const updated = [...newAssessment.questions];
                                      updated[qIdx].correctOption = optIdx;
                                      setNewAssessment({ ...newAssessment, questions: updated });
                                    }}
                                    className="w-4 h-4 accent-[#E31E24]"
                                  />
                                  <input 
                                    type="text"
                                    className="flex-1 bg-white border border-gray-200 rounded-sm p-2 text-xs focus:ring-1 focus:ring-[#E31E24] outline-none"
                                    placeholder={`Alternativa ${String.fromCharCode(65 + optIdx)}`}
                                    value={opt}
                                    onChange={e => {
                                      const updated = [...newAssessment.questions];
                                      updated[qIdx].options[optIdx] = e.target.value;
                                      setNewAssessment({ ...newAssessment, questions: updated });
                                    }}
                                    required
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-[#E31E24] uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare className="w-3 h-3" />
                                Breve Explicação / Justificativa para o aluno
                              </label>
                              <textarea 
                                className="w-full bg-white border border-gray-200 rounded-sm p-3 text-xs focus:ring-1 focus:ring-[#E31E24] outline-none italic text-gray-600"
                                rows={2}
                                placeholder="Esta explicação aparecerá para o aluno após ele responder a questão..."
                                value={q.explanation || ''}
                                onChange={e => {
                                  const updated = [...newAssessment.questions];
                                  updated[qIdx].explanation = e.target.value;
                                  setNewAssessment({ ...newAssessment, questions: updated });
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {newAssessment.questions.length === 0 && (
                      <div className="py-10 border-2 border-dashed border-gray-100 text-center rounded-sm">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clique em "Adicionar Questão" para compor o teste.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="text-[10px] font-black text-gray-900 uppercase tracking-widest p-4 bg-gray-50 rounded-sm">
                  TOTAL DE PONTOS: <span className="text-[#E31E24] text-lg">
                    {newAssessment.type === 'test' 
                      ? newAssessment.questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0)
                      : newAssessment.totalPoints
                    }
                  </span>
                </div>
                <button type="submit" className="bg-[#E31E24] text-white px-10 py-4 rounded-sm font-black text-xs uppercase tracking-widest shadow-xl shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all">
                  Finalizar e Publicar
                </button>
              </div>
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
      {/* Reply Modal */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-sm w-full max-w-lg overflow-hidden shadow-2xl"
            >
            <div className="bg-gray-900 p-6 text-white flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">Responder Coordenação</h3>
                <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-widest">{replyingTo.title}</p>
              </div>
              <button 
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleReplyFeedback} className="p-6 space-y-6">
              <div className="bg-red-50 p-4 rounded-sm border-l-4 border-[#E31E24]">
                <p className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest mb-1">Feedback Recebido:</p>
                <p className="text-sm text-red-900 italic leading-relaxed">{replyingTo.feedback}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" />
                  Sua Resposta / Justificativa
                </label>
                <textarea 
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Explique as alterações feitas ou tire uma dúvida sobre o feedback..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 italic"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button 
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="flex-1 py-3 text-gray-500 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={submittingReply}
                  className="flex-[2] py-3 bg-[#E31E24] text-white rounded-sm font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingReply ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Enviar Resposta
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Forum Modal */}
      {showForumModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Novo Tópico de Fórum</h2>
                <p className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest">{selectedSubject?.name}</p>
              </div>
              <button onClick={() => setShowForumModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleCreateForum} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Título do Tópico</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Discussão sobre a Unidade 1"
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-xs focus:ring-1 focus:ring-[#E31E24] outline-none"
                  value={newForum.title}
                  onChange={e => setNewForum({ ...newForum, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ponto de Partida / Descrição</label>
                <textarea 
                  required
                  placeholder="Inicie a discussão apresentando o tema..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-sm p-3 text-xs focus:ring-1 focus:ring-[#E31E24] outline-none min-h-[100px]"
                  value={newForum.description}
                  onChange={e => setNewForum({ ...newForum, description: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-sm">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="isEvaluative"
                    checked={newForum.isEvaluative}
                    onChange={e => setNewForum({ ...newForum, isEvaluative: e.target.checked })}
                    className="accent-[#E31E24]"
                  />
                  <label htmlFor="isEvaluative" className="text-[10px] font-black text-gray-700 uppercase tracking-widest cursor-pointer">Atribuir Pontuação</label>
                </div>
                
                {newForum.isEvaluative && (
                  <div className="flex items-center gap-2 flex-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pontos:</label>
                    <input 
                      type="number"
                      min="1"
                      max="100"
                      className="w-20 bg-white border border-gray-100 rounded-sm p-2 text-xs focus:ring-1 focus:ring-[#E31E24] outline-none"
                      value={newForum.points}
                      onChange={e => setNewForum({ ...newForum, points: Number(e.target.value) })}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setShowForumModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all rounded-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmittingForum}
                  className="flex-1 bg-[#E31E24] text-white px-8 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all disabled:opacity-50"
                >
                  {isSubmittingForum ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Criar Tópico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Curriculum View Modal */}
      {/* Curriculum Modal */}
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
      {/* Submissions Modal */}
      <AnimatePresence>
        {showSubmissionModal && selectedAssessmentSubmissions && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-sm shadow-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">Controle de Entregas</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    {selectedAssessmentSubmissions.title} • {selectedAssessmentSubmissions.type === 'test' ? 'Teste' : 'Trabalho'}
                  </p>
                </div>
                <button onClick={() => setShowSubmissionModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 gap-4">
                  {submissions.filter(s => s.assessmentId === selectedAssessmentSubmissions.id).length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-sm">
                      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Nenhuma entrega recebida até o momento.</p>
                    </div>
                  ) : (
                    submissions
                      .filter(s => s.assessmentId === selectedAssessmentSubmissions.id)
                      .map(sub => (
                        <div key={sub.id} className="bg-gray-50 p-6 rounded-sm border border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-black italic">
                              {sub.studentName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{sub.studentName}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                  sub.status === 'Avaliada' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {sub.status === 'Avaliada' ? 'Avaliada' : 'Em Correção'}
                                </span>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest tracking-widest">
                                  Entregue em: {new Date(sub.submittedAt).toLocaleDateString('pt-BR')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pontuação Final</p>
                              <p className="text-xl font-black text-[#E31E24]">
                                {sub.status === 'Avaliada' ? `${sub.totalGrade} / ${selectedAssessmentSubmissions.totalPoints}` : '---'}
                              </p>
                            </div>
                            <button 
                              onClick={() => {
                                setGradingSubmission(sub);
                                setManualGrade(sub.manualGrade || 0);
                                setFeedbackText(sub.feedback || '');
                              }}
                              className="px-6 py-3 bg-gray-900 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#E31E24] transition-all"
                            >
                              {sub.status === 'Avaliada' ? 'Revisar Nota' : 'Avaliar Agora'}
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      <AnimatePresence>
        {gradingSubmission && (
          <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="bg-white w-full max-w-2xl rounded-sm shadow-2xl p-8 max-h-[95vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tight italic">Avaliar Aluno</h3>
                   <p className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest mt-1">{gradingSubmission.studentName} • {selectedAssessmentSubmissions.title}</p>
                </div>
                <button onClick={() => setGradingSubmission(null)}><X className="w-6 h-6 text-gray-400" /></button>
              </div>

              <div className="space-y-8">
                {/* Answers View */}
                <div className="space-y-6">
                   <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                     <FileText className="w-4 h-4 text-[#E31E24]" />
                     Respostas Enviadas
                   </h4>
                   
                   {selectedAssessmentSubmissions.type === 'test' ? (
                     <div className="space-y-4">
                        {selectedAssessmentSubmissions.questions.map((q: any, idx: number) => (
                          <div key={q.id} className="bg-gray-50 p-4 rounded-sm border border-gray-200">
                             <div className="flex justify-between items-start mb-2">
                               <p className="text-sm font-bold text-gray-900">{idx + 1}. {q.text}</p>
                               <span className="text-[10px] font-black uppercase text-gray-400">{q.points} Pontos</span>
                             </div>
                             
                             {q.type === 'objective' ? (
                               <div className="flex items-center gap-4 text-xs">
                                 <p className={`font-bold ${gradingSubmission.answers[q.id] === q.correctOption ? 'text-green-600' : 'text-red-600'}`}>
                                   Resposta do Aluno: {String.fromCharCode(65 + gradingSubmission.answers[q.id])} 
                                   ({q.options[gradingSubmission.answers[q.id]]})
                                 </p>
                                 <p className="text-gray-400 italic">
                                   Correta: {String.fromCharCode(65 + q.correctOption)}
                                 </p>
                               </div>
                             ) : (
                               <div className="mt-2 p-3 bg-white rounded-sm border border-gray-100 italic text-sm text-gray-600">
                                 {gradingSubmission.answers[q.id] || '(Sem resposta)'}
                               </div>
                             )}
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="bg-blue-50 p-6 rounded-sm border border-blue-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 italic">Arquivo/Link Entregue:</p>
                        <a 
                          href={gradingSubmission.answers.deliveryUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#E31E24] font-bold underline text-sm break-all"
                        >
                          {gradingSubmission.answers.deliveryUrl}
                        </a>
                        {gradingSubmission.answers.comment && (
                          <p className="mt-4 text-xs text-blue-900 leading-relaxed italic">"{gradingSubmission.answers.comment}"</p>
                        )}
                     </div>
                   )}
                </div>

                <div className="space-y-6 pt-8 border-t border-gray-100">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nota Automática (Objetivas)</label>
                         <div className="bg-gray-100 p-4 rounded-sm font-black text-xl text-gray-600">
                           {gradingSubmission.automaticGrade || 0}
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nota Manual (A definir)</label>
                         <input 
                           type="number"
                           className="w-full bg-gray-50 border-2 border-gray-200 outline-none focus:border-[#E31E24] p-3 text-xl font-black rounded-sm transition-all"
                           value={manualGrade}
                           onChange={e => setManualGrade(Number(e.target.value))}
                           max={selectedAssessmentSubmissions.totalPoints}
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Feedback / Observações</label>
                      <textarea 
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm outline-none focus:ring-2 focus:ring-[#E31E24]/20 italic"
                        placeholder="Parabéns pelo desempenho ou indique o que precisa ser melhorado..."
                        value={feedbackText}
                        onChange={e => setFeedbackText(e.target.value)}
                      />
                   </div>

                   <div className="flex items-center justify-between p-6 bg-gray-900 rounded-sm text-white">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nota Total Final</p>
                        <p className="text-3xl font-black italic">{(gradingSubmission.automaticGrade || 0) + Number(manualGrade)} / {selectedAssessmentSubmissions.totalPoints}</p>
                      </div>
                      <button 
                        onClick={handleGradeSubmission}
                        disabled={isSubmittingGrade}
                        className="bg-[#E31E24] text-white px-12 py-4 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#C1191F] transition-all flex items-center gap-2"
                      >
                         {isSubmittingGrade ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                         Lançar Nota Oficial
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
