import React, { useEffect, useState } from 'react';
import { GraduationCap, Users, BookOpen, BarChart3, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { getCollection } from '../lib/firebase';

export function PedagogicalDashboard() {
  const [coursesCount, setCoursesCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const courses = await getCollection('courses');
        const subjects = await getCollection('subjects');
        setCoursesCount(courses.length);
        setSubjectsCount(subjects.length);
      } catch (err) {
        console.error("Error fetching pedagogical stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { label: 'Cursos Ativos', value: coursesCount.toString(), icon: GraduationCap, color: 'bg-purple-500' },
    { label: 'Disciplinas', value: subjectsCount.toString(), icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Matrículas Reais', value: '0', icon: Users, color: 'bg-green-500' },
    { label: 'Frequência Média', value: 'N/A', icon: Clock, color: 'bg-orange-500' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Status Curricular Real</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
             <BarChart3 className="w-12 h-12 text-gray-200" />
             <p className="text-gray-400 font-bold uppercase text-xs">Os gráficos de desempenho aparecerão conforme os dados reais forem inseridos.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Novos Alunos / Matrículas</h2>
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
             <Users className="w-12 h-12 text-gray-200" />
             <p className="text-gray-400 font-bold uppercase text-xs">Aguardando as primeiras matrículas via Portal do Aluno.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
