import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  DollarSign, 
  FileText, 
  Settings, 
  LogOut,
  HeartPulse
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Secretaria (Alunos)', path: '/admin/alunos' },
  { icon: BookOpen, label: 'Pedagógico (Cursos)', path: '/admin/cursos' },
  { icon: DollarSign, label: 'Financeiro', path: '/admin/financeiro' },
  { icon: FileText, label: 'Solicitações', path: '/admin/solicitacoes' },
  { icon: HeartPulse, label: 'Portal do Aluno', path: '/aluno' },
];

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Here you could also clear session/local storage if needed
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="bg-[#E31E24] p-2 rounded-sm">
          <HeartPulse className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-xl text-gray-900 leading-none">Life</span>
          <span className="text-[10px] font-bold text-[#E31E24] uppercase tracking-widest">Cursos Técnicos</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group",
              isActive 
                ? "bg-[#E31E24]/10 text-[#E31E24] font-semibold shadow-sm" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              "group-hover:scale-110 transition-transform"
            )} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
