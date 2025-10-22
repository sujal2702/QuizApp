import React from 'react';

const Option: React.FC<{ text: string; isCorrect?: boolean; isSelected?: boolean }> = ({
  text,
  isCorrect = false,
  isSelected = false,
}) => {
  const baseClasses = 'w-full text-left p-4 rounded-lg border-2 transition-all text-lg';
  let stateClasses = 'bg-card-bg border-border-color';

  if (isCorrect) {
    stateClasses = 'bg-green-100 border-green-500';
  } else if (isSelected) {
    stateClasses = 'bg-red-100 border-red-500';
  }

  return (
    <div className={`${baseClasses} ${stateClasses}`}>
      {text}
    </div>
  );
};

export const MiniQuiz: React.FC = () => {
  const progressPercentage = (3 / 5) * 100;

  return (
    <div className="w-full p-6 bg-card-bg/80 backdrop-blur-sm border border-border-color rounded-2xl shadow-2xl">
      <div className="w-full bg-border-color rounded-full h-2.5 mb-4">
        <div
          className="bg-gradient-to-r from-orange-400 to-brand-peach h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Question 3/5</span>
        <div className="text-3xl font-bold text-brand-peach">12</div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">
        What is the powerhouse of the cell?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Option text="Nucleus" />
        <Option text="Ribosome" />
        <Option text="Mitochondrion" isCorrect />
        <Option text="Chloroplast" />
      </div>
    </div>
  );
};