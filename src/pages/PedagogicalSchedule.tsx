import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek,
  parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Filter,
  X,
  Loader2,
  MessageSquare,
  Send,
  Trash2,
  Edit2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getCollection, addDocument, auth, getUserProfile, updateDocument, deleteDocument } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { where, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

interface PedagogicalScheduleProps {
  viewOnly?: boolean;
}

export function PedagogicalSchedule({ viewOnly = false }: PedagogicalScheduleProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // New Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'aula',
    date: '',
    time: '',
    location: '',
  });

  const canManageEvents = !viewOnly && (currentUser?.role === 'pedagogical' || currentUser?.role === 'teacher' || currentUser?.role === 'admin');

  // Comments State
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSendingComment, setIsSendingComment] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        
        // If profile doesn't have role but we are in teacher or pedagogical context, inject it
        if (!profile || !profile.role) {
          const isTeacherPath = window.location.pathname.includes('/professor');
          const isPedagogicalPath = window.location.pathname.includes('/pedagogico');
          const teacherEmail = localStorage.getItem('p_teacher_email');
          
          const extendedProfile = {
            ...profile,
            uid: user.uid,
            name: profile?.name || localStorage.getItem('p_teacher_name') || user.displayName || 'Usuário',
            role: profile?.role || (isPedagogicalPath ? 'pedagogical' : (isTeacherPath || teacherEmail ? 'teacher' : 'student'))
          };
          setCurrentUser(extendedProfile);
        } else {
          setCurrentUser(profile);
        }
      } else {
        // Handle case where user might be accessing via mock login path
        const isPedagogicalPath = window.location.pathname.includes('/pedagogico');
        const teacherEmail = localStorage.getItem('p_teacher_email');
        if (isPedagogicalPath || teacherEmail) {
          setCurrentUser({
            name: localStorage.getItem('p_teacher_name') || 'Coordenação',
            role: isPedagogicalPath ? 'pedagogical' : 'teacher',
            uid: 'mock-id'
          });
        }
      }
    });

    fetchEvents();
    return () => unsubscribe();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const data = await getCollection('academic_events', [orderBy('date', 'asc')]);
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments(eventId: string) {
    try {
      const data = await getCollection('event_comments', [
        where('eventId', '==', eventId),
        orderBy('createdAt', 'asc')
      ]);
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await updateDocument('academic_events', editingEvent.id, {
          ...eventForm
        });
      } else {
        await addDocument('academic_events', {
          ...eventForm,
          creatorId: currentUser.uid,
          creatorName: currentUser.name,
          creatorRole: currentUser.role,
        });
      }
      setShowEventModal(false);
      setEditingEvent(null);
      setEventForm({ title: '', description: '', type: 'aula', date: '', time: '', location: '' });
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setEventForm({ 
      title: '', 
      description: '', 
      type: 'aula', 
      date: format(currentDate, 'yyyy-MM-dd'), 
      time: '08:00', 
      location: '' 
    });
    setShowEventModal(true);
  };

  const handleOpenEditModal = (event: any) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      type: event.type,
      date: event.date,
      time: event.time,
      location: event.location,
    });
    setShowEventModal(true);
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !selectedEvent || !currentUser) return;

    setIsSendingComment(true);
    try {
      await addDocument('event_comments', {
        eventId: selectedEvent.id,
        userId: currentUser.uid,
        userName: currentUser.name,
        userRole: currentUser.role,
        text: newComment,
      });
      setNewComment('');
      fetchComments(selectedEvent.id);
    } catch (err) {
      console.error("Error sending comment:", err);
    } finally {
      setIsSendingComment(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    try {
      await deleteDocument('academic_events', id);
      fetchEvents();
      if (selectedEvent?.id === id) setSelectedEvent(null);
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // Helper to format role names for display
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'pedagogical': return 'Coordenação';
      case 'teacher': return 'Professor';
      case 'student': return 'Aluno';
      default: return role;
    }
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  const handleDayClick = (day: Date) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      setSelectedEvent(dayEvents[0]);
      fetchComments(dayEvents[0].id);
    } else {
      setSelectedEvent({ 
        id: 'no-event', 
        title: 'Sem Eventos', 
        date: format(day, 'yyyy-MM-dd'), 
        description: 'Não há evento cadastrado para este dia.' 
      });
      setComments([]);
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E31E24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight underline decoration-[#E31E24] decoration-4 underline-offset-8 uppercase">Cronograma de Aulas</h1>
          <p className="text-gray-500 font-medium mt-2">Gerencie o calendário acadêmico, aulas presenciais e prazos de entrega.</p>
        </div>
        {canManageEvents && (
          <button 
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#E31E24] text-white px-6 py-4 rounded-sm font-black text-xs uppercase tracking-widest shadow-xl shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Novo Evento
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View (Interactive) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 uppercase text-sm tracking-widest">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                <span key={d} className="text-[10px] font-black text-gray-400 uppercase mb-2">{d}</span>
              ))}
              {calendarDays.map((day, i) => {
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                const isSelected = selectedEvent && isSameDay(parseISO(selectedEvent.date), day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                return (
                  <button 
                    key={i} 
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "aspect-square flex flex-col items-center justify-center font-bold rounded-sm cursor-pointer transition-all h-9 w-9 mx-auto relative",
                      !isCurrentMonth ? "opacity-20" : "",
                      isSelected 
                        ? "bg-[#E31E24] text-white shadow-lg shadow-[#E31E24]/20 z-10" 
                        : isToday
                          ? "border border-[#E31E24] text-[#E31E24]"
                          : "text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <span>{format(day, 'd')}</span>
                    {hasEvents && !isSelected && (
                      <div className={cn(
                        "absolute bottom-1 w-1 h-1 rounded-full",
                        dayEvents[0].type === 'aula' ? "bg-blue-500" :
                        dayEvents[0].type === 'workshop' ? "bg-purple-500" : "bg-red-500"
                      )}></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Legenda</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600 font-bold uppercase">Aula Presencial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600 font-bold uppercase">Workshop / Evento</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600 font-bold uppercase">Prazo de Entrega</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Event Details & Comments */}
          <AnimatePresence>
            {selectedEvent && (
              <div className="bg-white rounded-sm border border-gray-100 shadow-lg overflow-hidden flex flex-col h-[500px]">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-gray-900">
                  <div>
                    <h3 className="font-black uppercase text-xs tracking-wider">{selectedEvent.title}</h3>
                    <p className="text-[10px] text-gray-500 font-bold">
                      {format(parseISO(selectedEvent.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <button onClick={() => setSelectedEvent(null)}><X className="w-4 h-4 text-gray-400 hover:text-gray-900" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="bg-gray-50 p-3 rounded-sm text-xs text-gray-600 font-medium">
                    {selectedEvent.description || "Nenhuma descrição fornecida."}
                  </div>

                  {selectedEvent.id !== 'no-event' && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" />
                        Interações
                      </h4>
                      {comments.length === 0 ? (
                        <p className="text-center text-gray-400 text-[10px] py-4 italic font-medium">Nenhum comentário ainda.</p>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className={cn(
                            "p-3 rounded-sm space-y-1 border",
                            comment.userRole === 'student' ? "bg-white border-gray-100" : "bg-red-50/50 border-red-100"
                          )}>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-gray-900 uppercase">
                                {comment.userName} <span className="text-gray-400 font-bold ml-1">({getRoleLabel(comment.userRole)})</span>
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold">{new Date(comment.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed">{comment.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {selectedEvent.id !== 'no-event' && (
                  <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                        placeholder="Adicionar um comentário..."
                        className="flex-1 text-xs border border-gray-200 p-2 rounded-sm focus:ring-1 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none font-medium"
                      />
                      <button 
                        onClick={handleSendComment}
                        disabled={isSendingComment || !newComment.trim()}
                        className="p-2 bg-[#E31E24] text-white rounded-sm hover:bg-[#C1191F] disabled:opacity-50 transition-colors"
                      >
                        {isSendingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Próximos Eventos</h2>
            <button className="text-[#E31E24] text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1 transition-all">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>

          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-sm border border-gray-100 shadow-sm">
                <CalendarIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase text-xs">Nenhum evento registrado no cronograma.</p>
              </div>
            ) : (
              events.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => {
                    setSelectedEvent(event);
                    fetchComments(event.id);
                  }}
                  className={cn(
                    "bg-white p-6 rounded-sm border group hover:shadow-md transition-all cursor-pointer flex items-center justify-between",
                    selectedEvent?.id === event.id ? "border-[#E31E24] shadow-md" : "border-gray-100 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-sm border border-gray-100 group-hover:bg-[#E31E24]/5 group-hover:border-[#E31E24]/20 transition-all">
                      <span className="text-[10px] font-black text-gray-400 uppercase">{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}</span>
                      <span className="text-2xl font-black text-gray-900 group-hover:text-[#E31E24]">{new Date(event.date + 'T00:00:00').getDate()}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                          event.type === 'aula' ? "bg-blue-100 text-blue-600" :
                          event.type === 'workshop' ? "bg-purple-100 text-purple-600" : "bg-red-100 text-red-600"
                        )}>
                          {event.type}
                        </span>
                        <h3 className="text-base font-black text-gray-800 uppercase tracking-tight">{event.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-bold">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end mr-4">
                      <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                        <MessageSquare className="w-3 h-3" />
                        COMENTÁRIOS
                      </div>
                    </div>
                    {canManageEvents && (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(event);
                          }}
                          className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <button className="p-2 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-sm transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden border-t-4 border-[#E31E24]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                  {editingEvent ? 'Editar Evento Acadêmico' : 'Cadastrar Novo Evento'}
                </h2>
                <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSaveEvent} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título do Evento</label>
                  <input 
                    type="text" 
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none font-bold text-gray-700 bg-gray-50/30 rounded-sm"
                    placeholder="Ex: Aula Magna de Cinema"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo</label>
                    <select 
                      value={eventForm.type}
                      onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                      className="w-full border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none font-bold text-gray-700 bg-gray-50/30 rounded-sm"
                    >
                      <option value="aula">Aula Presencial</option>
                      <option value="workshop">Workshop</option>
                      <option value="prazo">Prazo de Entrega</option>
                      <option value="seminario">Seminário</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</label>
                    <input 
                      type="date" 
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none font-bold text-gray-700 bg-gray-50/30 rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horário</label>
                    <input 
                      type="time" 
                      required
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none font-bold text-gray-700 bg-gray-50/30 rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Local</label>
                    <input 
                      type="text" 
                      required
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      className="w-full border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none font-bold text-gray-700 bg-gray-50/30 rounded-sm"
                      placeholder="Ex: Sala 204"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição</label>
                  <textarea 
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-[#E31E24] focus:border-[#E31E24] outline-none font-bold text-gray-700 bg-gray-50/30 rounded-sm resize-none"
                    placeholder="Detalhes sobre o evento..."
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all font-black"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#E31E24] text-white px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#E31E24]/20 hover:bg-[#C1191F] disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-black"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingEvent ? 'Salvar Alterações' : 'Confirmar Evento')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
