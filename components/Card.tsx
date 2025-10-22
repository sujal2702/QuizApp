import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'bordered';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  onClick 
}) => {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-zinc-900/90 border border-zinc-800/50 shadow-xl',
    gradient: 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800/50 shadow-2xl',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl',
    bordered: 'bg-zinc-900 border-2 border-zinc-800 shadow-lg',
  };

  const hoverClasses = hover 
    ? 'hover:scale-102 hover:shadow-2xl hover:border-violet-500/50 cursor-pointer' 
    : '';

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
