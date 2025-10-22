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
    className={`absolute text-brand-peach/20 motion-safe:animate-float ${className}`}
    style={style}
  >
    {children}
  </div>
);

export const FloatingSymbols = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      <Symbol
        className="top-[10%] left-[5%]"
        style={{ animationDelay: '0s', animationDuration: '8s' }}
      >
        <BrainIcon className="w-16 h-16" />
      </Symbol>
      <Symbol
        className="top-[20%] right-[10%]"
        style={{ animationDelay: '1s', animationDuration: '10s' }}
      >
        <LightbulbIcon className="w-12 h-12" />
      </Symbol>
      <Symbol
        className="bottom-[25%] left-[15%]"
        style={{ animationDelay: '2s', animationDuration: '7s' }}
      >
        <AtomIcon className="w-20 h-20" />
      </Symbol>
      <Symbol
        className="bottom-[10%] right-[5%]"
        style={{ animationDelay: '3s', animationDuration: '9s' }}
      >
        <GraduationCapIcon className="w-14 h-14" />
      </Symbol>
       <Symbol
        className="top-[50%] left-[40%]"
        style={{ animationDelay: '1.5s', animationDuration: '11s' }}
      >
        <BrainIcon className="w-10 h-10" />
      </Symbol>
       <Symbol
        className="top-[60%] right-[30%]"
        style={{ animationDelay: '2.5s', animationDuration: '6s' }}
      >
        <LightbulbIcon className="w-16 h-16" />
      </Symbol>
    </div>
  );
};