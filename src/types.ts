export interface Student {
  id: string;
  name: string;
  email: string;
  registration: string;
  course: string;
  status: 'Ativo' | 'Inativo' | 'Trancado';
  financialStatus: 'Em dia' | 'Pendente' | 'Atrasado';
}

export interface Course {
  id: string;
  name: string;
  modality: 'EAD' | 'Semipresencial' | 'Presencial';
  duration: string;
  coordinators: string[];
  curriculumUrl?: string;
  curriculumText?: string;
}

export interface Subject {
  id: string;
  name: string;
  courseId: string;
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  hours: number;
  startDate: string;
  createdAt?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  description: string;
}

export interface Request {
  id: string;
  studentId: string;
  type: string;
  status: 'Aberto' | 'Em Análise' | 'Concluído';
  date: string;
}

export interface Content {
  id: string;
  subjectId: string;
  subjectName?: string;
  courseId?: string;
  courseName?: string;
  teacherId: string;
  teacherName: string;
  title: string;
  type: 'video' | 'pdf' | 'audio' | 'link' | 'other';
  url: string;
  status: 'Pendente' | 'Aprovado' | 'Ajuste Necessário';
  feedback?: string;
  teacherReply?: string;
  teacherReplyAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Assessment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  status: 'Ativo' | 'Inativo';
}

export interface Submission {
  id: string;
  assessmentId: string;
  studentId: string;
  fileUrl: string;
  grade?: number;
  feedback?: string;
  status: 'Pendente' | 'Corrigido';
  submittedAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  value: string;
  assessmentType: string;
  date: string;
}
