import React, { useState, useEffect } from 'react';
import { Microscope, Users, Calendar, Clock, MapPin, AlertCircle, Plus, X, Loader2, Check, XCircle, Search } from 'lucide-react';
import { auth, getCollection, addDocument, updateDocument, getUserProfile, getBiosafetyProgress } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { where, orderBy, Timestamp } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

interface Laboratory {
  id: string;
  name: string;
  location: string;
  benches: number;
  status: 'Ativo' | 'Manutenção' | 'Inativo';
  occupied?: number;
}

interface LabSchedule {
  id: string;
  labId: string;
  labName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime: string;
  studentsCount: number;
  status: 'Pendente' | 'Aprovado' | 'Recusado' | 'Cancelado';
}

export default function LabManagement() {
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [schedules, setSchedules] = useState<LabSchedule[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showLabModal, setShowLabModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [labForm, setLabForm] = useState({ name: '', location: '', benches: 10, status: 'Ativo' as const });
  const [scheduleForm, setScheduleForm] = useState({ labId: '', date: '', startTime: '', endTime: '', subjectId: '', studentsCount: 1 });

  // Secondary data
  const [subjects, setSubjects] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    async function loadData() {
      if (!auth.currentUser) return;
      try {
        const [profile, labsData, schedulesData, subjectsData] = await Promise.all([
          getUserProfile(auth.currentUser.uid),
          getCollection('laboratories'),
          getCollection('lab_schedules', [orderBy('date', 'desc')]),
          getCollection('subjects')
        ]);

        setUserProfile(profile);
        setLabs(labsData);
        setSchedules(schedulesData);
        setSubjects(subjectsData);

        // Check for deep link action
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'new_lab') {
          setShowLabModal(true);
        }
      } catch (err) {
        console.error("Error loading lab data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateLab = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addDocument('laboratories', labForm);
      const updatedLabs = await getCollection('laboratories');
      setLabs(updatedLabs);
      setShowLabModal(false);
      setLabForm({ name: '', location: '', benches: 10, status: 'Ativo' });
    } catch (err) {
      alert("Erro ao criar laboratório.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // If student is scheduling, check biosafety
      if (userProfile?.role === 'student') {
        const biosafety = await getBiosafetyProgress(auth.currentUser!.uid);
        if (biosafety?.overallStatus !== 'released') {
          alert("Acesso bloqueado: Você precisa concluir todos os módulos de biossegurança primeiro.");
          setIsSaving(false);
          return;
        }
      }

      const selectedLab = labs.find(l => l.id === scheduleForm.labId);
      const selectedSubject = subjects.find(s => s.id === scheduleForm.subjectId);

      const newSchedule = {
        ...scheduleForm,
        labName: selectedLab?.name || '',
        subjectName: selectedSubject?.name || 'Prática Livre',
        teacherId: auth.currentUser?.uid,
        teacherName: auth.currentUser?.displayName || 'Usuário',
        status: (userProfile?.role === 'pedagogical' || userProfile?.role === 'admin') ? 'Aprovado' : 'Pendente',
        createdAt: new Date().toISOString()
      };

      await addDocument('lab_schedules', newSchedule);
      const updatedSchedules = await getCollection('lab_schedules', [orderBy('date', 'desc')]);
      setSchedules(updatedSchedules);
      setShowScheduleModal(false);
      setScheduleForm({ labId: '', date: '', startTime: '', endTime: '', subjectId: '', studentsCount: 1 });
    } catch (err) {
      alert("Erro ao criar agendamento.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'Aprovado' | 'Recusado') => {
    try {
      await updateDocument('lab_schedules', id, { status: newStatus });
      setSchedules(schedules.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (err) {
      alert("Erro ao atualizar status.");
    }
  };

  const isStaff = userProfile?.role === 'pedagogical' || userProfile?.role === 'admin' || userProfile?.role === 'secretariat';
  const isTeacher = userProfile?.role === 'teacher';
  const canManageLabs = isStaff || location.pathname.startsWith('/pedagogico');

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#E31E24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Gestão de Laboratórios</h1>
          <p className="text-gray-500 font-medium tracking-tight">Controle de ocupação física e agendamento de bancadas.</p>
        </div>
        <div className="flex gap-3">
          {canManageLabs && (
            <button 
              onClick={() => setShowLabModal(true)}
              className="bg-white border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Laboratório
            </button>
          )}
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="bg-[#E31E24] text-white px-6 py-3 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {labs.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-6">
            <div className="p-6 bg-gray-50 rounded-full">
              <Microscope className="w-12 h-12 text-gray-300" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-900 font-black uppercase text-sm tracking-widest">Nenhum laboratório cadastrado.</p>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-tight">Comece cadastrando as unidades físicas para habilitar agendamentos.</p>
            </div>
            {canManageLabs && (
              <button 
                onClick={() => setShowLabModal(true)}
                className="bg-black text-white px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#E31E24] transition-all shadow-xl shadow-gray-200"
              >
                Cadastrar Primeiro Laboratório
              </button>
            )}
          </div>
        ) : (
          labs.map((lab) => {
            const currentSchedule = schedules.find(s => s.labId === lab.id && s.status === 'Aprovado' && s.date === new Date().toISOString().split('T')[0]);
            return (
              <motion.div 
                layout
                key={lab.id} 
                className="bg-white rounded-sm border border-gray-100 shadow-xl overflow-hidden group hover:border-[#E31E24] transition-all"
              >
                <div className="p-8 border-b border-gray-50">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-red-50 rounded-sm group-hover:bg-[#E31E24] group-hover:text-white transition-colors">
                      <Microscope className="w-8 h-8 text-[#E31E24] group-hover:text-white" />
                    </div>
                    <span className={`px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      lab.status === 'Ativo' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {lab.status}
                    </span>
                  </div>
                  <h3 className="font-black text-gray-900 text-xl uppercase tracking-tighter">{lab.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-2 font-medium">
                    <MapPin className="w-3 h-3 text-[#E31E24]" /> {lab.location}
                  </p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ocupação de Bancadas</span>
                      <span className="font-black text-gray-900">{currentSchedule?.studentsCount || 0} / {lab.benches}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 bg-[#E31E24]`}
                        style={{ width: `${((currentSchedule?.studentsCount || 0) / lab.benches) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-50 space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grade de Hoje</p>
                    {currentSchedule ? (
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-sm">
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase">{currentSchedule.subjectName}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">{currentSchedule.teacherName}</p>
                        </div>
                        <span className="text-xs font-black text-[#E31E24] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {currentSchedule.startTime}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Nenhuma atividade registrada para hoje.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {isStaff && (
        <div className="bg-white rounded-sm border border-gray-100 shadow-2xl overflow-hidden mt-12">
          <div className="bg-[#151619] p-8 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-sm">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="font-black uppercase tracking-widest text-sm">Solicitações de Agendamento</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Gestão de ocupação e reservas extraordinárias.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-b border-gray-100">
             <div className="flex gap-4">
                <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input 
                    type="text" 
                    placeholder="Filtrar por professor, laboratório ou data..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-sm text-xs font-bold uppercase tracking-widest outline-none focus:border-[#E31E24]"
                   />
                </div>
             </div>
          </div>
          <div className="divide-y divide-gray-100 overflow-x-auto">
            {schedules.filter(s => s.status === 'Pendente').length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                Nenhuma solicitação pendente no momento.
              </div>
            ) : (
              schedules.filter(s => s.status === 'Pendente').map((s) => (
                <div key={s.id} className="flex items-center justify-between p-8 bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-400 uppercase">
                      {s.teacherName.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{s.teacherName}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        {s.labName} • {s.date} às {s.startTime} • {s.studentsCount} Vagas
                      </p>
                      <span className="text-[10px] text-gray-400 font-black uppercase mt-1 block">{s.subjectName}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(s.id, 'Aprovado')}
                      className="px-6 py-2 bg-green-600 text-white text-[10px] font-black rounded-sm uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-500/10"
                    >
                      Aprovar
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(s.id, 'Recusado')}
                      className="px-6 py-2 bg-white border-2 border-gray-200 text-gray-400 text-[10px] font-black rounded-sm uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Lab Modal */}
      <AnimatePresence>
        {showLabModal && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden"
            >
              <div className="bg-[#151619] p-8 text-white relative">
                <button onClick={() => setShowLabModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X /></button>
                <h2 className="text-xl font-black uppercase tracking-tighter">Novo Laboratório</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Defina a estrutura física da unidade.</p>
              </div>
              <form onSubmit={handleCreateLab} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome do Lab</label>
                  <input 
                    required
                    value={labForm.name}
                    onChange={e => setLabForm({...labForm, name: e.target.value})}
                    type="text" 
                    placeholder="Ex: Lab de Anatomia II" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bancadas</label>
                    <input 
                      required
                      value={labForm.benches}
                      onChange={e => setLabForm({...labForm, benches: parseInt(e.target.value)})}
                      type="number" 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Inicial</label>
                    <select 
                      value={labForm.status}
                      onChange={e => setLabForm({...labForm, status: e.target.value as any})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm appearance-none"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Manutenção">Manutenção</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localização</label>
                  <input 
                    required
                    value={labForm.location}
                    onChange={e => setLabForm({...labForm, location: e.target.value})}
                    type="text" 
                    placeholder="Ex: Campus Boa Vista - Bloco C" 
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm" 
                  />
                </div>
                <button 
                  disabled={isSaving}
                  type="submit"
                  className="w-full py-5 bg-black text-white rounded-sm font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#E31E24] transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : 'CRIAR LABORATÓRIO'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden"
            >
              <div className="bg-[#E31E24] p-8 text-white relative">
                <button onClick={() => setShowScheduleModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X /></button>
                <h2 className="text-xl font-black uppercase tracking-tighter">Reservar Laboratório</h2>
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">
                  Selecione o laboratório e horário para sua atividade.
                </p>
              </div>
              <form onSubmit={handleCreateSchedule} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Laboratório</label>
                  <select 
                    required
                    value={scheduleForm.labId}
                    onChange={e => setScheduleForm({...scheduleForm, labId: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm"
                  >
                    <option value="">Selecione um laboratório</option>
                    {labs.map(l => <option key={l.id} value={l.id}>{l.name} ({l.location})</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</label>
                    <input 
                      required
                      type="date"
                      value={scheduleForm.date}
                      onChange={e => setScheduleForm({...scheduleForm, date: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vagas Necessárias</label>
                    <input 
                      required
                      type="number"
                      value={scheduleForm.studentsCount}
                      onChange={e => setScheduleForm({...scheduleForm, studentsCount: parseInt(e.target.value)})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Início</label>
                    <input 
                      required
                      type="time"
                      value={scheduleForm.startTime}
                      onChange={e => setScheduleForm({...scheduleForm, startTime: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Término</label>
                    <input 
                      required
                      type="time"
                      value={scheduleForm.endTime}
                      onChange={e => setScheduleForm({...scheduleForm, endTime: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disciplina / Finalidade</label>
                   <select 
                    value={scheduleForm.subjectId}
                    onChange={e => setScheduleForm({...scheduleForm, subjectId: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#E31E24] font-bold text-sm"
                  >
                    <option value="">Prática Livre / Estudo Individual</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="p-4 bg-amber-50 rounded-sm border border-amber-100 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-[10px] text-amber-700 font-bold uppercase leading-relaxed">
                    Importante: Agendamentos de alunos estão sujeitos à liberação do módulo de biossegurança e disponibilidade de bancadas.
                  </p>
                </div>

                <button 
                  disabled={isSaving}
                  type="submit"
                  className="w-full py-5 bg-black text-white rounded-sm font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-black/90 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : 'SOLICITAR AGENDAMENTO'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
