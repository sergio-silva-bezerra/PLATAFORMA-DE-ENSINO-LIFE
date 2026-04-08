import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  HeartPulse,
  Calendar,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/pedagogico' },
  { icon: HeartPulse, label: 'Turmas', path: '/pedagogico/turmas' },
  { icon: Users, label: 'Alunos', path: '/pedagogico/alunos' },
  { icon: BookOpen, label: 'Conteúdos', path: '/pedagogico/conteudos' },
  { icon: Calendar, label: 'Cronograma', path: '/pedagogico/cronograma' },
  { icon: BarChart3, label: 'Desempenho', path: '/pedagogico/desempenho' },
];

export function PedagogicalSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#E31E24] p-2 rounded-lg">
            <HeartPulse className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tighter text-gray-900">Life</span>
        </div>
        <p className="text-[10px] font-bold text-[#E31E24] uppercase tracking-[0.2em] mt-2 ml-1">Pedagógico</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
              isActive 
                ? "bg-[#E31E24] text-white shadow-lg shadow-[#E31E24]/20" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
          <Settings className="w-5 h-5" />
          Configurações
        </button>
        <NavLink
          to="/login"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sair do Portal
        </NavLink>
      </div>
    </aside>
  );
}
