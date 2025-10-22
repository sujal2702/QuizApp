import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}) => {
  // Base classes - rounded buttons with modern shadow
  const baseClasses = "w-full font-bold rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg";
  
  // Size classes - standard heights for touch targets
  const sizeClasses = {
    sm: "h-8 px-4 text-sm min-h-[2rem]",
    md: "h-11 px-6 text-base min-h-[2.75rem]",
    lg: "h-14 px-8 text-lg min-h-[3.5rem]",
  };
  
  // Variant classes - solid colors matching the new design system
  const variantClasses = {
    primary: "bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus:ring-yellow-400",
    secondary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-700",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    outline: "bg-transparent text-gray-900 hover:bg-gray-100 border-2 border-gray-300 hover:border-gray-400 focus:ring-gray-300 shadow-none",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;