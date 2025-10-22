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

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Please enter your name and a room code.');
      return;
    }

    if (!quizRoom) {
      setError('No active quiz room. Please ask the admin to create one.');
      return;
    }

    const student = joinRoom(name.trim(), code.trim().toUpperCase());
    if (student) {
      setError('');
      setScreen('lobby');
    } else {
      setError('Invalid room code. Please check and try again.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-card-bg/80 backdrop-blur-sm border border-border-color rounded-2xl shadow-2xl animate-fade-in-up">
      <h2 className="text-3xl font-bold mb-6 text-center text-gradient">Join Quiz</h2>
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
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button type="submit">Join Room</Button>
        <Button type="button" variant="secondary" onClick={() => setScreen('home')}>
          Back
        </Button>
      </form>
    </div>
  );
};

export default StudentJoinScreen;