import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function TeacherClassroom() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inicio' | 'conteudo' | 'avaliacoes' | 'alunos' | 'forum'>('inicio');

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
              TÉCNICO EM ENFERMAGEM - MÓDULO B
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-black text-gray-900">Dr. Ricardo Santos</span>
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
            onClick={() => setActiveTab('inicio')}
            className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'inicio' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'inicio' ? 'text-white' : 'text-white/70'}`} />
            <span className="text-[9px] font-bold text-white uppercase mt-1">Início</span>
            {activeTab === 'inicio' && <motion.div layoutId="activeTab" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
          </button>

          <button 
            onClick={() => setActiveTab('conteudo')}
            className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'conteudo' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
          >
            <Upload className={`w-5 h-5 ${activeTab === 'conteudo' ? 'text-white' : 'text-white/70'}`} />
            <span className="text-[9px] font-bold text-white uppercase mt-1">Conteúdo</span>
            {activeTab === 'conteudo' && <motion.div layoutId="activeTab" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
          </button>

          <button 
            onClick={() => setActiveTab('avaliacoes')}
            className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'avaliacoes' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
          >
            <FilePlus className={`w-5 h-5 ${activeTab === 'avaliacoes' ? 'text-white' : 'text-white/70'}`} />
            <span className="text-[9px] font-bold text-white uppercase mt-1">Avaliações</span>
            {activeTab === 'avaliacoes' && <motion.div layoutId="activeTab" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
          </button>

          <button 
            onClick={() => setActiveTab('alunos')}
            className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'alunos' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
          >
            <Users className={`w-5 h-5 ${activeTab === 'alunos' ? 'text-white' : 'text-white/70'}`} />
            <span className="text-[9px] font-bold text-white uppercase mt-1">Alunos</span>
            {activeTab === 'alunos' && <motion.div layoutId="activeTab" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
          </button>

          <button 
            onClick={() => setActiveTab('forum')}
            className={`flex flex-col items-center group relative z-10 transition-all ${activeTab === 'forum' ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
          >
            <MessageSquare className={`w-5 h-5 ${activeTab === 'forum' ? 'text-white' : 'text-white/70'}`} />
            <span className="text-[9px] font-bold text-white uppercase mt-1">Fórum</span>
            {activeTab === 'forum' && <motion.div layoutId="activeTab" className="absolute -bottom-4 w-12 h-1 bg-[#E31E24]" />}
          </button>
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
                    Olá, Prof. Ricardo Santos
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
                  <button className="flex items-center gap-2 bg-[#E31E24] text-white px-6 py-3 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-[#C1191F] transition-all shadow-xl shadow-[#E31E24]/20">
                    <Plus className="w-4 h-4" />
                    Novo Material
                  </button>
                  <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-sm font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                    <Plus className="w-4 h-4" />
                    Nova Atividade
                  </button>
                </div>
              </div>

              {/* Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total de Alunos', value: '45', color: 'bg-blue-50 text-blue-600', icon: Users },
                  { label: 'Atividades Pendentes', value: '12', color: 'bg-orange-50 text-orange-600', icon: Clock },
                  { label: 'Novas Mensagens', value: '08', color: 'bg-purple-50 text-purple-600', icon: MessageSquare },
                  { label: 'Conteúdo Publicado', value: '24', color: 'bg-green-50 text-green-600', icon: CheckCircle2 },
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
                  <div className="relative w-64">
                    <input 
                      type="text" 
                      placeholder="Filtrar por nome..."
                      className="w-full bg-gray-50 border-none rounded-sm py-2 pl-3 pr-10 text-xs font-bold"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { 
                      title: 'Anatomia e Fisiologia Humana', 
                      students: 45, 
                      progress: 75,
                      nextClass: 'Amanhã, às 19:00',
                      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80'
                    },
                    { 
                      title: 'Bioestatística Aplicada', 
                      students: 38, 
                      progress: 40,
                      nextClass: 'Quarta, às 20:30',
                      image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80'
                    }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-white rounded-sm border border-gray-100 overflow-hidden group shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="h-32 bg-gray-900 relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-4 left-6">
                          <h3 className="text-white font-bold leading-tight uppercase tracking-tight">{item.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="font-bold text-gray-500">{item.students} Alunos Inscritos</span>
                          </div>
                          <span className="font-black text-[#E31E24]">{item.progress}% do conteúdo</span>
                        </div>
                        
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#E31E24] h-full transition-all duration-1000" 
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="w-4 h-4 text-orange-400" />
                            <span className="text-gray-500">Próxima Aula: <strong className="text-gray-700">{item.nextClass}</strong></span>
                          </div>
                          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'conteudo' && (
            <motion.div 
              key="conteudo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Gerenciador de Conteúdo</h2>
                <button className="bg-[#E31E24] text-white p-2 rounded-sm shadow-lg hover:bg-red-700">
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <aside className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-sm">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Pastas da Disciplina</h3>
                    <div className="space-y-2">
                      {['Módulo 1: Introdução', 'Módulo 2: Anatomia', 'Módulo 3: Fisiologia', 'Material de Apoio'].map((folder) => (
                        <button key={folder} className="w-full flex items-center justify-between p-3 bg-white border border-gray-100 rounded-sm hover:border-[#E31E24] group transition-all">
                          <span className="text-xs font-bold text-gray-600 group-hover:text-[#E31E24]">{folder}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                <div className="md:col-span-2 space-y-4">
                  {[
                    { type: 'video', name: 'Videoaula 01: Biologia Celular', date: 'Há 2 dias', size: '124MB' },
                    { type: 'pdf', name: 'Apostila Completa - Unidade 01', date: 'Há 5 dias', size: '2.4MB' },
                    { type: 'audio', name: 'Podcast: Sistemas do Corpo Humano', date: 'Ontem', size: '45MB' },
                  ].map((file, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-50 rounded-sm text-gray-400 group-hover:text-[#E31E24] transition-colors">
                          {file.type === 'video' && <Video className="w-6 h-6" />}
                          {file.type === 'pdf' && <FileText className="w-6 h-6" />}
                          {file.type === 'audio' && <Music className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">{file.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{file.date}</span>
                            <span className="text-[10px] font-bold text-gray-300">•</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{file.size}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-50 rounded-full">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-gray-100 rounded-sm p-12 flex flex-col items-center justify-center gap-4 hover:border-[#E31E24] hover:bg-red-50 transition-all group cursor-pointer">
                    <div className="bg-gray-50 p-4 rounded-full text-gray-400 group-hover:scale-110 group-hover:bg-[#E31E24] group-hover:text-white transition-all">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-700">Clique ou arraste para subir arquivos</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, Vídeos, Áudios ou ZIP (Máx. 200MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'alunos' && (
            <motion.div 
              key="alunos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Painel de Desempenho</h2>
                <div className="flex items-center gap-2">
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest">Relatório Completo</button>
                  <button className="bg-[#E31E24] text-white px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest">Lançar Notas</button>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aluno</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Freq.</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Progresso</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Última Nota</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Sérgio Silva Bezerra', reg: '2024.1.00245', freq: '98%', prog: 85, grade: '9.5' },
                      { name: 'Maria Eduarda Souza', reg: '2024.1.00288', freq: '92%', prog: 78, grade: '8.8' },
                      { name: 'João Victor Lima', reg: '2024.1.00312', freq: '85%', prog: 60, grade: '7.5' },
                      { name: 'Ana Paula Santos', reg: '2024.1.00415', freq: '100%', prog: 92, grade: '10.0' },
                    ].map((aluno, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-400 group-hover:bg-[#E31E24]/10 group-hover:text-[#E31E24] transition-colors">
                              {aluno.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">{aluno.name}</p>
                              <p className="text-[10px] font-medium text-gray-400">Matrícula: {aluno.reg}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-600">{aluno.freq}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                               <div className="bg-green-500 h-full" style={{ width: `${aluno.prog}%` }}></div>
                             </div>
                             <span className="text-[10px] font-black text-gray-400">{aluno.prog}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-3 py-1 bg-gray-900 text-white rounded-sm text-xs font-black tracking-tighter">{aluno.grade}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 hover:bg-white rounded-sm border border-transparent hover:border-gray-200 transition-all">
                               <MessageSquare className="w-4 h-4 text-gray-400" />
                             </button>
                             <button className="p-2 hover:bg-white rounded-sm border border-transparent hover:border-gray-200 transition-all">
                               <ChevronRight className="w-4 h-4 text-gray-400" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
      </main>
    </div>
  );
}

const AlertTriangle = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>
);
