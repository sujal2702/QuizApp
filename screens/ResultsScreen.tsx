import React, { useState, useEffect } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Screen, UserRole } from '../hooks/useQuiz';
import Button from '../components/Button';
import Leaderboard from '../components/Leaderboard';
import { playSound } from '../utils/sounds';

// A new component for the expand/collapse icon
const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);


interface ResultsScreenProps {
  setScreen: (screen: Screen) => void;
  userRole: UserRole | null;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ setScreen, userRole }) => {
  const { getScores, quizRoom, getStudentResponses } = useQuiz();
  const scores = getScores();
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Get current student ID from sessionStorage if student
  const currentStudent = userRole === 'student' 
    ? JSON.parse(sessionStorage.getItem('quizStudent') || '{}')
    : null;

  // Play applause sound when results are shown for completed quiz
  useEffect(() => {
    if (quizRoom && quizRoom.status === 'ended') {
      playSound('applause');
    }
  }, [quizRoom?.status]);

  const handleToggleDetails = (studentId: string) => {
    setExpandedStudentId(prevId => (prevId === studentId ? null : studentId));
  };

  if (!quizRoom) {
    return (
      <div className="text-center">
        <p>No quiz data available.</p>
        <Button onClick={() => setScreen('home')}>Go Home</Button>
      </div>
    );
  }
  
  const isQuizEnded = quizRoom.status === 'ended';

  return (
  <div className="w-full max-w-4xl p-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in-up">
      <h2 className="text-4xl font-extrabold text-center mb-2 text-gradient">
        {isQuizEnded ? '🏆 Final Results' : '📊 Live Leaderboard'}
      </h2>
      {!isQuizEnded && (
        <p className="text-center text-amber-600 mb-6 animate-pulse font-semibold">Quiz is still in progress...</p>
      )}
      
      {/* Toggle View Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowDetailedView(!showDetailedView)}
          className="px-6 py-3 min-h-[44px] rounded-lg bg-light-bg hover:bg-border-color transition-colors font-semibold"
        >
          {showDetailedView ? '📊 Simple View' : '📋 Detailed View'}
        </button>
      </div>

      {!showDetailedView ? (
        <>
          <div className="flex justify-end mb-4">
            <Button
              variant="secondary"
              onClick={() => {
                // prepare CSV
                const csvRows = [
                  ['Rank','Name','Score','TotalTime']
                ];
                scores.forEach((s, i) => csvRows.push([String(i+1), s.name, String(s.score), String(s.totalTime)]));
                const csvContent = csvRows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                // Use file-saver if available else fallback to link
                // Prefer an existing saveAs (if file-saver is present), otherwise fallback to anchor download
                try {
                  if ((window as any).saveAs) {
                    (window as any).saveAs(blob, `${quizRoom?.name || 'results'}-results.csv`);
                  } else {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${quizRoom?.name || 'results'}-results.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                } catch (e) {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${quizRoom?.name || 'results'}-results.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
            >
              ⬇️ Export CSV
            </Button>
          </div>
          <Leaderboard 
            scores={scores} 
            currentUserId={currentStudent?.id}
            isLive={!isQuizEnded}
          />
        </>
      ) : (
        <div className="space-y-3">
        {scores.map((score, index) => {
          const isExpanded = expandedStudentId === score.studentId;
          const studentResponses = getStudentResponses(score.studentId);
          const isWinner = index === 0 && isQuizEnded;

            return (
            <div
              key={score.studentId}
              className={`bg-zinc-800/60 rounded-lg shadow-md overflow-hidden animate-slide-in ${isWinner ? 'ring-4 ring-yellow-400/40' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-border-color/50"
                onClick={() => handleToggleDetails(score.studentId)}
              >
                <div className="flex items-center">
                  <div className="w-12 text-center text-2xl font-bold">
                    #{index + 1}
                  </div>
                  <span className={`text-lg font-semibold ml-4 ${isWinner ? 'text-yellow-300' : ''}`}>{score.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-700">{score.score} pts</p>
                    <p className="text-xs text-subtle-text">{score.totalTime.toFixed(2)}s</p>
                  </div>
                  <ChevronIcon isExpanded={isExpanded} />
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-zinc-700 bg-zinc-900">
                  <h4 className="font-semibold mb-2 text-violet-400">Question Breakdown:</h4>
                  <ul className="space-y-2">
                    {quizRoom.questions.map((question, qIndex) => {
                      const response = studentResponses.find(r => r.questionId === question.id);
                      const isCorrect = response?.isCorrect;
                      const timeTaken = response?.timeTaken;
                      const wasAnswered = response !== undefined;

                      return (
                        <li key={question.id} className="flex justify-between items-center text-sm p-2 bg-zinc-800/50 rounded-md">
                          <span className="truncate pr-4">{`Q${qIndex + 1}: ${question.text}`}</span>
                          <div className="flex items-center flex-shrink-0">
                            {wasAnswered ? (
                                <>
                                  <span className={`font-bold mr-3 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {isCorrect ? '✔️ Correct' : '❌ Incorrect'}
                                  </span>
                                  <span className="text-subtle-text w-16 text-right">{timeTaken?.toFixed(1)}s</span>
                                </>
                            ) : (
                                <span className="font-bold text-gray-500">
                                  Not Answered
                                </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
      
      <div className="mt-8">
        {isQuizEnded ? (
          <Button onClick={() => setScreen('home')}>
            Play Again
          </Button>
        ) : userRole === 'admin' ? (
          <Button onClick={() => setScreen('quiz')} variant="secondary">
            Back to Quiz Control
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ResultsScreen;