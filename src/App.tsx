import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BookOpen, ExternalLink, BarChart3 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StudentHeader } from './components/StudentHeader';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Courses } from './pages/Courses';
import { Financial } from './pages/Financial';
import { Requests } from './pages/Requests';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentPayments } from './pages/StudentPayments';
import { DebtNegotiation } from './pages/DebtNegotiation';
import { SubjectValues } from './pages/SubjectValues';
import { StudentSecretariat } from './pages/StudentSecretariat';
import { AboutCourse } from './pages/AboutCourse';
import { ComplementaryActivities } from './pages/ComplementaryActivities';
import { VirtualClassroom } from './pages/VirtualClassroom';
import { Schedule } from './pages/Schedule';
import { SecretariatDashboard } from './pages/SecretariatDashboard';
import { SecretariatDocuments } from './pages/SecretariatDocuments';
import { FinancialDashboard } from './pages/FinancialDashboard';
import { PedagogicalDashboard } from './pages/PedagogicalDashboard';
import { PedagogicalContent } from './pages/PedagogicalContent';
import { PedagogicalSchedule } from './pages/PedagogicalSchedule';
import { PedagogicalPerformance } from './pages/PedagogicalPerformance';
import { SecretariatSidebar } from './components/SecretariatSidebar';
import { FinancialSidebar } from './components/FinancialSidebar';
import { PedagogicalSidebar } from './components/PedagogicalSidebar';
import { Login } from './pages/Login';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans antialiased text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function SecretariatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans antialiased text-gray-900">
      <SecretariatSidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Secretaria Acadêmica" subtitle="Coordenação de Registros" />
        <main className="p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function FinancialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans antialiased text-gray-900">
      <FinancialSidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Departamento Financeiro" subtitle="Gestão de Contas" />
        <main className="p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function PedagogicalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans antialiased text-gray-900">
      <PedagogicalSidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Departamento Pedagógico" subtitle="Gestão Acadêmica" />
        <main className="p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased text-gray-900">
      <StudentHeader />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/alunos" element={<AdminLayout><Students /></AdminLayout>} />
        <Route path="/admin/cursos" element={<AdminLayout><Courses /></AdminLayout>} />
        <Route path="/admin/financeiro" element={<AdminLayout><Financial /></AdminLayout>} />
        <Route path="/admin/solicitacoes" element={<AdminLayout><Requests /></AdminLayout>} />
        
        {/* Secretariat Routes */}
        <Route path="/secretaria" element={<SecretariatLayout><SecretariatDashboard /></SecretariatLayout>} />
        <Route path="/secretaria/alunos" element={<SecretariatLayout><Students /></SecretariatLayout>} />
        <Route path="/secretaria/solicitacoes" element={<SecretariatLayout><Requests /></SecretariatLayout>} />
        <Route path="/secretaria/documentos" element={<SecretariatLayout><SecretariatDocuments /></SecretariatLayout>} />

        {/* Financial Routes */}
        <Route path="/financeiro" element={<FinancialLayout><FinancialDashboard /></FinancialLayout>} />
        <Route path="/financeiro/pagamentos" element={<FinancialLayout><Financial /></FinancialLayout>} />
        <Route path="/financeiro/negociacoes" element={<FinancialLayout>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Negociações</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800">Proposta #2026-00{i}</p>
                      <p className="text-xs text-gray-500">Aluno: Sérgio Silva Bezerra</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">Em Análise</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valor Total:</span>
                    <span className="font-bold text-gray-800">R$ 1.250,00</span>
                  </div>
                  <button className="w-full py-2 bg-[#E31E24] text-white rounded-lg text-xs font-bold">Ver Detalhes</button>
                </div>
              ))}
            </div>
          </div>
        </FinancialLayout>} />
        <Route path="/financeiro/relatorios" element={<FinancialLayout>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Relatórios Financeiros</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Faturamento Mensal', 'Inadimplência', 'Balanço por Curso'].map((rep) => (
                <div key={rep} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 cursor-pointer">
                  <BarChart3 className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="font-bold text-gray-800">{rep}</h3>
                  <p className="text-xs text-gray-500 mt-2">Gerar relatório detalhado em PDF/Excel.</p>
                </div>
              ))}
            </div>
          </div>
        </FinancialLayout>} />

        {/* Pedagogical Routes */}
        <Route path="/pedagogico" element={<PedagogicalLayout><PedagogicalDashboard /></PedagogicalLayout>} />
        <Route path="/pedagogico/turmas" element={<PedagogicalLayout><Courses /></PedagogicalLayout>} />
        <Route path="/pedagogico/alunos" element={<PedagogicalLayout><Students /></PedagogicalLayout>} />
        <Route path="/pedagogico/conteudos" element={<PedagogicalLayout><PedagogicalContent /></PedagogicalLayout>} />
        <Route path="/pedagogico/cronograma" element={<PedagogicalLayout><PedagogicalSchedule /></PedagogicalLayout>} />
        <Route path="/pedagogico/desempenho" element={<PedagogicalLayout><PedagogicalPerformance /></PedagogicalLayout>} />

        {/* Student Routes */}
        <Route path="/aluno" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
        <Route path="/aluno/carteira" element={<Navigate to="/aluno/carteira/pagamentos" replace />} />
        <Route path="/aluno/carteira/pagamentos" element={<StudentLayout><StudentPayments /></StudentLayout>} />
        <Route path="/aluno/carteira/negociacao" element={<StudentLayout><DebtNegotiation /></StudentLayout>} />
        <Route path="/aluno/carteira/valores" element={<StudentLayout><SubjectValues /></StudentLayout>} />
        <Route path="/aluno/secretaria" element={<StudentLayout><StudentSecretariat /></StudentLayout>} />
        <Route path="/aluno/sobre-curso" element={<StudentLayout><AboutCourse /></StudentLayout>} />
        <Route path="/aluno/atividades-complementares" element={<StudentLayout><ComplementaryActivities /></StudentLayout>} />
        <Route path="/aluno/sala-virtual" element={<VirtualClassroom />} />
        <Route path="/aluno/horarios" element={<StudentLayout><Schedule /></StudentLayout>} />
        <Route path="/aluno/solicitacoes" element={<Navigate to="/aluno/secretaria" replace />} />
        <Route path="/aluno/biblioteca" element={<StudentLayout>
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Biblioteca Digital</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Minha Biblioteca', 'Pearson', 'Biblioteca Virtual'].map((lib) => (
                <div key={lib} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <BookOpen className="w-8 h-8 text-[#E31E24] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-gray-800">{lib}</h3>
                  <p className="text-xs text-gray-500 mt-2">Acesse milhares de títulos e periódicos online.</p>
                </div>
              ))}
            </div>
          </div>
        </StudentLayout>} />
        <Route path="/aluno/links" element={<StudentLayout>
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Links Úteis</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Portal do MEC', 'Enade', 'Canal do Aluno', 'Suporte Técnico'].map((link) => (
                <div key={link} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm font-bold text-gray-700">{link}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </StudentLayout>} />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
