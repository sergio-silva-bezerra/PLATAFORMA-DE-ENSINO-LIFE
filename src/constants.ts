import { Student, Course, Subject, Payment, Request } from './types';

export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Sérgio Silva Bezerra', email: 'sergio@example.com', registration: '04098356', course: 'Técnico em Enfermagem', status: 'Ativo', financialStatus: 'Em dia' },
  { id: '2', name: 'Ana Oliveira', email: 'ana@example.com', registration: '04098357', course: 'Design Gráfico', status: 'Ativo', financialStatus: 'Pendente' },
  { id: '3', name: 'Carlos Santos', email: 'carlos@example.com', registration: '04098358', course: 'Técnico em Enfermagem', status: 'Trancado', financialStatus: 'Atrasado' },
];

export const MOCK_COURSES: Course[] = [
  { id: '1', name: 'Técnico em Enfermagem', modality: 'Semipresencial', duration: '4 Semestres', coordinators: ['Dra. Maria Oliveira'] },
  { id: '2', name: 'Design Gráfico', modality: 'EAD', duration: '6 Semestres', coordinators: ['Marcos Silva'] },
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: '1', name: 'Anatomia e Fisiologia Humana', courseId: '1', tutorId: 't1', tutorName: 'Dr. Ricardo Santos', tutorEmail: 'ricardo@example.com', hours: 80, startDate: '2026-03-30' },
  { id: '2', name: 'Fundamentos de Enfermagem', courseId: '1', tutorId: 't2', tutorName: 'Dra. Maria Oliveira', tutorEmail: 'maria@example.com', hours: 60, startDate: '2026-01-20' },
  { id: '3', name: 'Ética e Bioética Profissional', courseId: '1', tutorId: 't3', tutorName: 'Carlos Mendes', tutorEmail: 'carlos@example.com', hours: 40, startDate: '2026-01-20' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: '1', studentId: '1', amount: 450.00, dueDate: '2026-04-10', status: 'Pendente', description: 'Mensalidade Abril/2026' },
  { id: '2', studentId: '1', amount: 450.00, dueDate: '2026-03-10', status: 'Pago', description: 'Mensalidade Março/2026' },
];

export const MOCK_REQUESTS: Request[] = [
  { id: '1', studentId: '1', type: 'Declaração de Matrícula', status: 'Concluído', date: '2026-03-15' },
  { id: '2', studentId: '2', type: 'Histórico Escolar', status: 'Em Análise', date: '2026-03-28' },
];
