import React, { useState, useEffect } from 'react';
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
      playSound('success'); // Play success sound
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
    let baseClasses = `w-full aspect-square flex items-center justify-center rounded-3xl border-[6px] transition-all transform text-white font-black shadow-2xl ${config.shadow}`;
    
    if (!isAnswered && quizRoom.acceptingAnswers) {
      return `${baseClasses} ${config.bg} ${config.border} ${config.hoverBg} hover:scale-105 active:scale-95 cursor-pointer animate-pulse`;
    }
    
    if (isAnswered) {
      if (index === selectedOption) {
        return `${baseClasses} ${config.bg} ${config.border} scale-105 ring-8 ring-white`;
      }
    }
    
    // Disabled state
    return `${baseClasses} bg-gray-600 border-gray-500 opacity-40 cursor-not-allowed`;
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 pb-4">
        {/* Question Details Container */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 lg:gap-6">
        {/* Progress Bar */}
        <div className="bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-sm border-4 border-white/30 rounded-3xl p-4 lg:p-6 shadow-2xl animate-fade-in">
          <div className="w-full bg-white/20 rounded-full h-3 lg:h-4 mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="text-center">
            <span className="text-xl lg:text-2xl font-black text-white drop-shadow-lg">
              Question {quizRoom.currentQuestionIndex + 1} / {quizRoom.questions.length}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-sm border-4 border-white/30 rounded-3xl p-4 lg:p-6 shadow-2xl flex items-center justify-center">
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
          <div className="bg-yellow-400 border-4 border-yellow-600 rounded-3xl p-4 lg:p-6 shadow-2xl animate-bounce">
            <p className="text-lg lg:text-2xl font-black text-yellow-900 text-center">⏳ Waiting...</p>
          </div>
        )}

        {quizRoom.acceptingAnswers && !isAnswered && (
          <div className="bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 border-4 border-purple-300 rounded-3xl p-4 lg:p-6 shadow-2xl animate-pulse">
            <p className="text-lg lg:text-2xl font-black text-white text-center drop-shadow-lg">
              👀 Choose Now!
            </p>
          </div>
        )}
        
        {isAnswered && !showRevealAnimation && (
          <div className="bg-green-500 border-4 border-green-700 rounded-3xl p-4 lg:p-6 shadow-2xl animate-pulse">
            <p className="text-lg lg:text-2xl font-black text-white text-center">✓ Submitted!</p>
            <p className="text-sm lg:text-base font-semibold text-green-100 mt-2 text-center">Waiting...</p>
          </div>
        )}
      </div>

      {/* Options Container */}
      <div className="flex-1 bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-sm border-4 border-white/30 rounded-3xl p-4 lg:p-8 shadow-2xl animate-fade-in-up">
        <div className="h-full grid grid-cols-2 gap-4 lg:gap-8">
          {optionConfig.map((config, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered || !quizRoom.acceptingAnswers}
              className={getOptionClasses(index)}
            >
              <div className="flex flex-col items-center justify-center gap-2 lg:gap-4">
                <div className="text-5xl sm:text-6xl lg:text-8xl">{config.symbol}</div>
                <div className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-wider">{config.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>

      {/* Answer Reveal Modal - Student View */}
      {showRevealAnimation && selectedOption !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`relative max-w-2xl w-full mx-4 p-12 rounded-3xl shadow-2xl transform transition-all duration-500 ${
            selectedOption === currentQuestion.correctOption 
              ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 animate-bounce-in scale-110' 
              : 'bg-gradient-to-br from-red-400 via-red-500 to-red-600 animate-shake'
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
            <div className="text-center mb-8">
              {selectedOption === currentQuestion.correctOption ? (
                <div className="inline-block text-white animate-scale-up">
                  <svg className="w-32 h-32 mx-auto drop-shadow-2xl" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="inline-block text-white animate-scale-up">
                  <svg className="w-32 h-32 mx-auto drop-shadow-2xl" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black text-white drop-shadow-lg">
                {selectedOption === currentQuestion.correctOption ? '🎉 CORRECT! 🎉' : '❌ WRONG!'}
              </h2>
              <p className="text-2xl font-bold text-white/90">
                Correct Answer: <span className="font-black text-white drop-shadow-md">{optionConfig[currentQuestion.correctOption].label}</span>
              </p>
              {selectedOption !== currentQuestion.correctOption && (
                <p className="text-xl font-semibold text-white/80">
                  Your Answer: <span className="line-through">{optionConfig[selectedOption].label}</span>
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowRevealAnimation(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-bold w-12 h-12 rounded-full bg-black/20 hover:bg-black/40 transition-all"
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