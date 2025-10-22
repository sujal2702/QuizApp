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
      className="group bg-card-bg p-8 rounded-2xl border-2 border-border-color hover:border-brand-peach hover:bg-brand-cream transition-all duration-300 cursor-pointer flex flex-col items-center space-y-4 text-center transform hover:-translate-y-2"
    >
      <div className="text-brand-peach group-hover:text-orange-500 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-dark-text">{title}</h3>
      <p className="text-subtle-text">{description}</p>
    </div>
  );
};