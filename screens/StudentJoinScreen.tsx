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
    <div className="w-full max-w-md p-8 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in-up">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Join Quiz</h2>
      <form onSubmit={handleJoin} className="space-y-6">
        <Input
          id="name"
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
        <Input
          id="code"
          label="Room Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          maxLength={6}
          style={{ textTransform: 'uppercase' }}
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <Button type="submit">Join Room</Button>
        <Button type="button" variant="secondary" onClick={() => setScreen('home')}>
          Back
        </Button>
      </form>
    </div>
  );
};

export default StudentJoinScreen;