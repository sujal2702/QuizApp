import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick 
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-md',
    elevated: 'bg-white border border-gray-200 shadow-xl',
    outlined: 'bg-transparent border-2 border-gray-300',
    flat: 'bg-gray-50',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const hoverClasses = hover 
    ? 'hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/20 cursor-pointer hover:-translate-y-1 transition-transform' 
    : '';

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
