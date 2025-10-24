import { type Timestamp } from 'firebase/firestore';

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  durationInMinutes: number;
  questions: Question[];
}

export interface ExamResult {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  answers: { questionId: string; selectedAnswerIndex: number; isCorrect: boolean }[];
  completedAt: Timestamp;
}

export interface Student {
  id: string;
  fullName: string;
  group: string;
  username: string;
  status: 'active' | 'inactive';
}

export interface Group {
    id: string;
    name: string;
}
