import React, { useState } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Screen } from '../hooks/useQuiz';
import Button from '../components/Button';
import Input from '../components/Input';

interface StudentJoinScreenProps {
  setScreen: (screen: Screen) => void;
}

const StudentJoinScreen: React.FC<StudentJoinScreenProps> = ({ setScreen }) => {
  const { joinRoom, quizRoom } = useQuiz();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Please enter your name and a room code.');
      return;
    }

    setError('Joining room...');
    
    try {
      const student = await joinRoom(name.trim(), code.trim().toUpperCase());
      if (student) {
        setError('');
        setScreen('lobby');
      } else {
        setError('Invalid room code. Please check and try again.');
      }
    } catch (err) {
      console.error('Join error:', err);
      setError('Failed to join room. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white border-2 border-gray-200 rounded-3xl shadow-xl animate-fade-in-up">
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-cyan-200 flex items-center justify-center shadow-lg">
          <span className="text-3xl">🎓</span>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Join Quiz</h2>
      <p className="text-gray-600 text-center mb-6">Enter your details to participate</p>
      <form onSubmit={handleJoin} className="space-y-6">
        <Input
          id="name"
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          placeholder="John Doe"
        />
        <Input
          id="code"
          label="Room Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          maxLength={6}
          style={{ textTransform: 'uppercase' }}
          placeholder="ABC123"
        />
        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
        <Button type="submit" variant="secondary">Join Room →</Button>
        <Button type="button" variant="outline" onClick={() => setScreen('home')}>
          Back
        </Button>
      </form>
    </div>
  );
};

export default StudentJoinScreen;