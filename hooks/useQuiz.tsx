import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { QuizRoom, QuizContextType, Question, Student, Response, QuizStatus } from '../types';
import { DEFAULT_QUIZ_QUESTIONS } from '../constants';
import { dbSet, dbOnValue, dbPush, dbUpdate } from '../firebase';

export type UserRole = 'admin' | 'student';
export type Screen = 'landing' | 'home' | 'admin_login' | 'admin_signup' | 'admin_dashboard' | 'student_join' | 'lobby' | 'quiz' | 'results';

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizRoom, setQuizRoom] = useState<QuizRoom | null>(null);

  // If a room is set locally, listen for remote updates to keep in sync
  useEffect(() => {
    if (!quizRoom) return;
    const path = `/rooms/${quizRoom.id}`;
    const unsubscribe = dbOnValue(path, (val) => {
      if (!val) return;
      setQuizRoom(val as QuizRoom);
    });
    return () => unsubscribe();
  }, [quizRoom]);

  const createRoom = (name: string, questions: Question[], mode?: 'option-only' | string) => {
    const newRoom: QuizRoom = {
      id: Date.now().toString(),
      name,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      mode: mode ?? 'option-only',
      questions,
      status: 'waiting',
      currentQuestionIndex: 0,
      students: [],
      responses: [],
      acceptingAnswers: false,
      answersRevealed: false,
      questionStartTime: null,
      questionTimer: null,
    };
    setQuizRoom(newRoom);
    // Persist the new room to Firebase Realtime Database
    dbSet(`/rooms/${newRoom.id}`, newRoom).catch(console.error);
  };

  const joinRoom = (name: string, code: string): Student | null => {
    if (quizRoom && quizRoom.code === code) {
      const newStudent: Student = { id: Date.now().toString(), name };
      const updated = quizRoom ? { ...quizRoom, students: [...quizRoom.students, newStudent] } : null;
      setQuizRoom(updated);
      // Update room in DB
      if (updated) dbUpdate(`/rooms/${updated.id}/students`, updated.students as any).catch(console.error);
      // Store student info in session storage to persist across re-renders
      sessionStorage.setItem('quizStudent', JSON.stringify(newStudent));
      return newStudent;
    }
    return null;
  };
  
  const startQuiz = () => {
    setQuizRoom(prev => {
      if (!prev) return null;
      const updated = { ...prev, status: 'active', currentQuestionIndex: 0 };
      dbUpdate(`/rooms/${updated.id}`, { status: updated.status, currentQuestionIndex: updated.currentQuestionIndex }).catch(console.error);
      return updated;
    });
  };

  const nextQuestion = () => {
    setQuizRoom(prev => {
      if (!prev) return null;
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        const updated = { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
        dbUpdate(`/rooms/${updated.id}`, { currentQuestionIndex: updated.currentQuestionIndex }).catch(console.error);
        return updated;
      }
      // If it's the last question, end the quiz
      const updated = { ...prev, status: 'ended' };
      dbUpdate(`/rooms/${updated.id}`, { status: updated.status }).catch(console.error);
      return updated;
    });
  };

  const submitAnswer = (studentId: string, questionId: number, selectedOption: number, timeTaken: number) => {
    setQuizRoom(prev => {
      if (!prev) return null;
      // If the room is not currently accepting answers, ignore submits
      if (!prev.acceptingAnswers) return prev;
      const question = prev.questions.find(q => q.id === questionId);
      if (!question) return prev;
      
      const newResponse: Response = {
        studentId,
        questionId,
        selectedOption,
        timeTaken,
        isCorrect: question.correctOption === selectedOption,
      };
      const updated = { ...prev, responses: [...prev.responses, newResponse] };
      // Push the new response to the DB under /rooms/{id}/responses
      dbPush(`/rooms/${updated.id}/responses`, newResponse).catch(console.error);
      // Also update local snapshot of responses for quick UI feedback
      return updated;
    });
  };

  // Admin: open a question for answers with optional duration in seconds
  const openQuestion = (questionIndex?: number, durationSec?: number) => {
    setQuizRoom(prev => {
      if (!prev) return null;
      const idx = questionIndex ?? prev.currentQuestionIndex;
      const updated: QuizRoom = {
        ...prev,
        currentQuestionIndex: idx,
        acceptingAnswers: true,
        answersRevealed: false,
        questionStartTime: Date.now(),
        questionTimer: durationSec ?? prev.questions[idx]?.timeLimit ?? null,
      };
      dbUpdate(`/rooms/${updated.id}`, {
        currentQuestionIndex: updated.currentQuestionIndex,
        acceptingAnswers: true,
        answersRevealed: false,
        questionStartTime: updated.questionStartTime,
        questionTimer: updated.questionTimer,
      }).catch(console.error);
      return updated;
    });
  };

  // Admin: close accepting answers
  const closeQuestion = () => {
    setQuizRoom(prev => {
      if (!prev) return null;
      const updated = { ...prev, acceptingAnswers: false } as QuizRoom;
      dbUpdate(`/rooms/${updated.id}`, { acceptingAnswers: false }).catch(console.error);
      return updated;
    });
  };

  // Admin: reveal correct answers
  const revealAnswers = () => {
    setQuizRoom(prev => {
      if (!prev) return null;
      const updated = { ...prev, answersRevealed: true, acceptingAnswers: false } as QuizRoom;
      dbUpdate(`/rooms/${updated.id}`, { answersRevealed: true, acceptingAnswers: false }).catch(console.error);
      return updated;
    });
  };

  // Admin: advance to next question (close current and open next in waiting state)
  const adminAdvance = () => {
    setQuizRoom(prev => {
      if (!prev) return null;
      // If there are more questions, increment
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        const updated = {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          acceptingAnswers: false,
          answersRevealed: false,
          questionStartTime: null,
          questionTimer: null,
        } as QuizRoom;
        dbUpdate(`/rooms/${updated.id}`, {
          currentQuestionIndex: updated.currentQuestionIndex,
          acceptingAnswers: false,
          answersRevealed: false,
          questionStartTime: null,
          questionTimer: null,
        }).catch(console.error);
        return updated;
      }
      // Otherwise end quiz
      const updated = { ...prev, status: 'ended' } as QuizRoom;
      dbUpdate(`/rooms/${updated.id}`, { status: 'ended' }).catch(console.error);
      return updated;
    });
  };

  const endQuiz = () => {
    setQuizRoom(prev => {
      if (!prev) return null;
      const updated = { ...prev, status: 'ended' };
      dbUpdate(`/rooms/${updated.id}`, { status: updated.status }).catch(console.error);
      return updated;
    });
  };
  
  const getStudentResponses = (studentId: string) => {
    return quizRoom?.responses.filter(r => r.studentId === studentId) || [];
  };

  const getScores = () => {
    if (!quizRoom) return [];
    return quizRoom.students.map(student => {
      const studentResponses = quizRoom.responses.filter(r => r.studentId === student.id);
      const score = studentResponses.filter(r => r.isCorrect).length * 10; // 10 points per correct answer
      const totalTime = studentResponses.reduce((acc, r) => acc + r.timeTaken, 0);
      return { studentId: student.id, name: student.name, score, totalTime };
    }).sort((a, b) => b.score - a.score || a.totalTime - b.totalTime);
  };

  return (
    <QuizContext.Provider value={{ quizRoom, createRoom, joinRoom, startQuiz, openQuestion, closeQuestion, revealAnswers, adminAdvance, nextQuestion, submitAnswer, endQuiz, getStudentResponses, getScores }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
