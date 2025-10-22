import React from 'react';
import { BrainIcon } from './icons/BrainIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { AtomIcon } from './icons/AtomIcon';
import { GraduationCapIcon } from './icons/GraduationCapIcon';

const Symbol: React.FC<{
  children: React.ReactNode;
  className: string;
  style: React.CSSProperties;
}> = ({ children, className, style }) => (
  <div
    className={`absolute text-violet-500/20 motion-safe:animate-float ${className}`}
    style={style}
  >
    {children}
  </div>
);

export const FloatingSymbols = () => {
  // Keep the component but render subtle dark blurred shapes for background depth
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-20 -left-16 w-80 h-80 bg-gradient-to-br from-violet-900/20 to-transparent rounded-full blur-3xl opacity-40" />
      <div className="absolute top-24 right-[-8rem] w-64 h-64 bg-gradient-to-br from-purple-900/15 to-transparent rounded-full blur-2xl opacity-30" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-black/10 to-transparent rounded-full blur-3xl opacity-25" />
    </div>
  );
};