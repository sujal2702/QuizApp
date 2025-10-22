import React from 'react';

const Option: React.FC<{ text: string; isCorrect?: boolean; isSelected?: boolean }> = ({
  text,
  isCorrect = false,
  isSelected = false,
}) => {
  const baseClasses = 'w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-sm sm:text-lg min-h-[44px] flex items-center font-medium';
  let stateClasses = 'bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100 hover:border-gray-400';

  if (isCorrect) {
    stateClasses = 'bg-yellow-50 border-yellow-400 text-gray-900 shadow-md';
  } else if (isSelected) {
    stateClasses = 'bg-red-50 border-red-400 text-gray-900';
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
    <div className="w-full p-4 sm:p-6 bg-white border-2 border-gray-200 rounded-2xl shadow-xl">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full shadow-sm transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Question Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-base sm:text-lg font-bold text-gray-900">Question 3/5</span>
        <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-full border border-yellow-300">
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-lg sm:text-2xl font-bold text-yellow-700">12s</span>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-gray-900">
        What is the powerhouse of the cell?
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Option text="Nucleus" />
        <Option text="Ribosome" />
        <Option text="Mitochondrion" isCorrect />
        <Option text="Chloroplast" />
      </div>
    </div>
  );
};