import React, { useState, useEffect, useCallback } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Screen, UserRole } from '../hooks/useQuiz';
import { useToast } from '../hooks/useToast';
import { playSound } from '../utils/sounds';
import Timer from '../components/Timer';
import LiveLeaderboardModal from '../components/LiveLeaderboardModal';
import { Student } from '../types';
import Button from '../components/Button';

interface QuizScreenProps {
  setScreen: (screen: Screen) => void;
  userRole: UserRole | null;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ setScreen, userRole }) => {
  const { quizRoom, nextQuestion, submitAnswer, openQuestion, closeQuestion, revealAnswers, adminAdvance, getScores } = useQuiz();
  const { showToast } = useToast();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [student, setStudent] = useState<Student | null>(null);
  const [showRevealAnimation, setShowRevealAnimation] = useState(false);
  const [showLiveLeaderboard, setShowLiveLeaderboard] = useState(false);
  const [previousScores, setPreviousScores] = useState<any[]>([]);
  const [leaderboardShownForQuestion, setLeaderboardShownForQuestion] = useState<number>(-1);

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
    setShowRevealAnimation(false);
    setShowLiveLeaderboard(false);
    // Reset leaderboard tracking when question changes
    setLeaderboardShownForQuestion(-1);
    
    // Save previous scores for rank comparison
    if (quizRoom) {
      setPreviousScores(getScores());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizRoom?.currentQuestionIndex, quizRoom?.status]);

  // Show reveal animation when answers are revealed
  useEffect(() => {
    const currentQIndex = quizRoom?.currentQuestionIndex ?? -1;
    if (quizRoom?.answersRevealed && userRole === 'student' && isAnswered && leaderboardShownForQuestion !== currentQIndex) {
      setShowRevealAnimation(true);
      // Play sound based on correctness
      if (selectedOption === currentQuestion?.correctOption) {
        playSound('correct');
      } else {
        playSound('wrong');
      }
      // Mark that we've shown the leaderboard for this question
      setLeaderboardShownForQuestion(currentQIndex);
      
      // Auto-hide after 5 seconds, then show leaderboard
      const timer = setTimeout(() => {
        setShowRevealAnimation(false);
        // Show leaderboard after answer reveal
        setTimeout(() => {
          setShowLiveLeaderboard(true);
          playSound('whoosh'); // Leaderboard entrance sound
        }, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [quizRoom?.answersRevealed, quizRoom?.currentQuestionIndex, userRole, isAnswered, leaderboardShownForQuestion, selectedOption, currentQuestion]);

  // Show leaderboard for admin immediately after reveal
  useEffect(() => {
    const currentQIndex = quizRoom?.currentQuestionIndex ?? -1;
    if (quizRoom?.answersRevealed && userRole === 'admin' && leaderboardShownForQuestion !== currentQIndex) {
      const timer = setTimeout(() => {
        setShowLiveLeaderboard(true);
        setLeaderboardShownForQuestion(currentQIndex);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [quizRoom?.answersRevealed, quizRoom?.currentQuestionIndex, userRole, leaderboardShownForQuestion]);

  const handleOptionClick = (index: number) => {
    if (isAnswered || userRole !== 'student') return;
    if (!quizRoom?.acceptingAnswers) return; // only allow when admin opened the question
    
    const timeTaken = (Date.now() - startTime) / 1000;
    setSelectedOption(index);
    setIsAnswered(true);

    if (student && currentQuestion) {
      submitAnswer(student.id, currentQuestion.id, index, timeTaken);
      showToast('Answer submitted!', 'success');
      playSound('join'); // Play join sound when answer is submitted
    }
  };

  // Keyboard shortcuts: 1-4 for options (students). Admin shortcuts: Enter -> reveal, N -> next
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!quizRoom || !currentQuestion) return;
    if (userRole === 'student' && !isAnswered && quizRoom.acceptingAnswers) {
      const key = e.key;
      if (['1','2','3','4'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        handleOptionClick(idx);
      }
    }

    if (userRole === 'admin') {
      if (e.key === 'Enter') {
        // reveal answers
        revealAnswers();
      }
      if (e.key.toLowerCase() === 'n') {
        adminAdvance();
      }
    }
  }, [quizRoom, currentQuestion, userRole, isAnswered, handleOptionClick, revealAnswers, adminAdvance]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
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
      <div className="w-full max-w-2xl p-8 bg-white border-2 border-gray-200 rounded-3xl shadow-xl animate-fade-in-up">
        <div className="text-center">
          <p className="text-xl text-gray-900 font-semibold">Loading quiz...</p>
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
      <div className="w-full max-w-5xl p-8 bg-white border-2 border-gray-200 rounded-3xl shadow-xl animate-fade-in-up">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div className="bg-yellow-400 h-3 rounded-full transition-all" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-2xl font-bold text-gray-900">Question {quizRoom.currentQuestionIndex + 1}/{quizRoom.questions.length}</p>
          <div className="flex gap-2">
            {quizRoom.acceptingAnswers && (
              <span className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                ACCEPTING ANSWERS
              </span>
            )}
            {quizRoom.answersRevealed && (
              <span className="bg-cyan-200 text-gray-900 px-4 py-2 rounded-full font-semibold">
                📊 ANSWERS REVEALED
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl mb-6 border-2 border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">{currentQuestion.text}</h2>
          
          <p className="text-sm font-semibold text-gray-600 mb-3">Students will see these colored options:</p>
          
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
        <div className="bg-gray-50 p-4 rounded-2xl mb-6 border-2 border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Responses Received:</span>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-gray-900">
                {(quizRoom.responses || []).filter(r => r.questionId === currentQuestion.id).length} / {quizRoom.students?.length || 0}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-cyan-400 h-3 rounded-full transition-all"
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
    { label: 'A', color: 'red', bg: 'bg-red-500', hoverBg: 'hover:bg-red-600', border: 'border-red-500', shadow: 'shadow-lg', symbol: '●' },
    { label: 'B', color: 'yellow', bg: 'bg-yellow-400', hoverBg: 'hover:bg-yellow-500', border: 'border-yellow-400', shadow: 'shadow-lg', symbol: '■' },
    { label: 'C', color: 'green', bg: 'bg-green-500', hoverBg: 'hover:bg-green-600', border: 'border-green-500', shadow: 'shadow-lg', symbol: '▲' },
    { label: 'D', color: 'blue', bg: 'bg-blue-500', hoverBg: 'hover:bg-blue-600', border: 'border-blue-500', shadow: 'shadow-lg', symbol: '★' },
  ];

  const getOptionClasses = (index: number) => {
    const config = optionConfig[index];
    let baseClasses = `w-full aspect-square flex items-center justify-center rounded-2xl border-4 transition-all transform text-white font-black ${config.shadow}`;
    
    if (!isAnswered && quizRoom.acceptingAnswers) {
      return `${baseClasses} ${config.bg} ${config.border} ${config.hoverBg} hover:scale-[1.02] active:scale-95 cursor-pointer`;
    }
    
    if (isAnswered) {
      if (index === selectedOption) {
        return `${baseClasses} ${config.bg} ${config.border} scale-[1.02] ring-4 ring-white/50`;
      }
    }
    
    // Disabled state
    return `${baseClasses} bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed`;
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 pb-4 bg-gray-50">
        {/* Question Details Container */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 lg:gap-6">
        {/* Progress Bar */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 lg:p-6 shadow-md animate-fade-in">
          <div className="w-full bg-gray-300 rounded-full h-2.5 lg:h-3 mb-3 overflow-hidden">
            <div className="bg-yellow-400 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="text-center">
            <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-700">
              Question {quizRoom.currentQuestionIndex + 1}/{quizRoom.questions.length}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 lg:p-6 shadow-md flex items-center justify-center">
          <Timer
            key={currentQuestion.id}
            duration={quizRoom.questionTimer ?? currentQuestion.timeLimit}
            onTimeUp={handleTimeUp}
            isPaused={isAnswered || !quizRoom.acceptingAnswers}
            startedAt={quizRoom.questionStartTime ?? null}
          />
        </div>

        {/* Status Messages */}
        {!quizRoom.acceptingAnswers && !isAnswered && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 lg:p-5 shadow-md">
            <p className="text-base sm:text-lg lg:text-xl font-bold text-yellow-700 text-center">⏳ Waiting...</p>
          </div>
        )}

        {quizRoom.acceptingAnswers && !isAnswered && (
          <div className="bg-cyan-100 border-2 border-cyan-300 rounded-2xl p-4 lg:p-5 shadow-md animate-pulse">
            <p className="text-base sm:text-lg lg:text-xl font-bold text-cyan-800 text-center">
              👀 Choose Now!
            </p>
          </div>
        )}
        
        {isAnswered && !showRevealAnimation && (
          <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-4 lg:p-5 shadow-md">
            <p className="text-base sm:text-lg lg:text-xl font-bold text-green-700 text-center">✓ Submitted!</p>
            <p className="text-sm sm:text-base font-medium text-green-600 mt-1 text-center">Waiting...</p>
          </div>
        )}
      </div>

      {/* Options Container */}
      <div className="flex-1 bg-gray-600 border-2 border-gray-500 rounded-2xl p-6 lg:p-10 shadow-lg animate-fade-in-up">
        <div className="h-full grid grid-cols-2 gap-5 lg:gap-8">
          {optionConfig.map((config, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered || !quizRoom.acceptingAnswers}
              className={getOptionClasses(index)}
            >
              <div className="flex flex-col items-center justify-center gap-1 lg:gap-3">
                <div className="text-5xl sm:text-6xl lg:text-7xl drop-shadow-lg">{config.symbol}</div>
                <div className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-wide">{config.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>

      {/* Answer Reveal Modal - Student View */}
      {showRevealAnimation && selectedOption !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4">
          <div className={`relative max-w-lg sm:max-w-2xl w-full mx-4 p-6 sm:p-12 rounded-3xl shadow-2xl transform transition-all duration-500 ${
            selectedOption === currentQuestion.correctOption 
              ? 'bg-green-500 animate-bounce-in scale-110' 
              : 'bg-red-500 animate-shake'
          }`}>
            {/* Confetti effect for correct answer */}
            {selectedOption === currentQuestion.correctOption && (
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-20px',
                      backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)],
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Icon */}
            <div className="text-center mb-6 sm:mb-8">
              {selectedOption === currentQuestion.correctOption ? (
                <div className="inline-block text-white animate-scale-up">
                  <svg className="w-24 h-24 sm:w-32 sm:h-32 mx-auto drop-shadow-2xl" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="inline-block text-white animate-scale-up">
                  <svg className="w-24 h-24 sm:w-32 sm:h-32 mx-auto drop-shadow-2xl" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="text-center space-y-3 sm:space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white drop-shadow-lg">
                {selectedOption === currentQuestion.correctOption ? '🎉 CORRECT! 🎉' : '❌ WRONG!'}
              </h2>
              <p className="text-lg sm:text-2xl font-bold text-white/90">
                Correct Answer: <span className="font-black text-white drop-shadow-md">{optionConfig[currentQuestion.correctOption].label}</span>
              </p>
              {selectedOption !== currentQuestion.correctOption && (
                <p className="text-base sm:text-xl font-semibold text-white/80">
                  Your Answer: <span className="line-through">{optionConfig[selectedOption].label}</span>
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowRevealAnimation(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white text-2xl sm:text-3xl font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/20 hover:bg-black/40 transition-all flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Live Leaderboard Modal */}
      {showLiveLeaderboard && (
        <LiveLeaderboardModal
          scores={getScores().map((score, index) => {
            const prevRank = previousScores.findIndex(s => s.studentId === score.studentId);
            return {
              ...score,
              currentRank: index + 1,
              previousRank: prevRank >= 0 ? prevRank + 1 : undefined,
            };
          })}
          currentUserId={student?.id}
          questionNumber={quizRoom.currentQuestionIndex + 1}
          totalQuestions={quizRoom.questions.length}
          onClose={() => {
            setShowLiveLeaderboard(false);
            if (userRole === 'admin') {
              // Admin can continue from here
              showToast('Ready for next question', 'info');
            }
          }}
        />
      )}
    </>
  );
};

export default QuizScreen;