import React from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Screen, UserRole } from '../hooks/useQuiz';
import Button from '../components/Button';

interface LobbyScreenProps {
  setScreen: (screen: Screen) => void;
  userRole: UserRole | null;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ setScreen, userRole }) => {
  const { quizRoom, startQuiz } = useQuiz();

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
      <div className="w-full max-w-2xl p-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in-up">
        <div className="text-center">
          <p className="text-xl text-white">Quiz room not found. Redirecting...</p>
        </div>
      </div>
    );
  }

  const studentCount = quizRoom.students?.length || 0;
  console.log('Rendering lobby with room:', quizRoom.name, 'Code:', quizRoom.code, 'Students:', studentCount);

  const handleStartQuiz = () => {
    startQuiz();
  };

  return (
  <div className="w-full max-w-2xl p-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in-up">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2 text-gradient">🎮 Quiz Lobby</h2>
  <p className="text-2xl text-violet-400 font-bold mb-4">{quizRoom.name}</p>
  <div className="bg-gradient-to-r from-violet-900/10 to-transparent p-6 rounded-xl mb-4 border-2 border-zinc-700">
          <p className="text-subtle-text text-sm font-semibold mb-1">ROOM CODE</p>
          <p className="text-5xl font-mono font-black tracking-widest text-gradient animate-pulse">{quizRoom.code}</p>
          <p className="text-xs text-subtle-text mt-2">Share this code with participants</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">👥</span>
            Participants
          </h3>
          <span className="bg-violet-600 text-white px-3 py-1 rounded-full font-bold text-sm">
            {studentCount}
          </span>
        </div>
  <div className="bg-zinc-800 p-4 rounded-xl h-56 overflow-y-auto border border-zinc-700">
          {studentCount > 0 ? (
            <ul className="space-y-2">
              {quizRoom.students?.map((student, idx) => (
                <li 
                  key={student.id} 
                  className="text-dark-text bg-card-bg p-3 rounded-lg animate-fade-in flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold">{student.name}</span>
                  </div>
                  <span className="text-green-500 text-xl">✓</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center pt-16">
              <p className="text-4xl mb-2">⏳</p>
              <p className="text-subtle-text font-semibold">Waiting for participants to join...</p>
              <p className="text-xs text-subtle-text mt-2">Students should enter the room code above</p>
            </div>
          )}
        </div>
      </div>

      {userRole === 'admin' && (
        <div className="space-y-3">
          <Button onClick={handleStartQuiz} disabled={studentCount === 0}>
            {studentCount === 0 ? '⏳ Waiting for players' : `🚀 Start Quiz (${studentCount} player${studentCount > 1 ? 's' : ''})`}
          </Button>
          <p className="text-center text-xs text-subtle-text">
            {quizRoom.questions?.length || 0} questions • {quizRoom.mode === 'option-only' ? 'Option-Only Mode' : 'Standard Mode'}
          </p>
        </div>
      )}
      {userRole === 'student' && (
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-lg font-semibold text-blue-800 animate-pulse">⏳ Waiting for the Quiz Master to start...</p>
          <p className="text-xs text-blue-600 mt-1">Get ready! The quiz will begin shortly</p>
        </div>
      )}
    </div>
  );
};

export default LobbyScreen;