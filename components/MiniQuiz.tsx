import React from 'react';

const Option: React.FC<{ text: string; isCorrect?: boolean; isSelected?: boolean }> = ({
  text,
  isCorrect = false,
  isSelected = false,
}) => {
  const baseClasses = 'w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all text-sm sm:text-lg min-h-[44px] flex items-center';
  let stateClasses = 'bg-zinc-800 border-zinc-700';

  if (isCorrect) {
    stateClasses = 'bg-green-500/20 border-green-500';
  } else if (isSelected) {
    stateClasses = 'bg-red-500/20 border-red-500';
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
    <div className="w-full p-4 sm:p-6 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl">
      <div className="w-full bg-zinc-800 rounded-full h-2.5 mb-4">
        <div
          className="bg-gradient-to-r from-violet-500 to-purple-600 h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-base sm:text-lg font-semibold text-white">Question 3/5</span>
        <div className="text-2xl sm:text-3xl font-bold text-violet-400">12</div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-white">
        What is the powerhouse of the cell?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Option text="Nucleus" />
        <Option text="Ribosome" />
        <Option text="Mitochondrion" isCorrect />
        <Option text="Chloroplast" />
      </div>
    </div>
  );
};