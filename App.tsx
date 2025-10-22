import React, { useState } from 'react';
import { QuizProvider, Screen, UserRole } from './hooks/useQuiz';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
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
import Sidebar from './components/Sidebar';
import PixelBlast from './components/PixelBlast';
import SoundToggle from './components/SoundToggle';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const isStudentQuiz = screen === 'quiz' && userRole === 'student';
  const isAuthScreen = screen === 'home' || screen === 'admin_login' || screen === 'admin_signup' || screen === 'student_join';
  const showSidebar = userRole !== null && !isLandingPage && !isAuthScreen;

  return (
    <div className="text-zinc-100 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 min-h-screen flex font-sans relative z-0">
      {/* PixelBlast Background - Fixed positioning */}
      {screen !== 'landing' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#8B5CF6"
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.6}
            edgeFade={0.25}
            transparent
          />
        </div>
      )}
      
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar 
          screen={screen} 
          userRole={userRole} 
          setScreen={setScreen}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:ml-72' : ''} relative z-10`}>
        <Header 
          screen={screen} 
          setScreen={setScreen}
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={showSidebar}
        />
        <main className={`flex-grow ${!isLandingPage ? 'container mx-auto p-4 lg:p-6 flex flex-col items-center justify-center' : ''}`}>
          {renderScreen()}
        </main>
        {!isStudentQuiz && <Footer />}
      </div>
      
      <SoundToggle />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <QuizProvider>
          <AppContent />
        </QuizProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;