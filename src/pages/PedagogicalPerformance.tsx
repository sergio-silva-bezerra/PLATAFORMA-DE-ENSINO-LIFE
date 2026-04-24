import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Award, 
  AlertCircle,
  Download,
  Filter
} from 'lucide-react';
import { getCollection } from '../lib/firebase';
import { where } from 'firebase/firestore';

export function PedagogicalPerformance() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    mediaGeral: '-',
    frequencia: '-',
    engajamento: '-',
    alunosAlerta: '-',
    performanceData: [] as any[],
    gradeDistribution: [] as any[]
  });

  useEffect(() => {
    async function fetchRealData() {
      try {
        setLoading(true);
        
        // Fetch students
        const students = await getCollection('users', [where('role', '==', 'student')]) as any[];
        
        // Fetch all grades
        const allGrades = await getCollection('grades') as any[];
        
        // Fetch submissions and assessments for engagement
        const submissions = await getCollection('submissions') as any[];
        const assessments = await getCollection('assessments') as any[];

        if (students.length === 0) {
          setStats({
            mediaGeral: '-',
            frequencia: '-',
            engajamento: '-',
            alunosAlerta: '-',
            performanceData: [],
            gradeDistribution: []
          });
          setLoading(false);
          return;
        }

        // Calculate Average Grade
        let totalSum = 0;
        let count = 0;
        allGrades.forEach(g => {
          const val = parseFloat(g.value);
          if (!isNaN(val)) {
            totalSum += val;
            count++;
          }
        });
        const mediaGeralVal = count > 0 ? (totalSum / count).toFixed(1) : '-';

        // Calculate Alunos em Alerta (Average < 6.0)
        const studentAverages = students.map(student => {
          const studentGrades = allGrades.filter(g => g.studentId === student.uid);
          if (studentGrades.length === 0) return null;
          const sum = studentGrades.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0);
          return sum / studentGrades.length;
        });

        const alertCount = studentAverages.filter(avg => avg !== null && avg < 6.0).length;

        // Calculate Engagement (Submissions / (Students * Assessments))
        let engagementVal = '-';
        if (students.length > 0 && assessments.length > 0) {
          const totalPossibleSubmissions = students.length * assessments.length;
          const actualSubmissions = submissions.length;
          engagementVal = `${Math.min(100, Math.round((actualSubmissions / totalPossibleSubmissions) * 100))}%`;
        }

        // Grade Distribution
        const distribution = [
          { name: 'Excelente (9-10)', value: 0, color: '#10B981' },
          { name: 'Bom (7-8)', value: 0, color: '#3B82F6' },
          { name: 'Regular (5-6)', value: 0, color: '#F59E0B' },
          { name: 'Abaixo (0-4)', value: 0, color: '#EF4444' },
        ];

        allGrades.forEach(g => {
          const v = parseFloat(g.value);
          if (v >= 9) distribution[0].value++;
          else if (v >= 7) distribution[1].value++;
          else if (v >= 5) distribution[2].value++;
          else distribution[3].value++;
        });

        // Convert distribution to percentages for chart
        const totalDistribution = distribution.reduce((acc, curr) => acc + curr.value, 0);
        const gradeDistribution = distribution.map(d => ({
          ...d,
          value: totalDistribution > 0 ? Math.round((d.value / totalDistribution) * 100) : 0
        }));

        // Performance Data (Monthly evolution - Mocked for now as we don't have historical snapshots stored)
        // In a real app, this would come from a 'monthly_statistics' collection
        const performanceData = [
          { name: 'Meta', media: 7.0, frequencia: 90 },
          { name: 'Atual', media: count > 0 ? parseFloat(mediaGeralVal) : 0, frequencia: 0 },
        ];

        setStats({
          mediaGeral: mediaGeralVal,
          frequencia: '-', // We don't have frequency data in blueprint
          engajamento: engagementVal,
          alunosAlerta: alertCount.toString(),
          performanceData,
          gradeDistribution
        });

      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRealData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E31E24]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Desempenho</h1>
          <p className="text-gray-500">Análise estatística de notas, frequência e engajamento dos alunos.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-sm font-bold text-sm hover:bg-gray-50 transition-all">
            <Download className="w-5 h-5" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 bg-[#E31E24] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#E31E24]/20 hover:bg-[#C1191F] transition-all">
            <Filter className="w-5 h-5" />
            Filtrar Turma
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Média Geral', value: stats.mediaGeral, icon: Award, color: 'bg-blue-500', trend: '' },
          { label: 'Frequência', value: stats.frequencia, icon: Users, color: 'bg-green-500', trend: '' },
          { label: 'Engajamento', value: stats.engajamento, icon: TrendingUp, color: 'bg-purple-500', trend: '' },
          { label: 'Alunos em Alerta', value: stats.alunosAlerta, icon: AlertCircle, color: 'bg-red-500', trend: '' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-sm text-white`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.trend && (
                <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Evolução de Desempenho</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {stats.performanceData.length > 0 ? (
                <LineChart data={stats.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="media" stroke="#E31E24" strokeWidth={3} dot={{ r: 6, fill: '#E31E24' }} />
                  <Line type="monotone" dataKey="frequencia" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6, fill: '#3B82F6' }} />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 font-bold italic uppercase tracking-widest text-xs bg-gray-50 rounded-sm">
                  Dados insuficientes para gerar gráfico
                </div>
              )}
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E31E24] rounded-full"></div>
              <span className="text-xs font-bold text-gray-500">Média de Notas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#3B82F6] rounded-full"></div>
              <span className="text-xs font-bold text-gray-500">Frequência (%)</span>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Distribuição de Notas</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-[240px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                {stats.gradeDistribution.some(d => d.value > 0) ? (
                  <PieChart>
                    <Pie
                      data={stats.gradeDistribution}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 font-bold italic uppercase tracking-widest text-xs bg-gray-50 rounded-full border-4 border-dashed border-gray-100">
                    Sem Dados
                  </div>
                )}
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {stats.gradeDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
