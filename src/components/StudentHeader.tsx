import React from 'react';
import { Bell, ChevronDown, User, HeartPulse, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const tabs = [
  { label: 'MEU CURSO', path: '/aluno' },
  { 
    label: 'CARTEIRA DIGITAL', 
    path: '/aluno/carteira',
    dropdown: [
      { label: 'Pagamentos', path: '/aluno/carteira/pagamentos' },
      { label: 'Negociação de débitos', path: '/aluno/carteira/negociacao' },
      { label: 'Consulta Valor de Disciplina', path: '/aluno/carteira/valores' },
    ]
  },
  { 
    label: 'SOLICITAÇÕES', 
    path: '/aluno/solicitacoes',
    sections: [
      {
        title: 'ALTERAÇÕES ACADÊMICAS',
        items: [
          { label: 'Mudança de Turma', path: '/aluno/secretaria?type=mudanca-turma' },
          { label: 'Mudança de Turno', path: '/aluno/secretaria?type=mudanca-turno' },
          { label: 'Incluir e Excluir disciplinas', path: '/aluno/secretaria?type=incluir-excluir' },
          { label: 'Abrir Chamado', path: '/aluno/secretaria?type=abrir-chamado' },
          { label: 'Acompanhar Chamados', path: '/aluno/secretaria?type=acompanhar-chamados' },
        ]
      },
      {
        title: 'DOCUMENTAÇÕES',
        items: [
          { label: 'Declarações e históricos', path: '/aluno/secretaria?type=declaracoes' },
          { label: 'Meus documentos', path: '/aluno/secretaria?type=documentos' },
          { label: 'Certificados e diplomas', path: '/aluno/secretaria?type=certificados', badge: 'Novo!' },
        ]
      },
      {
        title: 'ESTÁGIOS',
        items: [
          { label: 'Portal de estágios', path: '/aluno/secretaria?type=estagios' },
        ]
      }
    ]
  },
  { label: 'BIBLIOTECA', path: '/aluno/biblioteca' },
  { label: 'LINKS ÚTEIS', path: '/aluno/links' },
];

export function StudentHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <header className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#E31E24] p-1.5 rounded flex items-center justify-center">
            <HeartPulse className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl text-gray-900 leading-none tracking-tighter">Life</span>
            <span className="text-[9px] font-bold text-[#E31E24] uppercase tracking-widest">Cursos Técnicos</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-sm transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 group relative">
            <div className="w-10 h-10 bg-blue-50 rounded-sm border border-blue-100 flex items-center justify-center text-blue-500">
              <User className="w-6 h-6" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                Sérgio Silva Be...
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </p>
              <p className="text-[10px] text-gray-500 font-medium">04098356</p>
            </div>

            {/* User Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair do Portal
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="max-w-7xl mx-auto px-4 flex items-center gap-8">
        {tabs.map((tab) => (
          <div key={tab.path} className="relative group/tab">
            <NavLink
              to={tab.path}
              className={({ isActive }) => cn(
                "py-4 text-xs font-bold tracking-wider transition-all border-b-2 flex items-center gap-1",
                isActive 
                  ? "text-[#E31E24] border-[#E31E24]" 
                  : "text-gray-400 border-transparent hover:text-gray-600"
              )}
            >
              {tab.label}
              {(tab.dropdown || tab.sections) && <ChevronDown className="w-3 h-3" />}
            </NavLink>

            {/* Simple Dropdown */}
            {tab.dropdown && (
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover/tab:opacity-100 group-hover/tab:visible transition-all z-50 py-2">
                {tab.dropdown.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="block px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#E31E24] transition-colors"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* Complex Dropdown with Sections */}
            {tab.sections && (
              <div className="absolute top-full left-0 w-72 bg-white border border-gray-100 shadow-2xl opacity-0 invisible group-hover/tab:opacity-100 group-hover/tab:visible transition-all z-50 py-4 max-h-[80vh] overflow-y-auto">
                {tab.sections.map((section, sIdx) => (
                  <div key={sIdx} className="mb-4 last:mb-0">
                    <h4 className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">{section.title}</h4>
                    <div className="space-y-0.5">
                      {section.items.map((item, iIdx) => (
                        <NavLink
                          key={iIdx}
                          to={item.path}
                          className="flex items-center justify-between px-4 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#E31E24] transition-colors"
                        >
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="bg-[#E31E24] text-white text-[8px] px-1.5 py-0.5 rounded-sm font-black uppercase">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
