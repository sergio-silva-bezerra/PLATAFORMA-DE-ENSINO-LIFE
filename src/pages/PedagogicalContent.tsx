import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Video, 
  FileText, 
  Link2, 
  Eye, 
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  X,
  Loader2,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getCollection, updateDocument } from '../lib/firebase';
import { Content, Subject } from '../types';

export function PedagogicalContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [subjectFilter, setSubjectFilter] = useState('Todas');
  const [search, setSearch] = useState('');
  
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [newStatus, setNewStatus] = useState<Content['status']>('Pendente');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const contentsData = await getCollection('contents') as Content[];
      const subjectsData = await getCollection('subjects') as Subject[];
      
      // Sort contents by date descending
      const sortedContents = contentsData.sort((a, b) => 
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );

      setContents(sortedContents);
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error fetching content data:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredContents = contents.filter(content => {
    const matchesFilter = filter === 'Todos' || content.type.toLowerCase() === filter.toLowerCase();
    const matchesSubject = subjectFilter === 'Todas' || content.subjectId === subjectFilter;
    const matchesSearch = content.title.toLowerCase().includes(search.toLowerCase()) || 
                         (content.teacherName || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSubject && matchesSearch;
  });

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContent) return;

    setSubmitting(true);
    try {
      await updateDocument('contents', selectedContent.id, {
        status: newStatus,
        feedback: feedbackText
      });
      await fetchData();
      setIsActionModalOpen(false);
      setSelectedContent(null);
    } catch (error) {
      console.error("Error updating content status:", error);
      alert("Erro ao atualizar status do conteúdo.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'link': return <Link2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: Content['status']) => {
    switch (status) {
      case 'Aprovado':
        return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Aprovado</span>;
      case 'Ajuste Necessário':
        return <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> Ajuste Necessário</span>;
      default:
        return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Pendente</span>;
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E31E24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Auditoria de Conteúdos</h1>
          <p className="text-gray-500 font-medium">Verifique e forneça feedback sobre os materiais postados pelos professores.</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total de Materiais', value: contents.length, icon: BookOpen, color: 'bg-gray-800' },
          { label: 'Aguardando Revisão', value: contents.filter(c => c.status === 'Pendente').length, icon: Clock, color: 'bg-blue-600' },
          { label: 'Aprovados', value: contents.filter(c => c.status === 'Aprovado').length, icon: CheckCircle, color: 'bg-green-600' },
          { label: 'Ajustes Pedidos', value: contents.filter(c => c.status === 'Ajuste Necessário').length, icon: AlertCircle, color: 'bg-orange-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={`${stat.color} p-4 rounded-sm text-white group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar por título ou professor..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {['Todos', 'Video', 'PDF', 'Link'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    filter === t 
                      ? "bg-[#E31E24] text-white shadow-lg shadow-[#E31E24]/20" 
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filtrar por Disciplina:</span>
            <select 
              className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="Todas">Todas as Disciplinas</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.tutorName})</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Conteúdo / Autor</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Disciplina</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Postado em</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-sm group-hover:bg-white transition-colors">
                        {getTypeIcon(content.type)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 group-hover:text-[#E31E24] transition-colors">{content.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <p className="text-[10px] text-gray-400 font-bold uppercase">
                            {content.teacherName && content.teacherName !== 'Professor' ? content.teacherName : 'Aguardando Atribuição'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 uppercase text-[10px] font-bold text-gray-500">
                    {content.type}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-[#E31E24] border border-[#E31E24]/20 px-2 py-0.5 rounded-sm uppercase">
                      {content.subjectName && content.subjectName !== 'N/A' ? content.subjectName : 'Disciplina Geral'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-medium">{new Date(content.createdAt || '').toLocaleDateString('pt-BR')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      {getStatusBadge(content.status)}
                    </div>
                    {content.feedback && (
                      <div className="flex items-center justify-center gap-1 mt-1 text-[9px] text-gray-400 italic">
                        <MessageSquare className="w-2.5 h-2.5" />
                        Comentado
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={content.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 text-gray-400 hover:text-[#E31E24] hover:bg-white rounded-sm transition-all shadow-sm border border-transparent hover:border-gray-100"
                        title="Abrir Material"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => {
                          setSelectedContent(content);
                          setFeedbackText(content.feedback || '');
                          setNewStatus(content.status);
                          setIsActionModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-[#E31E24] transition-all"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Revisar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredContents.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-gray-100 mx-auto" />
            <p className="text-gray-400 font-bold uppercase text-xs">Nenhum conteúdo postado para estes filtros.</p>
          </div>
        )}
      </div>

      {/* Action Modal (Review & Feedback) */}
      {isActionModalOpen && selectedContent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-sm w-full max-w-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gray-900 p-8 text-white flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">Revisão de Conteúdo</h3>
                <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">{selectedContent.title}</p>
              </div>
              <button 
                onClick={() => setIsActionModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStatus} className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avaliação da Coordenação</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['Pendente', 'Aprovado', 'Ajuste Necessário'] as Content['status'][]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setNewStatus(status)}
                      className={cn(
                        "p-4 rounded-sm border-2 text-center transition-all flex flex-col items-center gap-2",
                        newStatus === status
                          ? "border-[#E31E24] bg-red-50 text-[#E31E24]"
                          : "border-gray-50 bg-gray-50 text-gray-400 hover:bg-gray-100"
                      )}
                    >
                      {status === 'Aprovado' && <CheckCircle className="w-5 h-5" />}
                      {status === 'Pendente' && <Clock className="w-5 h-5" />}
                      {status === 'Ajuste Necessário' && <AlertCircle className="w-5 h-5" />}
                      <span className="text-[10px] font-black uppercase">{status}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" />
                  Feedback / Comentários para o Professor
                </label>
                <textarea 
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Descreva as orientações pedagógicas para este material..."
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 italic"
                />
                {selectedContent.teacherReply && (
                  <div className="mt-4 bg-blue-50 p-4 rounded-sm border-l-4 border-blue-600">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Resposta do Professor</span>
                      <span className="text-[9px] text-blue-400 font-medium">
                        {selectedContent.teacherReplyAt ? new Date(selectedContent.teacherReplyAt).toLocaleString('pt-BR') : ''}
                      </span>
                    </div>
                    <p className="text-sm text-blue-900">{selectedContent.teacherReply}</p>
                  </div>
                )}
                <p className="text-[10px] text-gray-400 italic mt-2">O professor verá este comentário no seu portal e poderá responder ou realizar correções.</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-50">
                <button 
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="flex-1 py-4 text-gray-500 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] py-4 bg-[#E31E24] text-white rounded-sm font-black text-xs uppercase tracking-widest shadow-lg shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Salvar Revisão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
