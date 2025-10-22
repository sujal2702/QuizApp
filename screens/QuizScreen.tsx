import React, { useState, useEffect } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Screen, UserRole } from '../hooks/useQuiz';
import Timer from '../components/Timer';
import { Student } from '../types';
import Button from '../components/Button';

interface QuizScreenProps {
  setScreen: (screen: Screen) => void;
  userRole: UserRole | null;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ setScreen, userRole }) => {
  const { quizRoom, nextQuestion, submitAnswer, openQuestion, closeQuestion, revealAnswers, adminAdvance } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [student, setStudent] = useState<Student | null>(null);

  const currentQuestion = quizRoom?.questions[quizRoom.currentQuestionIndex];

  useEffect(() => {
    if (userRole === 'student') {
      const storedStudent = sessionStorage.getItem('quizStudent');
      if (storedStudent) {
        setStudent(JSON.parse(storedStudent));
      }
    }
  }, [userRole]);

  useEffect(() => {
    if (quizRoom?.status === 'ended') {
      setScreen('results');
      return;
    }
    // Reset state for new question
    setSelectedOption(null);
    setIsAnswered(false);
    setStartTime(Date.now());
  }, [quizRoom?.currentQuestionIndex, quizRoom?.status, setScreen]);

  const handleOptionClick = (index: number) => {
    if (isAnswered || userRole !== 'student') return;
    if (!quizRoom?.acceptingAnswers) return; // only allow when admin opened the question
    
    const timeTaken = (Date.now() - startTime) / 1000;
    setSelectedOption(index);
    setIsAnswered(true);

    if (student && currentQuestion) {
      submitAnswer(student.id, currentQuestion.id, index, timeTaken);
    }
  };
  
  const handleTimeUp = () => {
    if (isAnswered || userRole !== 'student') return;
    // on time up students are no longer allowed to answer; admin should close or reveal
    setIsAnswered(true);
    if (student && currentQuestion) {
      submitAnswer(student.id, currentQuestion.id, -1, currentQuestion.timeLimit);
    }
  };
  
  useEffect(() => {
    if (!quizRoom) {
      const timer = setTimeout(() => setScreen('home'), 1000);
      return () => clearTimeout(timer);
    }
  }, [quizRoom, setScreen]);

  if (!quizRoom || !currentQuestion) {
    return (
      <div className="w-full max-w-2xl p-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="text-center">
          <p className="text-xl text-white">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((quizRoom.currentQuestionIndex + 1) / quizRoom.questions.length) * 100;
  
  if (userRole === 'admin') {
    const optionConfig = [
      { label: 'A', color: 'red', bg: 'bg-red-500', border: 'border-red-600', symbol: '●' },
      { label: 'B', color: 'yellow', bg: 'bg-yellow-400', border: 'border-yellow-500', symbol: '■' },
      { label: 'C', color: 'green', bg: 'bg-green-500', border: 'border-green-600', symbol: '▲' },
      { label: 'D', color: 'blue', bg: 'bg-blue-500', border: 'border-blue-600', symbol: '★' },
    ];

     return (
      <div className="w-full max-w-5xl p-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in-up">
          <div className="w-full bg-zinc-800 rounded-full h-3 mb-6">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-3 rounded-full transition-all" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-2xl font-bold">Question {quizRoom.currentQuestionIndex + 1}/{quizRoom.questions.length}</p>
          <div className="flex gap-2">
            {quizRoom.acceptingAnswers && (
              <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                ACCEPTING ANSWERS
              </span>
            )}
            {quizRoom.answersRevealed && (
              <span className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">
                📊 ANSWERS REVEALED
              </span>
            )}
          </div>
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl mb-6 border-2 border-zinc-700">
          <h2 className="text-3xl font-bold mb-6 text-white">{currentQuestion.text}</h2>
          
          <p className="text-sm font-semibold text-zinc-400 mb-3">Students will see these colored options:</p>
          
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = index === currentQuestion.correctOption;
              const config = optionConfig[index];
              
              return (
                <div 
                  key={index} 
                  className={`p-5 rounded-xl border-4 text-white transition-all relative ${
                    quizRoom.answersRevealed && isCorrect
                      ? 'ring-8 ring-yellow-400 scale-105 shadow-2xl' 
                      : ''
                  } ${config.bg} ${config.border}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{config.symbol}</div>
                    <div className="flex-1">
                      <div className="text-2xl font-black mb-1">{config.label}</div>
                      <div className="text-lg font-semibold">{option}</div>
                    </div>
                    {isCorrect && (
                      <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-black border-2 border-yellow-600 shadow-lg">
                        ✓ CORRECT
                      </div>
                    )}
                    {quizRoom.answersRevealed && isCorrect && (
                      <div className="text-4xl animate-bounce">✓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Response Stats */}
        <div className="bg-zinc-800 p-4 rounded-lg mb-6 border-2 border-zinc-700">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Responses Received:</span>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-blue-600">
                {(quizRoom.responses || []).filter(r => r.questionId === currentQuestion.id).length} / {quizRoom.students?.length || 0}
              </div>
              <div className="w-32 bg-zinc-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-violet-500 to-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${((quizRoom.responses || []).filter(r => r.questionId === currentQuestion.id).length / ((quizRoom.students?.length || 1))) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Button 
            onClick={() => openQuestion(undefined, currentQuestion.timeLimit)} 
            disabled={quizRoom.acceptingAnswers}
            className="!w-full"
          >
            ▶️ Open ({currentQuestion.timeLimit}s)
          </Button>
          <Button 
            onClick={closeQuestion} 
            variant="secondary" 
            disabled={!quizRoom.acceptingAnswers}
            className="!w-full"
          >
            ⏸️ Close
          </Button>
          <Button 
            onClick={revealAnswers} 
            variant="secondary"
            disabled={quizRoom.answersRevealed}
            className="!w-full"
          >
            👁️ Reveal
          </Button>
          <Button 
            onClick={() => setScreen('results')} 
            variant="secondary" 
            className="!w-full"
          >
            📊 Results
          </Button>
          <Button 
            onClick={adminAdvance} 
            className="!w-full"
          >
            {quizRoom.currentQuestionIndex < quizRoom.questions.length - 1 ? '⏭️ Next' : '🏁 End'}
          </Button>
        </div>
      </div>
    );
  }

  // Student View - Only show 4 colored option buttons with symbols
  const optionConfig = [
    { label: 'A', color: 'red', bg: 'bg-red-500', hoverBg: 'hover:bg-red-600', border: 'border-red-600', shadow: 'shadow-red-500/50', symbol: '●' },
    { label: 'B', color: 'yellow', bg: 'bg-yellow-400', hoverBg: 'hover:bg-yellow-500', border: 'border-yellow-500', shadow: 'shadow-yellow-400/50', symbol: '■' },
    { label: 'C', color: 'green', bg: 'bg-green-500', hoverBg: 'hover:bg-green-600', border: 'border-green-600', shadow: 'shadow-green-500/50', symbol: '▲' },
    { label: 'D', color: 'blue', bg: 'bg-blue-500', hoverBg: 'hover:bg-blue-600', border: 'border-blue-600', shadow: 'shadow-blue-500/50', symbol: '★' },
  ];

  const getOptionClasses = (index: number) => {
    const config = optionConfig[index];
    let baseClasses = `w-full text-center p-10 rounded-2xl border-4 transition-all transform text-white font-black shadow-2xl ${config.shadow}`;
    
    if (!isAnswered && quizRoom.acceptingAnswers) {
      return `${baseClasses} ${config.bg} ${config.border} ${config.hoverBg} hover:scale-110 active:scale-95 cursor-pointer animate-pulse`;
    }
    
    if (isAnswered) {
      if (index === selectedOption) {
        return `${baseClasses} ${config.bg} ${config.border} scale-105 ring-8 ring-white`;
      }
    }
    
    // Disabled state
    return `${baseClasses} bg-gray-300 border-gray-400 opacity-50 cursor-not-allowed`;
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 backdrop-blur-sm border-4 border-white/30 rounded-3xl shadow-2xl animate-fade-in-up">
      <div className="w-full bg-white/20 rounded-full h-4 mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      <div className="flex justify-between items-center mb-10">
        <div className="bg-white/90 px-6 py-3 rounded-2xl shadow-lg">
          <span className="text-3xl font-black text-gray-800">Question {quizRoom.currentQuestionIndex + 1}/{quizRoom.questions.length}</span>
        </div>
        <Timer
          key={currentQuestion.id}
          duration={quizRoom.questionTimer ?? currentQuestion.timeLimit}
          onTimeUp={handleTimeUp}
          isPaused={isAnswered || !quizRoom.acceptingAnswers}
          startedAt={quizRoom.questionStartTime ?? null}
        />
      </div>

      {!quizRoom.acceptingAnswers && !isAnswered && (
        <div className="text-center mb-10 p-6 bg-yellow-400 border-4 border-yellow-600 rounded-2xl shadow-2xl animate-bounce">
          <p className="text-2xl font-black text-yellow-900">⏳ Waiting for question to open...</p>
        </div>
      )}

      {quizRoom.acceptingAnswers && !isAnswered && (
        <div className="text-center mb-6">
          <p className="text-3xl font-black text-white drop-shadow-lg animate-pulse">
            👀 Choose Your Answer!
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-8">
        {optionConfig.map((config, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            disabled={isAnswered || !quizRoom.acceptingAnswers}
            className={getOptionClasses(index)}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="text-7xl">{config.symbol}</div>
              <div className="text-6xl font-black tracking-wider">{config.label}</div>
            </div>
          </button>
        ))}
      </div>
      
      {isAnswered && (
        <div className="text-center mt-10 p-6 bg-green-500 border-4 border-green-700 rounded-2xl shadow-2xl animate-pulse">
          <p className="text-3xl font-black text-white">✓ Answer Submitted!</p>
          <p className="text-lg font-semibold text-green-100 mt-2">Waiting for next question...</p>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;