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
}

export interface Subject {
  id: string;
  name: string;
  courseId: string;
  tutor: string;
  startDate: string;
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
