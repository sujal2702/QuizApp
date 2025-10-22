
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
  timeLimit: number;
}

export interface Student {
  id: string;
  name: string;
}

export interface Response {
  studentId: string;
  questionId: number;
  selectedOption: number;
  timeTaken: number;
  isCorrect: boolean;
}

export type QuizStatus = 'waiting' | 'active' | 'ended';

export interface QuizRoom {
  id: string;
  name: string;
  code: string;
  // mode of the quiz: option-only for multiple-choice; other modes can be added later
  mode?: 'option-only' | string;
  questions: Question[];
  status: QuizStatus;
  currentQuestionIndex: number;
  students: Student[];
  responses: Response[];
  // Admin-controlled flags for the current question
  acceptingAnswers?: boolean; // whether students may submit answers now
  answersRevealed?: boolean; // whether the admin has revealed correct answers
  questionStartTime?: number | null; // epoch ms when current question was opened
  questionTimer?: number | null; // time limit in seconds for the current question
}

export interface QuizContextType {
  quizRoom: QuizRoom | null;
  createRoom: (name: string, questions: Question[], mode?: 'option-only' | string) => void;
  joinRoom: (name: string, code: string) => Student | null;
  startQuiz: () => void;
  openQuestion: (questionIndex?: number, durationSec?: number) => void;
  closeQuestion: () => void;
  revealAnswers: () => void;
  adminAdvance: () => void;
  nextQuestion: () => void;
  submitAnswer: (studentId: string, questionId: number, selectedOption: number, timeTaken: number) => void;
  endQuiz: () => void;
  getStudentResponses: (studentId: string) => Response[];
  getScores: () => { studentId: string; name: string; score: number; totalTime: number }[];
}
