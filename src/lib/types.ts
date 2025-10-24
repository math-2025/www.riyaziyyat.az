export type Student = {
  id: string;
  name: string;
  group: string;
  email?: string;
  pass?: string;
  cls?: string;
  parent?: string;
  status?: 'active' | 'disabled';
};

export type Question = {
  id: string;
  text: string;
  type: 'multiple-choice' | 'free-form';
  options?: string[];
  correctAnswer: string;
  imageUrl?: string;
};

export type Exam = {
  id: string;
  title: string;
  questions: Question[];
  assignedGroups: string[];
  startTime: string;
  endTime: string;
  pointsPerQuestion: number;
  announcement?: string;
};

export type Submission = {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, string>;
  submittedAt: string;
  cheatingDetected?: boolean;
  score?: number;
};
