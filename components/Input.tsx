import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-subtle-text mb-1">{label}</label>
      <input
        id={id}
        className="w-full p-3 bg-light-bg border border-border-color rounded-lg text-dark-text placeholder-subtle-text focus:outline-none focus:ring-2 focus:ring-brand-peach"
        {...props}
      />
    </div>
  );
};

export default Input;