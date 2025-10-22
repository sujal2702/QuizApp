import React, { useState } from 'react';
import { Screen } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';

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
      // Auth state change will trigger redirect to dashboard
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
    <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-2xl animate-fade-in-up">
      <h2 className="text-4xl font-black mb-2 text-center bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
        Admin Login
      </h2>
      <p className="text-slate-600 text-center mb-6">Sign in with your admin credentials</p>
      
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
          <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
            <p className="text-red-700 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg">
            <p className="text-green-700 text-sm text-center font-medium">{success}</p>
          </div>
        )}
        
        <Button type="submit" disabled={loading} className="!w-full">
          {loading ? '⏳ Signing In...' : '🔐 Login'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-violet-600 hover:text-fuchsia-600 font-medium underline transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </form>

      {showForgotPassword && (
        <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-200">
          <p className="text-sm text-slate-700 mb-3">
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
              className="!bg-slate-200 hover:!bg-slate-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <button
            onClick={() => setScreen('admin_signup')}
            className="text-violet-600 font-bold hover:text-fuchsia-600 transition-colors underline"
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
      
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600 text-center">
          💡 <strong>First time?</strong> Ask your system admin to create an account and grant admin privileges.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginScreen;