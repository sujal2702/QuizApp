import React, { useState } from 'react';
import { Screen } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';
import { auth, getAdminClaim } from '../firebase';
import Button from '../components/Button';
import Input from '../components/Input';
import { Squares } from '../components/ui/squares-background';

interface AdminLoginScreenProps {
  setScreen: (screen: Screen) => void;
}

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ setScreen }) => {
  const { login, isAdmin, sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // If already logged in as admin, go to dashboard
  React.useEffect(() => {
    if (isAdmin) {
      setScreen('admin_dashboard');
    }
  }, [isAdmin, setScreen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);

      // After sign-in, check the current user's admin claim immediately
      const current = auth.currentUser;
      if (current) {
        const hasAdmin = await getAdminClaim(current);
        if (hasAdmin) {
          setScreen('admin_dashboard');
          return;
        } else {
          setError('Signed in but this account does not have admin privileges.');
        }
      } else {
        setError('Signed in but unable to determine user. Please wait a moment or refresh.');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/user-not-found') {
        setError('No admin account found with this email');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await sendPasswordReset(email);
      setSuccess('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else {
        setError('Failed to send reset email. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 rounded-2xl overflow-hidden">
        <Squares 
          direction="diagonal"
          speed={0.3}
          squareSize={50}
          borderColor="rgba(139, 92, 246, 0.2)"
          hoverFillColor="rgba(139, 92, 246, 0.1)"
        />
      </div>
      
      <div className="p-8 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl animate-fade-in-up">
        <h2 className="text-4xl font-black mb-2 text-center bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Admin Login
        </h2>
        <p className="text-zinc-400 text-center mb-6">Sign in with your admin credentials</p>
      
      <form onSubmit={handleLogin} className="space-y-6">
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        
        {error && (
          <div className="p-3 bg-red-500/10 border-2 border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 border-2 border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm text-center font-medium">{success}</p>
          </div>
        )}
        
        <Button type="submit" disabled={loading} className="!w-full">
          {loading ? '⏳ Signing In...' : '🔐 Login'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-violet-400 hover:text-violet-300 font-medium underline transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </form>

      {showForgotPassword && (
        <div className="mt-4 p-4 bg-violet-500/10 rounded-lg border border-violet-500/30">
          <p className="text-sm text-zinc-300 mb-3">
            Enter your email to receive a password reset link:
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleForgotPassword}
              disabled={loading || !email.trim()}
              variant="secondary"
              className="flex-1"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Button
              onClick={() => setShowForgotPassword(false)}
              variant="secondary"
              className="!bg-zinc-800 hover:!bg-zinc-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-zinc-400">
          Don't have an account?{' '}
          <button
            onClick={() => setScreen('admin_signup')}
            className="text-violet-400 font-bold hover:text-violet-300 transition-colors underline"
          >
            Sign up here
          </button>
        </p>
      </div>

      <Button 
        type="button" 
        variant="secondary" 
        onClick={() => setScreen('home')}
        className="!w-full !mt-4"
      >
        ← Back to Home
      </Button>
      
      <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <p className="text-xs text-zinc-400 text-center">
          💡 <strong className="text-zinc-300">First time?</strong> Ask your system admin to create an account and grant admin privileges.
        </p>
      </div>
    </div>
    </div>
  );
};

export default AdminLoginScreen;