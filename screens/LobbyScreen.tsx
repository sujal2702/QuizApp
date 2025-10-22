import React, { useState, useEffect } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Screen, UserRole } from '../hooks/useQuiz';
import Button from '../components/Button';
import { playSound } from '../utils/sounds';

interface LobbyScreenProps {
  setScreen: (screen: Screen) => void;
  userRole: UserRole | null;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ setScreen, userRole }) => {
  const { quizRoom, startQuiz } = useQuiz();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [readyPlayers, setReadyPlayers] = useState<Set<string>>(new Set());
  const [showQuizPreview, setShowQuizPreview] = useState(false);
  const roomLink = typeof window !== 'undefined' ? `${window.location.origin}?room=${quizRoom?.code ?? ''}` : '';

  React.useEffect(() => {
    console.log('LobbyScreen mounted, userRole:', userRole, 'quizRoom:', quizRoom);
  }, []);

  React.useEffect(() => {
    if (quizRoom?.status === 'active') {
      console.log('Quiz status changed to active, navigating to quiz screen');
      setScreen('quiz');
    }
  }, [quizRoom?.status, setScreen]);

  React.useEffect(() => {
    if (!quizRoom) {
      console.log('No quiz room found, redirecting to home in 2s');
      const timer = setTimeout(() => setScreen('home'), 2000);
      return () => clearTimeout(timer);
    }
  }, [quizRoom, setScreen]);

  if (!quizRoom) {
    return (
      <div className="w-full max-w-2xl p-8 bg-white border-2 border-gray-200 rounded-3xl shadow-xl animate-fade-in-up">
        <div className="text-center">
          <p className="text-xl text-gray-900">Quiz room not found. Redirecting...</p>
        </div>
      </div>
    );
  }

  const studentCount = quizRoom.students?.length || 0;
  console.log('Rendering lobby with room:', quizRoom.name, 'Code:', quizRoom.code, 'Students:', studentCount);

  // Play join sound when new students join
  useEffect(() => {
    if (studentCount > 0) {
      playSound('join');
    }
  }, [studentCount]);

  const handleStartQuiz = () => {
    // start a short countdown for nicer UX, then call startQuiz
    if ((quizRoom?.students?.length || 0) === 0) {
      // fallback: still call startQuiz if no players (admin choice)
      startQuiz();
      return;
    }

    setCountdown(5);
    playSound('countdown'); // Play countdown sound when starting
  };

  // countdown effect: when it reaches 0, fire startQuiz()
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      startQuiz();
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => setCountdown(prev => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [countdown, startQuiz]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setCopySuccess(true);
      playSound('success');
      setTimeout(() => setCopySuccess(false), 2000);
      if ((window as any).showToast) (window as any).showToast('Room link copied to clipboard! 🎉', 'success');
    } catch (e) {
      console.error('copy failed', e);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(quizRoom?.code || '');
      playSound('success');
      if ((window as any).showToast) (window as any).showToast('Room code copied! ✨', 'success');
    } catch (e) {
      console.error('copy failed', e);
    }
  };

  return (
  <div className="w-full max-w-5xl animate-fade-in-up space-y-6 px-4">
    {/* Main Lobby Card */}
    <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-xl p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
          <span className="text-3xl">🎮</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">✨ Quiz Lobby</h2>
        <p className="text-lg sm:text-2xl text-yellow-600 font-bold mb-4">{quizRoom.name}</p>
        
        {/* Room Code Section with Enhanced Design */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl mb-4 border-2 border-yellow-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-200 rounded-full -ml-12 -mb-12 opacity-50"></div>
          <div className="relative z-10">
            <p className="text-sm sm:text-base text-gray-700 mb-2 font-semibold flex items-center justify-center gap-2">
              🔑 ROOM CODE
            </p>
            <p className="text-4xl sm:text-6xl font-mono font-black tracking-widest text-gray-900 animate-pulse mb-3">
              {quizRoom.code}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 bg-white hover:bg-yellow-50 text-gray-900 rounded-xl font-semibold text-sm border-2 border-yellow-400 transition-all hover:scale-105 shadow-md"
              >
                📋 Copy Code
              </button>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-md"
              >
                {copySuccess ? '✅ Copied!' : '🔗 Copy Link'}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-3">Share this code or link with participants to join</p>
          </div>
        </div>
      </div>
      
      {/* Quiz Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border-2 border-cyan-200 text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-black text-gray-900">{quizRoom.questions?.length || 0}</div>
          <div className="text-sm text-gray-600 font-semibold">Questions</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200 text-center">
          <div className="text-3xl mb-2">⏱️</div>
          <div className="text-2xl font-black text-gray-900">
            {Math.round((quizRoom.questions?.reduce((acc, q) => acc + q.timeLimit, 0) || 0) / 60)}m
          </div>
          <div className="text-sm text-gray-600 font-semibold">Total Time</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-black text-gray-900">{quizRoom.mode === 'option-only' ? 'Fast' : 'Standard'}</div>
          <div className="text-sm text-gray-600 font-semibold">Mode</div>
        </div>
      </div>

      {/* Participants Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">👥</span>
            Participants
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-base shadow-md">
              {studentCount} {studentCount === 1 ? 'Player' : 'Players'}
            </span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl min-h-[240px] max-h-[320px] overflow-y-auto border-2 border-gray-200">
          {studentCount > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizRoom.students?.map((student, idx) => (
                <div 
                  key={student.id} 
                  className="text-gray-900 bg-white p-4 rounded-xl animate-fade-in flex items-center justify-between shadow-md hover:shadow-lg transition-all border-2 border-gray-200 hover:border-yellow-400 group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-110 transition-transform">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-base block">{student.name}</span>
                      <span className="text-xs text-gray-500">Ready to play 🎯</span>
                    </div>
                  </div>
                  <span className="text-green-500 text-2xl group-hover:scale-125 transition-transform">✓</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center pt-20">
              <div className="text-6xl mb-4 animate-bounce">⏳</div>
              <p className="text-gray-700 font-bold text-lg mb-2">Waiting for participants to join...</p>
              <p className="text-sm text-gray-500">Students should enter the room code above</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {userRole === 'admin' && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button 
              onClick={handleStartQuiz} 
              disabled={studentCount === 0}
              className="flex-1"
            >
              {studentCount === 0 ? '⏳ Waiting for players' : `🚀 Start Quiz (${studentCount} player${studentCount > 1 ? 's' : ''})`}
            </Button>
            <button
              onClick={() => setShowQuizPreview(!showQuizPreview)}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all border-2 border-gray-300"
            >
              {showQuizPreview ? '👁️ Hide' : '👁️ Preview'}
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Ready
            </span>
            <span>•</span>
            <span>{quizRoom.questions?.length || 0} questions loaded</span>
            <span>•</span>
            <span className="text-yellow-600 font-semibold">Waiting for your command ⚡</span>
          </div>
        </div>
      )}
      
      {userRole === 'student' && (
        <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
          <div className="text-4xl mb-3 animate-bounce">🎓</div>
          <p className="text-xl font-bold text-blue-800 mb-2">Get Ready!</p>
          <p className="text-sm text-blue-600 mb-4">The Quiz Master will start the quiz shortly</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span className="text-xs text-blue-500 font-semibold">Waiting for start signal...</span>
          </div>
        </div>
      )}
    </div>

    {/* Quiz Preview Panel (Admin Only) */}
    {userRole === 'admin' && showQuizPreview && (
      <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-xl p-6 md:p-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Quiz Preview
          </h3>
          <button
            onClick={() => setShowQuizPreview(false)}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {quizRoom.questions?.map((question, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-gray-900 flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-2">{question.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {question.options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          question.correctOption === optIdx
                            ? 'bg-green-100 border-2 border-green-400 text-green-800 font-semibold'
                            : 'bg-white border border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="font-semibold">{String.fromCharCode(65 + optIdx)}.</span> {option}
                        {question.correctOption === optIdx && ' ✓'}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-semibold whitespace-nowrap">
                  ⏱️ {question.timeLimit}s
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  );
};

export default LobbyScreen;