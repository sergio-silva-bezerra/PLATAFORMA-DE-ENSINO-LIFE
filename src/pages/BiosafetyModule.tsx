import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, Unlock, CheckCircle2, AlertTriangle, BookOpen, Loader2, Play, Trophy, X, ChevronRight, Users } from 'lucide-react';
import { auth, getBiosafetyProgress, saveBiosafetyProgress, getCollection, getUserProfile } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface Module {
  id: number;
  title: string;
  status: 'pending' | 'completed' | 'blocked';
  score: number;
  completedAt?: string;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

const MODULE_QUESTIONS: Record<number, Question[]> = {
  1: [
    { id: 1, text: "O que é Biossegurança?", options: ["Um conjunto de ações voltadas para a prevenção de riscos no ambiente de saúde", "Apenas o uso de luvas", "Um protocolo de limpeza de salas", "Uma lei que proíbe o uso de jalecos"], correct: 0 },
    { id: 2, text: "Qual o objetivo principal da biossegurança?", options: ["Reduzir custos", "Eliminar todos os vírus do hospital", "Prevenir, reduzir ou eliminar riscos inerentes às atividades de saúde", "Organizar a fila da farmácia"], correct: 2 },
    { id: 3, text: "Riscos biológicos envolvem:", options: ["Exposição a radiação", "Exposição a bactérias, vírus e fungos", "Quedas de equipamentos", "Uso indevido de produtos químicos"], correct: 1 },
  ],
  2: [
    { id: 1, text: "O que significa a sigla EPI?", options: ["Equipamento de Proteção Individual", "Estrutura Padrão de Internação", "Equipe de Pronto Intervenção", "Elemento de Proteção Interna"], correct: 0 },
    { id: 2, text: "Em que momento as luvas devem ser trocadas?", options: ["A cada 24 horas", "Somente quando rasgarem", "Ao final de cada procedimento ou entre pacientes", "No final do plantão"], correct: 2 },
    { id: 3, text: "O jaleco deve ser usado:", options: ["Em qualquer lugar do hospital", "Apenas em áreas de isolamento", "Dentro do laboratório/clínica e nunca em áreas comuns como refeitório", "Durante todo o trajeto de casa para o hospital"], correct: 2 },
  ],
  3: [
    { id: 1, text: "Onde devem ser descartados os materiais perfurocortantes (agulhas)?", options: ["Lixo comum", "Lixo infectante (saco branco)", "Recipiente rígido tipo Descarpack", "Lavabo"], correct: 2 },
    { id: 2, text: "O que deve ser colocado no saco branco leitoso?", options: ["Restos de alimentos", "Materiais com sangue ou fluidos corporais", "Papel de escritório", "Embalagens plásticas limpas"], correct: 1 },
    { id: 3, text: "Quem é responsável pelo descarte correto do material?", options: ["A equipe de limpeza", "O enfermeiro chefe", "O profissional que utilizou o material", "A coordenação do curso"], correct: 2 },
  ],
  4: [
    { id: 1, text: "Qual o tempo recomendado para a higienização simples das mãos com sabão?", options: ["5 a 10 segundos", "40 a 60 segundos", "2 minutos", "10 minutos"], correct: 1 },
    { id: 2, text: "A fricção anti-séptica com álcool substitui o sabão quando:", options: ["Sempre", "As mãos não estiverem visivelmente sujas", "As mãos estiverem com sangue", "Nunca"], correct: 1 },
    { id: 3, text: "Qual o momento mais crítico para lavar as mãos?", options: ["Antes e após o contato com o paciente", "Apenas no início do dia", "Apenas após usar o banheiro", "Quando o supervisor estiver olhando"], correct: 0 },
  ]
};

const initialModules: Module[] = [
  { id: 1, title: 'Introdução à Biossegurança em Saúde', status: 'pending', score: 0 },
  { id: 2, title: 'Equipamentos de Proteção Individual (EPIs)', status: 'blocked', score: 0 },
  { id: 3, title: 'Descarte de Resíduos Infectantes', status: 'blocked', score: 0 },
  { id: 4, title: 'Protocolos de Higienização das Mãos', status: 'blocked', score: 0 },
];

export default function BiosafetyModule() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentsProgress, setStudentsProgress] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      if (!auth.currentUser) return;
      try {
        const profile: any = await getUserProfile(auth.currentUser.uid);
        setUserRole(profile?.role || 'student');

        if (profile?.role === 'pedagogical' || profile?.role === 'admin') {
          const allProgress = await getCollection('biosafety_progress');
          setStudentsProgress(allProgress);
        } else {
          const data = await getBiosafetyProgress(auth.currentUser.uid);
          if (data) {
            setProgress(data);
          } else {
            const initial = {
              studentId: auth.currentUser.uid,
              studentName: auth.currentUser.displayName || 'Estudante',
              studentEmail: auth.currentUser.email,
              modules: initialModules,
              overallStatus: 'blocked',
            };
            setProgress(initial);
          }
        }
      } catch (err) {
        console.error("Error loading biosafety data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleStartModule = (m: Module) => {
    setActiveModule(m);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizFinished(false);
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleNextQuestion = () => {
    const questions = MODULE_QUESTIONS[activeModule!.id];
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = async () => {
    if (!activeModule || !progress) return;
    setIsSaving(true);
    
    const questions = MODULE_QUESTIONS[activeModule.id];
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) correctCount++;
    });

    const score = (correctCount / questions.length) * 10;
    const isCompleted = score >= 8.0;

    const updatedModules = progress.modules.map((m: Module) => {
      if (m.id === activeModule.id) {
        return {
          ...m,
          score,
          status: isCompleted ? 'completed' : 'pending',
          completedAt: isCompleted ? new Date().toISOString() : m.completedAt
        };
      }
      return m;
    });

    const finalModules = updatedModules.map((m: Module, idx: number) => {
      if (idx > 0) {
        const prevModule = updatedModules[idx - 1];
        if (prevModule.status === 'completed' && m.status === 'blocked') {
          return { ...m, status: 'pending' };
        }
      }
      return m;
    });

    const allCompleted = finalModules.every((m: Module) => m.status === 'completed');
    const overallStatus = allCompleted ? 'released' : 'blocked';

    const newProgress = {
      ...progress,
      modules: finalModules,
      overallStatus
    };

    try {
      await saveBiosafetyProgress(newProgress);
      setProgress(newProgress);
      setQuizFinished(true);
    } catch (err) {
      alert("Erro ao salvar progresso.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#E31E24] animate-spin" />
      </div>
    );
  }

  if (userRole === 'pedagogical' || userRole === 'admin') {
    const releasedCount = studentsProgress.filter(p => p.overallStatus === 'released').length;
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Gestão de Biossegurança</h1>
            <p className="text-gray-500 font-medium tracking-tight">Relatório de conformidade obrigatória para laboratórios.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm text-center min-w-[140px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Aptos (Liberados)</p>
                <div className="flex items-center justify-center gap-2">
                   <Unlock className="w-4 h-4 text-green-500" />
                   <p className="text-2xl font-black text-green-600">{releasedCount}</p>
                </div>
             </div>
             <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm text-center min-w-[140px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Inaptos (Bloqueados)</p>
                <div className="flex items-center justify-center gap-2">
                   <Lock className="w-4 h-4 text-red-500" />
                   <p className="text-2xl font-black text-red-600">{studentsProgress.length - releasedCount}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-100 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#151619] text-white">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Estudante</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">Status Laboratório</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">Progresso</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right">Média Biosseg.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {studentsProgress.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <ShieldAlert className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Nenhum registro de progresso encontrado.</p>
                  </td>
                </tr>
              ) : (
                studentsProgress.map((p) => {
                  const completedCount = p.modules.filter((m: any) => m.status === 'completed').length;
                  const avg = p.modules.reduce((acc: number, m: any) => acc + m.score, 0) / p.modules.length;
                  return (
                    <tr key={p.studentId} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400 uppercase text-xs">
                              {p.studentName.substring(0, 2)}
                           </div>
                           <div>
                              <p className="font-black text-gray-900 uppercase text-sm tracking-tight">{p.studentName}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{p.studentEmail}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                          p.overallStatus === 'released' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {p.overallStatus === 'released' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {p.overallStatus === 'released' ? 'Apto' : 'Bloqueado'}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-center gap-3">
                           <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-red-600 h-full transition-all duration-500" 
                                style={{ width: `${(completedCount / p.modules.length) * 100}%` }}
                              />
                           </div>
                           <span className="text-xs font-black text-gray-400">{completedCount}/{p.modules.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <span className={`text-sm font-black ${avg >= 8 ? 'text-green-600' : 'text-amber-500'}`}>
                          {avg.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const modules = progress?.modules || initialModules;
  const isReleased = progress?.overallStatus === 'released';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Trilha de Biossegurança</h1>
          <p className="text-gray-500 font-medium">Conclua os módulos para liberar seu acesso aos laboratórios.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-sm flex items-start gap-4">
        <ShieldAlert className="w-8 h-8 text-amber-600 flex-shrink-0" />
        <div>
          <h3 className="font-black text-amber-900 uppercase text-xs tracking-widest">Protocolo Institucional</h3>
          <p className="text-sm text-amber-700 leading-relaxed mt-1 font-medium italic">
            O agendamento de aulas práticas e estágios é condicionado à conclusão de 100% dos módulos com nota mínima de 8.0.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {modules.map((m: Module) => (
            <div key={m.id} className={`p-6 rounded-sm border-2 transition-all ${
              m.status === 'completed' ? 'bg-white border-green-100' :
              m.status === 'pending' ? 'bg-white border-red-50 hover:border-[#E31E24]' :
              'bg-gray-50 border-gray-100 opacity-60'
            } flex items-center justify-between group`}>
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  m.status === 'completed' ? 'bg-green-100 text-green-600' :
                  m.status === 'pending' ? 'bg-red-100 text-[#E31E24]' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {m.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                   m.status === 'pending' ? <Play className="w-6 h-6" /> :
                   <Lock className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className={`font-black text-sm uppercase tracking-tight ${m.status === 'blocked' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {m.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm ${
                      m.status === 'completed' ? 'bg-green-50 text-green-600' :
                      m.status === 'pending' ? 'bg-red-50 text-[#E31E24]' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {m.status === 'completed' ? 'CONCLUÍDO' : m.status === 'pending' ? 'LIBERADO' : 'BLOQUEADO'}
                    </span>
                    {m.status === 'completed' && <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">NOTA: {m.score.toFixed(1)}</span>}
                  </div>
                </div>
              </div>
              {m.status !== 'blocked' && (
                <button 
                  onClick={() => handleStartModule(m)}
                  className={`px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
                  m.status === 'completed' ? 'text-green-600 border border-green-200 hover:bg-green-50 shadow-green-500/5' :
                  'bg-[#E31E24] text-white hover:bg-black shadow-red-500/20'
                }`}>
                  {m.status === 'completed' ? 'REVER' : 'INICIAR'}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${isReleased ? 'bg-green-500' : 'bg-red-600'}`} />
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${isReleased ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {isReleased ? <Unlock className="w-12 h-12" /> : <Lock className="w-12 h-12" />}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Status Laboratório</p>
              <h3 className={`text-3xl font-black uppercase tracking-tighter ${isReleased ? 'text-green-600' : 'text-red-900'}`}>
                {isReleased ? 'Liberado' : 'Bloqueado'}
              </h3>
            </div>
            {isReleased && (
              <button className="w-full py-4 bg-black text-white rounded-sm font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-red-600 transition-colors">
                 AGENDAR PRÁTICA AGORA
              </button>
            )}
          </div>

          <div className="bg-[#151619] text-white p-8 rounded-sm shadow-2xl space-y-6">
             <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-[#E31E24]" />
                <h3 className="font-black uppercase tracking-tight text-sm">Diretrizes de Acesso</h3>
             </div>
             <div className="space-y-4">
                {[
                  'Jaleco branco manga longa obrigatório.',
                  'Calçado totalmente fechado.',
                  'Proibido adornos (anéis, pulseiras).',
                  'Descarte seletivo de resíduos.',
                  'Higiene das mãos antes e após.'
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#E31E24] rounded-full mt-1.5" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{rule}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {activeModule && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
            >
              {!quizFinished ? (
                <>
                  <div className="bg-[#E31E24] p-8 text-white relative">
                    <button onClick={() => setActiveModule(null)} className="absolute top-6 right-6 opacity-50 hover:opacity-100 transition-opacity"><X /></button>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Avaliação do Módulo</p>
                    <h2 className="text-xl font-black uppercase tracking-tight">{activeModule.title}</h2>
                  </div>
                  <div className="p-10 space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight">
                        {MODULE_QUESTIONS[activeModule.id][currentQuestionIndex].text}
                      </h3>
                      <div className="space-y-3">
                        {MODULE_QUESTIONS[activeModule.id][currentQuestionIndex].options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswerSelect(MODULE_QUESTIONS[activeModule.id][currentQuestionIndex].id, idx)}
                            className={`w-full p-4 rounded-sm border-2 text-left transition-all ${
                              answers[MODULE_QUESTIONS[activeModule.id][currentQuestionIndex].id] === idx
                                ? 'bg-red-50 border-[#E31E24]'
                                : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <span className="text-sm font-bold text-gray-800">{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      disabled={isSaving || answers[MODULE_QUESTIONS[activeModule.id][currentQuestionIndex].id] === undefined}
                      onClick={handleNextQuestion}
                      className="w-full py-4 bg-black text-white rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#E31E24] transition-all disabled:opacity-20"
                    >
                      {currentQuestionIndex === MODULE_QUESTIONS[activeModule.id].length - 1 ? 'FINALIZAR' : 'PRÓXIMA QUESTÃO'}
                      {isSaving && <Loader2 className="animate-spin w-4 h-4" />}
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-16 text-center space-y-8">
                   <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${progress.modules.find((m:any)=>m.id===activeModule.id).score >= 8 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {progress.modules.find((m:any)=>m.id===activeModule.id).score >= 8 ? <Trophy className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
                   </div>
                   <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Nota: {progress.modules.find((m:any)=>m.id===activeModule.id).score.toFixed(1)}</h2>
                      <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-2">
                        {progress.modules.find((m:any)=>m.id===activeModule.id).score >= 8 ? 'Módulo Concluído com Sucesso!' : 'Nota insuficiente para aprovação (Mínimo 8.0)'}
                      </p>
                   </div>
                   <button onClick={() => setActiveModule(null)} className="w-full py-4 bg-black text-white rounded-sm font-black text-[10px] uppercase tracking-widest">FECHAR E VOLTAR</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
