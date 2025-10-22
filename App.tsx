import React, { useState } from 'react';
import { QuizProvider, Screen, UserRole } from './hooks/useQuiz';
import { AuthProvider } from './hooks/useAuth';
import LandingScreen from './screens/LandingScreen';
import HomeScreen from './screens/HomeScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminSignupScreen from './screens/AdminSignupScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import StudentJoinScreen from './screens/StudentJoinScreen';
import LobbyScreen from './screens/LobbyScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import ShaderBackground from './components/ShaderBackground';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const renderScreen = () => {
    switch (screen) {
      case 'landing':
        return <LandingScreen setScreen={setScreen} />;
      case 'home':
        return <HomeScreen setScreen={setScreen} setUserRole={setUserRole} />;
      case 'admin_login':
        return <AdminLoginScreen setScreen={setScreen} />;
      case 'admin_signup':
        return <AdminSignupScreen setScreen={setScreen} />;
      case 'admin_dashboard':
        return <AdminDashboardScreen setScreen={setScreen} />;
      case 'student_join':
        return <StudentJoinScreen setScreen={setScreen} />;
      case 'lobby':
        return <LobbyScreen setScreen={setScreen} userRole={userRole} />;
      case 'quiz':
        return <QuizScreen setScreen={setScreen} userRole={userRole} />;
      case 'results':
        return <ResultsScreen setScreen={setScreen} userRole={userRole} />;
      default:
        return <LandingScreen setScreen={setScreen} />;
    }
  };
  
  const isLandingPage = screen === 'landing';

  return (
    <div className="text-dark-text min-h-screen flex flex-col font-sans relative z-0">
      {screen !== 'landing' && <ShaderBackground />}
      <Header screen={screen} setScreen={setScreen} />
      <main className={`flex-grow ${!isLandingPage ? 'container mx-auto p-4 flex flex-col items-center justify-center' : ''}`}>
        {renderScreen()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <AppContent />
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;