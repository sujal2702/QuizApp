import React from 'react';
import { Screen, UserRole } from '../hooks/useQuiz';
import { RoleCard } from '../components/RoleCard';
import { CrownIcon } from '../components/icons/CrownIcon';
import { GraduationCapIcon } from '../components/icons/GraduationCapIcon';

interface HomeScreenProps {
  setScreen: (screen: Screen) => void;
  setUserRole: (role: UserRole) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setScreen, setUserRole }) => {
  const handleAdminClick = () => {
    setUserRole('admin');
    setScreen('admin_login');
  };

  const handleStudentClick = () => {
    setUserRole('student');
    setScreen('student_join');
  };

  return (
    <div className="w-full max-w-2xl text-center p-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in-up">
      <h2 className="text-3xl font-bold mb-8 text-white">Join as...</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RoleCard 
          icon={<CrownIcon className="w-16 h-16" />}
          title="Quiz Master"
          description="Create & host the quiz"
          onClick={handleAdminClick}
        />
        <RoleCard 
          icon={<GraduationCapIcon className="w-16 h-16" />}
          title="Participant"
          description="Join a quiz room"
          onClick={handleStudentClick}
        />
      </div>
    </div>
  );
};

export default HomeScreen;