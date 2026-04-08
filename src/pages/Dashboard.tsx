import React from 'react';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', alunos: 400, financeiro: 2400 },
  { name: 'Fev', alunos: 300, financeiro: 1398 },
  { name: 'Mar', alunos: 200, financeiro: 9800 },
  { name: 'Abr', alunos: 278, financeiro: 3908 },
  { name: 'Mai', alunos: 189, financeiro: 4800 },
  { name: 'Jun', alunos: 239, financeiro: 3800 },
];

const stats = [
  { label: 'Total de Alunos', value: '1,284', icon: Users, color: 'bg-blue-500', trend: '+12%', trendUp: true },
  { label: 'Cursos Ativos', value: '24', icon: GraduationCap, color: 'bg-[#E31E24]', trend: '+2', trendUp: true },
  { label: 'Receita Mensal', value: 'R$ 142.5k', icon: TrendingUp, color: 'bg-purple-500', trend: '+8.4%', trendUp: true },
  { label: 'Inadimplência', value: '4.2%', icon: AlertCircle, color: 'bg-red-500', trend: '-0.5%', trendUp: false },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativa</h1>
        <p className="text-gray-500">Bem-vindo de volta! Aqui está o resumo da sua instituição.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={cn("p-3 rounded-sm text-white", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-sm",
                stat.trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Novas Matrículas</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f9fafb'}}
                />
                <Bar dataKey="alunos" fill="#E31E24" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Desempenho Financeiro</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="financeiro" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorFin)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
