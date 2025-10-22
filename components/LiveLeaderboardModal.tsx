import React, { useEffect, useState } from 'react';
import { CrownIcon } from './icons/CrownIcon';
import { MedalIcon } from './icons/MedalIcon';

interface LiveLeaderboardModalProps {
  scores: Array<{
    studentId: string;
    name: string;
    score: number;
    totalTime: number;
    previousRank?: number;
    currentRank: number;
  }>;
  currentUserId?: string;
  questionNumber: number;
  totalQuestions: number;
  onClose: () => void;
}

const LiveLeaderboardModal: React.FC<LiveLeaderboardModalProps> = ({
  scores,
  currentUserId,
  questionNumber,
  totalQuestions,
  onClose,
}) => {
  const [showScores, setShowScores] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    // Delay showing scores for dramatic effect
    const timer = setTimeout(() => setShowScores(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Highlight current user
    if (currentUserId) {
      const timer = setTimeout(() => setHighlightedId(currentUserId), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUserId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <CrownIcon className="w-10 h-10 text-yellow-400 drop-shadow-glow" />;
      case 2:
        return <MedalIcon className="w-9 h-9 text-gray-300" />;
      case 3:
        return <MedalIcon className="w-8 h-8 text-amber-600" />;
      default:
        return <span className="text-3xl font-bold text-zinc-400">#{rank}</span>;
    }
  };

  const getRankChange = (student: typeof scores[0]) => {
    if (!student.previousRank) return null;
    const change = student.previousRank - student.currentRank;
    if (change === 0) return null;
    
    return (
      <div className={`flex items-center gap-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
        {change > 0 ? (
          <>
            <svg className="w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-bold">+{change}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-bold">{change}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4">
      <div className="relative max-w-2xl w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl border-2 border-violet-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <h2 className="text-4xl font-black text-white drop-shadow-lg relative z-10">
            📊 Live Leaderboard
          </h2>
          <p className="text-violet-200 mt-2 font-semibold relative z-10">
            After Question {questionNumber} of {totalQuestions}
          </p>
        </div>

        {/* Scores Container */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {showScores ? (
            <div className="space-y-3">
              {scores.map((student, index) => {
                const isCurrentUser = student.studentId === currentUserId;
                const isHighlighted = highlightedId === student.studentId;
                
                return (
                  <div
                    key={student.studentId}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-500 transform ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50 scale-105'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 border-gray-400/30'
                        : index === 2
                        ? 'bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-600/30'
                        : 'bg-zinc-800/50 border-zinc-700/50'
                    } ${
                      isCurrentUser
                        ? 'ring-4 ring-violet-500 ring-opacity-60'
                        : ''
                    } ${
                      isHighlighted
                        ? 'animate-pulse-scale'
                        : 'hover:scale-102'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'backwards'
                    }}
                  >
                    {/* Rank Icon */}
                    <div className="flex-shrink-0 w-16 flex items-center justify-center">
                      {getRankIcon(student.currentRank)}
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xl text-white truncate">
                          {student.name}
                        </p>
                        {isCurrentUser && (
                          <span className="text-violet-400 text-sm font-semibold px-2 py-1 bg-violet-500/20 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">
                        Total Time: {student.totalTime.toFixed(1)}s
                      </p>
                    </div>

                    {/* Rank Change */}
                    {getRankChange(student) && (
                      <div className="flex-shrink-0">
                        {getRankChange(student)}
                      </div>
                    )}

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-4xl font-black bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                        {student.score}
                      </p>
                      <p className="text-xs text-zinc-400 font-semibold">points</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-20 h-20 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-semibold text-white">Calculating rankings...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-700 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveLeaderboardModal;
