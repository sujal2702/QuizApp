import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { QuizRoom, QuizContextType, Question, Student, Response, QuizStatus } from '../types';
import { DEFAULT_QUIZ_QUESTIONS } from '../constants';
import { dbSet, dbOnValue, dbPush, dbUpdate, database } from '../firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';

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
      // Normalize responses: Firebase may return it as object, convert to array
      const normalized = {
        ...val,
        responses: Array.isArray(val.responses) 
          ? val.responses 
          : val.responses 
            ? Object.values(val.responses) 
            : [],
        students: Array.isArray(val.students) 
          ? val.students 
          : val.students 
            ? Object.values(val.students) 
            : [],
      };
      setQuizRoom(normalized as QuizRoom);
    });
    return () => unsubscribe();
  }, [quizRoom?.id]); // Only re-subscribe when room ID changes, not on every quizRoom update

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
    console.log('QuizRoom created:', newRoom);
    setQuizRoom(newRoom);
    // Persist the new room to Firebase Realtime Database
    dbSet(`/rooms/${newRoom.id}`, newRoom)
      .then(() => {
        console.log('✅ Room saved to Firebase successfully');
        console.log('Room ID:', newRoom.id, 'Code:', newRoom.code);
      })
      .catch((error) => {
        console.error('❌ Firebase save error:', error);
        console.error('⚠️ PERMISSION_DENIED - Please update Firebase Database Rules');
        console.error('See FIREBASE_SETUP.md for instructions');
      });
  };

  const findRoomByCode = async (code: string): Promise<QuizRoom | null> => {
    try {
      console.log('Searching for room with code:', code);
      const roomsRef = ref(database, 'rooms');
      const snapshot = await get(roomsRef);
      
      if (snapshot.exists()) {
        const rooms = snapshot.val();
        // Search through all rooms to find matching code
        for (const roomId in rooms) {
          const room = rooms[roomId];
          if (room.code === code) {
            console.log('Found room:', room);
            // Normalize responses and students arrays from Firebase object format
            const normalized = {
              ...room,
              responses: Array.isArray(room.responses) 
                ? room.responses 
                : room.responses 
                  ? Object.values(room.responses) 
                  : [],
              students: Array.isArray(room.students) 
                ? room.students 
                : room.students 
                  ? Object.values(room.students) 
                  : [],
            };
            return normalized as QuizRoom;
          }
        }
      }
      console.log('No room found with code:', code);
      return null;
    } catch (error) {
      console.error('Error finding room:', error);
      return null;
    }
  };

  const joinRoom = async (name: string, code: string): Promise<Student | null> => {
    try {
      // First, find the room by code
      const room = await findRoomByCode(code);
      
      if (!room) {
        console.log('Room not found with code:', code);
        return null;
      }

      console.log('Joining room:', room.name, 'Code:', room.code);
      
      const newStudent: Student = { id: Date.now().toString(), name };
      
      // Check if student already exists (prevent duplicates from multiple joins)
      const existingStudents = room.students || [];
      const alreadyJoined = existingStudents.some(s => s.name === name);
      
      if (alreadyJoined) {
        console.log('Student already joined:', name);
        const existingStudent = existingStudents.find(s => s.name === name)!;
        setQuizRoom(room);
        sessionStorage.setItem('quizStudent', JSON.stringify(existingStudent));
        return existingStudent;
      }
      
      const updatedStudents = [...existingStudents, newStudent];
      const updated = { ...room, students: updatedStudents };
      
      // Set local state
      setQuizRoom(updated);
      
      // Update room in DB - use dbSet for the students array
      await dbSet(`/rooms/${updated.id}/students`, updatedStudents);
      
      // Store student info in session storage to persist across re-renders
      sessionStorage.setItem('quizStudent', JSON.stringify(newStudent));
      
      console.log('Successfully joined room as:', newStudent.name);
      return newStudent;
    } catch (error) {
      console.error('Error joining room:', error);
      return null;
    }
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
      const updated = { ...prev, responses: [...(prev.responses || []), newResponse] };
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
