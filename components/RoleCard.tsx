import React from 'react';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-zinc-800/50 p-8 rounded-2xl border-2 border-zinc-700 hover:border-violet-500 hover:bg-zinc-800 transition-all duration-300 cursor-pointer flex flex-col items-center space-y-4 text-center transform hover:-translate-y-2"
    >
      <div className="text-violet-500 group-hover:text-violet-400 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
};