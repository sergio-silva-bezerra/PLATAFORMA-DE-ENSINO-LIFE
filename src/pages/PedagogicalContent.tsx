import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Video, 
  FileText, 
  Link2, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2,
  CheckCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_CONTENTS = [
  { 
    id: '1', 
    title: 'Introdução à Direção Cinematográfica', 
    type: 'Video', 
    discipline: 'Direção em Cinema', 
    date: '2026-04-01', 
    status: 'Publicado',
    author: 'Prof. Franthiesco Manso'
  },
  { 
    id: '2', 
    title: 'Guia de Roteiro: Estrutura em 3 Atos', 
    type: 'PDF', 
    discipline: 'Roteiro para Cinema', 
    date: '2026-03-28', 
    status: 'Publicado',
    author: 'Prof. Tereza Carla'
  },
  { 
    id: '3', 
    title: 'Referências de Iluminação Noir', 
    type: 'Link', 
    discipline: 'Fotografia e Iluminação', 
    date: '2026-04-02', 
    status: 'Rascunho',
    author: 'Prof. Adilson da Silva'
  },
  { 
    id: '4', 
    title: 'História do Cinema Brasileiro', 
    type: 'Video', 
    discipline: 'História do Cinema', 
    date: '2026-03-25', 
    status: 'Publicado',
    author: 'Prof. Franthiesco Manso'
  },
];

export function PedagogicalContent() {
  const [contents, setContents] = useState(MOCK_CONTENTS);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'Video',
    discipline: '',
    author: 'Prof. Franthiesco Manso'
  });

  const filteredContents = contents.filter(content => {
    const matchesFilter = filter === 'Todos' || content.type === filter;
    const matchesSearch = content.title.toLowerCase().includes(search.toLowerCase()) || 
                         content.discipline.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddContent = (e: React.FormEvent) => {
    e.preventDefault();
    const content = {
      ...newContent,
      id: String(contents.length + 1),
      date: new Date().toISOString().split('T')[0],
      status: 'Publicado'
    };
    setContents([content, ...contents]);
    setIsModalOpen(false);
    setNewContent({ title: '', type: 'Video', discipline: '', author: 'Prof. Franthiesco Manso' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video className="w-4 h-4" />;
      case 'PDF': return <FileText className="w-4 h-4" />;
      case 'Link': return <Link2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Conteúdos</h1>
          <p className="text-gray-500">Publique e gerencie materiais de estudo, vídeos e documentos para os alunos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#E31E24] text-white px-6 py-3 rounded-sm font-bold text-sm shadow-lg shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all"
        >
          <Plus className="w-5 h-5" />
          Novo Conteúdo
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total de Materiais', value: contents.length, icon: BookOpenIcon, color: 'bg-blue-500' },
          { label: 'Vídeos Publicados', value: contents.filter(c => c.type === 'Video').length, icon: Video, color: 'bg-purple-500' },
          { label: 'Documentos PDF', value: contents.filter(c => c.type === 'PDF').length, icon: FileText, color: 'bg-orange-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-sm text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-sm border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por título ou disciplina..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {['Todos', 'Video', 'PDF', 'Link'].map((t) => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "px-4 py-2 rounded-sm text-xs font-bold transition-all whitespace-nowrap",
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Conteúdo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Disciplina</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredContents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{content.title}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{content.author}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      {getTypeIcon(content.type)}
                      <span className="text-xs font-medium">{content.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{content.discipline}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(content.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit",
                      content.status === 'Publicado' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {content.status === 'Publicado' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {content.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#E31E24] hover:bg-gray-50 rounded-sm transition-colors" title="Visualizar">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-50 rounded-sm transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-sm transition-colors" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredContents.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-400 font-medium">Nenhum conteúdo encontrado para os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* New Content Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-[#E31E24] p-6 text-white">
              <h3 className="text-xl font-bold">Postar Novo Conteúdo</h3>
              <p className="text-white/80 text-xs mt-1">Preencha os dados abaixo para disponibilizar o material.</p>
            </div>
            <form onSubmit={handleAddContent} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Título do Conteúdo</label>
                <input 
                  type="text" 
                  required
                  value={newContent.title}
                  onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                  placeholder="Ex: Aula 01 - Introdução"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tipo</label>
                  <select 
                    value={newContent.type}
                    onChange={(e) => setNewContent({...newContent, type: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24]"
                  >
                    <option value="Video">Vídeo</option>
                    <option value="PDF">Documento PDF</option>
                    <option value="Link">Link Externo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Disciplina</label>
                  <input 
                    type="text" 
                    required
                    value={newContent.discipline}
                    onChange={(e) => setNewContent({...newContent, discipline: e.target.value})}
                    placeholder="Ex: Direção"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24]/20 focus:border-[#E31E24]"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-sm font-bold text-sm hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#E31E24] text-white rounded-sm font-bold text-sm shadow-lg shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all"
                >
                  Publicar Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BookOpenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
