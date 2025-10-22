import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "w-full font-bold py-3 px-4 rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 border-2 border-transparent relative overflow-hidden group",
    secondary: "bg-zinc-800 border-2 border-zinc-700 hover:bg-zinc-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  
  const primaryPseudoElement = variant === 'primary' ? 
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_50%_50%,#8b5cf6_0%,#a855f7_50%,#8b5cf6_100%)] group-hover:block hidden" /> : null;
  
  const primaryInnerSpan = variant === 'primary' ? 
    <span className="relative z-10">{children}</span> : children;


  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {primaryPseudoElement}
      {primaryInnerSpan}
    </button>
  );
};

export default Button;