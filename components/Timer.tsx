import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isPaused: boolean;
  // optional UTC ms epoch when the question was started; if provided, timer will sync to this
  startedAt?: number | null;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isPaused, startedAt }) => {
  const computeInitial = () => {
    if (startedAt && typeof startedAt === 'number') {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      return Math.max(0, duration - elapsed);
    }
    return duration;
  };

  const [timeLeft, setTimeLeft] = useState<number>(computeInitial());

  useEffect(() => {
    setTimeLeft(computeInitial());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, startedAt]);

  useEffect(() => {
    if (isPaused) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      if (startedAt) {
        // compute based on startedAt to keep clients in sync
        const elapsed = Math.floor((Date.now() - (startedAt as number)) / 1000);
        const newLeft = Math.max(0, duration - elapsed);
        setTimeLeft(newLeft);
        if (newLeft <= 0) onTimeUp();
      } else {
        setTimeLeft(prev => {
          const next = prev - 1;
          if (next <= 0) onTimeUp();
          return next;
        });
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [timeLeft, isPaused, onTimeUp, duration, startedAt]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / duration) * circumference;

  const timeColor = timeLeft <= 5 ? 'text-red-500' : 'text-violet-400';

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-zinc-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={timeLeft <= 5 ? 'text-red-500' : 'text-brand-peach'}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${timeColor}`}>
        {timeLeft}
      </div>
    </div>
  );
};

export default Timer;