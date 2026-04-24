import React, { useEffect, useState } from 'react';
import { GraduationCap, Users, BookOpen, BarChart3, Clock, CheckCircle, Loader2, Microscope, Check, X } from 'lucide-react';
import { getCollection, updateDocument } from '../lib/firebase';
import { where, orderBy } from 'firebase/firestore';

export function PedagogicalDashboard() {
  const [coursesCount, setCoursesCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [biosafetyStats, setBiosafetyStats] = useState({ released: 0, total: 0 });
  const [pendingSchedules, setPendingSchedules] = useState<any[]>([]);
  const [activeSchedules, setActiveSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const courses = await getCollection('courses');
      const subjects = await getCollection('subjects');
      const students = await getCollection('users', [where('role', '==', 'student')]);
      const biosafety = await getCollection('biosafety_progress');
      const pending = await getCollection('lab_schedules', [where('status', '==', 'Pendente'), orderBy('date', 'asc')]);
      const active = await getCollection('lab_schedules', [where('status', '==', 'Aprovado'), where('date', '==', new Date().toISOString().split('T')[0])]);
      
      setCoursesCount(courses.length);
      setSubjectsCount(subjects.length);
      setStudentsCount(students.length);
      setBiosafetyStats({
        released: biosafety.filter((p: any) => p.overallStatus === 'released').length,
        total: biosafety.length
      });
      setPendingSchedules(pending);
      setActiveSchedules(active);
    } catch (err) {
      console.error("Error fetching pedagogical stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'Aprovado' | 'Recusado') => {
    try {
      await updateDocument('lab_schedules', id, { status: newStatus });
      setPendingSchedules(pendingSchedules.filter(s => s.id !== id));
    } catch (err) {
      alert("Erro ao atualizar status.");
    }
  };

  const stats = [
    { label: 'Cursos Ativos', value: coursesCount > 0 ? coursesCount.toString() : '0', icon: GraduationCap, color: 'bg-red-600' },
    { label: 'Disciplinas', value: subjectsCount > 0 ? subjectsCount.toString() : '0', icon: BookOpen, color: 'bg-red-500' },
    { label: 'Alunos Matriculados', value: studentsCount > 0 ? studentsCount.toString() : '0', icon: Users, color: 'bg-red-700' },
    { 
      label: 'Biossegurança (Aptos)', 
      value: biosafetyStats.total > 0 ? `${biosafetyStats.released}/${biosafetyStats.total}` : '0/0', 
      icon: CheckCircle, 
      color: 'bg-green-600' 
    },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E31E24] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Painel Pedagógico Real</h1>
        <p className="text-gray-500 font-medium">Gestão acadêmica em tempo real baseada no seu banco de dados Firebase.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
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

      <div className="grid grid-cols-1 gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-red-50 rounded-sm">
              <Microscope className="w-6 h-6 text-[#E31E24]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Laboratórios Ativos (Hoje)</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ocupação física confirmada para hoje.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {activeSchedules.length === 0 ? (
              <div className="py-8 text-center text-gray-400 font-bold uppercase text-xs">Nenhum laboratório ocupado agora.</div>
            ) : (
              activeSchedules.map((s) => (
                <div key={s.id} className="p-4 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{s.labName}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{s.subjectName} • {s.startTime} - {s.endTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-green-600 uppercase">EM CURSO</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-red-50 rounded-sm">
              <Users className="w-6 h-6 text-[#E31E24]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Solicitações de Agendamento</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pedidos de professores para aulas extras ou reposições.</p>
            </div>
          </div>
          
          <div className="divide-y divide-gray-50 border-t border-gray-50">
            {pendingSchedules.length === 0 ? (
              <div className="py-8 text-center text-gray-400 font-bold uppercase text-xs">Nenhuma solicitação pendente.</div>
            ) : (
              pendingSchedules.map((s) => (
                <div key={s.id} className="py-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400">
                      {s.teacherName.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{s.teacherName}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {s.labName} • {s.date} às {s.startTime} • {s.studentsCount} Alunos
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(s.id, 'Aprovado')}
                      className="px-4 py-1.5 bg-green-600 text-white text-[10px] font-black rounded-sm uppercase hover:bg-green-700 transition-all"
                    >
                      APROVAR
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(s.id, 'Recusado')}
                      className="px-4 py-1.5 bg-white border border-gray-200 text-gray-400 text-[10px] font-black rounded-sm uppercase hover:text-red-500 hover:border-red-500 transition-all"
                    >
                      RECUSAR
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

        <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Status Curricular Real</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
             <BarChart3 className="w-12 h-12 text-gray-200" />
             <p className="text-gray-400 font-bold uppercase text-xs">Os gráficos de desempenho aparecerão conforme os dados reais forem inseridos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
