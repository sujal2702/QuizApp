import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({ label, id, error, size = 'md', className = '', ...props }) => {
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-11 px-4 text-base",
    lg: "h-14 px-5 text-lg",
  };
  
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={id}
        className={`w-full bg-white border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-colors ${sizeClasses[size]} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;