import React from 'react';
import { CrownIcon } from './icons/CrownIcon';
import { MedalIcon } from './icons/MedalIcon';

interface LeaderboardProps {
  scores: Array<{
    studentId: string;
    name: string;
    score: number;
    totalTime: number;
  }>;
  currentUserId?: string;
  isLive?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores, currentUserId, isLive = false }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <CrownIcon className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <MedalIcon className="w-7 h-7 text-gray-400" />;
      case 3:
        return <MedalIcon className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-subtle-text">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-violet-600 to-purple-600 border-violet-500 text-white';
      case 2:
        return 'bg-zinc-800 border-zinc-700';
      case 3:
        return 'bg-zinc-800 border-zinc-700';
      default:
        return 'bg-zinc-800 border-zinc-700';
    }
  };

  return (
    <div className="w-full">
      {isLive && (
        <div className="flex items-center justify-center gap-2 mb-4 text-red-500 animate-pulse">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="font-semibold">LIVE</span>
        </div>
      )}
      
      <div className="space-y-3">
        {scores.length === 0 ? (
          <div className="text-center py-8 text-subtle-text">
            <p className="text-lg">No responses yet...</p>
            <p className="text-sm">Waiting for students to answer</p>
          </div>
        ) : (
          scores.map((student, index) => {
            const rank = index + 1;
            const isCurrentUser = student.studentId === currentUserId;
            
            return (
              <div
                key={student.studentId}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${getRankBg(rank)} ${
                  isCurrentUser ? 'ring-4 ring-violet-500 ring-opacity-40 scale-105' : ''
                } hover:scale-105`}
              >
                <div className="flex-shrink-0 w-12 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg truncate">
                      {student.name}
                      {isCurrentUser && <span className="text-violet-400 ml-2">(You)</span>}
                    </p>
                  </div>
                  <p className="text-sm text-subtle-text">
                    Time: {student.totalTime.toFixed(1)}s
                  </p>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <p className="text-3xl font-bold text-gradient">
                    {student.score}
                  </p>
                  <p className="text-xs text-subtle-text">points</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
