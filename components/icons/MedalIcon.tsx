import React from 'react';

interface MedalIconProps {
  rank: number;
}

const GoldMedal = () => (
  <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 6l1.545 3.13L17 9.87l-2.5 2.435L15.09 16 12 14.25 8.91 16l.59-3.695L7 9.87l3.455-.74L12 6z" />
  </svg>
);

const SilverMedal = () => (
  <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 6l1.545 3.13L17 9.87l-2.5 2.435L15.09 16 12 14.25 8.91 16l.59-3.695L7 9.87l3.455-.74L12 6z" />
  </svg>
);

const BronzeMedal = () => (
  <svg className="w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 6l1.545 3.13L17 9.87l-2.5 2.435L15.09 16 12 14.25 8.91 16l.59-3.695L7 9.87l3.455-.74L12 6z" />
  </svg>
);

export const MedalIcon: React.FC<MedalIconProps> = ({ rank }) => {
  if (rank === 1) return <GoldMedal />;
  if (rank === 2) return <SilverMedal />;
  if (rank === 3) return <BronzeMedal />;
  
  return (
    <div className="flex items-center justify-center w-8 h-8 bg-border-color rounded-full">
      <span className="text-sm font-bold text-subtle-text">#{rank}</span>
    </div>
  );
};