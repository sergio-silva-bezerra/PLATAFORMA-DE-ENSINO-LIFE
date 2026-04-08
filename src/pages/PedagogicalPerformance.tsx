import React from 'react';
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

const PERFORMANCE_DATA = [
  { name: 'Jan', media: 7.5, frequencia: 85 },
  { name: 'Fev', media: 8.2, frequencia: 92 },
  { name: 'Mar', media: 7.8, frequencia: 88 },
  { name: 'Abr', media: 8.4, frequencia: 95 },
];

const GRADE_DISTRIBUTION = [
  { name: 'Excelente (9-10)', value: 25, color: '#10B981' },
  { name: 'Bom (7-8)', value: 45, color: '#3B82F6' },
  { name: 'Regular (5-6)', value: 20, color: '#F59E0B' },
  { name: 'Abaixo (0-4)', value: 10, color: '#EF4444' },
];

export function PedagogicalPerformance() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Desempenho</h1>
          <p className="text-gray-500">Análise estatística de notas, frequência e engajamento dos alunos.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
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
          { label: 'Média Geral', value: '8.4', icon: Award, color: 'bg-blue-500', trend: '+0.5' },
          { label: 'Frequência', value: '92%', icon: Users, color: 'bg-green-500', trend: '+2%' },
          { label: 'Engajamento', value: '78%', icon: TrendingUp, color: 'bg-purple-500', trend: '-3%' },
          { label: 'Alunos em Alerta', value: '12', icon: AlertCircle, color: 'bg-red-500', trend: '-2' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
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
              <LineChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="media" stroke="#E31E24" strokeWidth={3} dot={{ r: 6, fill: '#E31E24' }} />
                <Line type="monotone" dataKey="frequencia" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6, fill: '#3B82F6' }} />
              </LineChart>
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
                <PieChart>
                  <Pie
                    data={GRADE_DISTRIBUTION}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {GRADE_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              {GRADE_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
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
