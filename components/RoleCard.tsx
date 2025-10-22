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
      className="group bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-300 cursor-pointer flex flex-col items-center space-y-4 text-center transform hover:-translate-y-2 shadow-lg hover:shadow-xl"
    >
      <div className="text-yellow-500 group-hover:text-yellow-600 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};