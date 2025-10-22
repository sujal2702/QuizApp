import React, { useState } from 'react';
import { Screen } from '../hooks/useQuiz';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import Input from '../components/Input';

interface AdminSignupScreenProps {
  setScreen: (screen: Screen) => void;
}

const AdminSignupScreen: React.FC<AdminSignupScreenProps> = ({ setScreen }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.name);
      setSuccess('Account created successfully! Redirecting...');
      
      // Show success message and redirect
      setTimeout(() => {
        setScreen('admin_dashboard');
      }, 1500);
      
    } catch (err: any) {
      console.error('Signup failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error on input
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-2xl animate-fade-in-up">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
          Create Admin Account
        </h2>
        <p className="text-slate-600">Sign up to start hosting quizzes</p>
      </div>
      
      <form onSubmit={handleSignup} className="space-y-5">
        <Input
          id="name"
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="John Doe"
          required
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="admin@example.com"
          required
        />
        
        <Input
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Minimum 6 characters"
          required
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          placeholder="Re-enter password"
          required
        />
        
        {error && (
          <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg animate-pulse">
            <p className="text-red-700 text-sm text-center font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg">
            <p className="text-green-700 text-sm text-center font-medium">{success}</p>
          </div>
        )}
        
        <Button type="submit" disabled={loading} className="!w-full">
          {loading ? '⏳ Creating Account...' : '🚀 Sign Up'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <button
            onClick={() => setScreen('admin_login')}
            className="text-violet-600 font-bold hover:text-fuchsia-600 transition-colors underline"
          >
            Login here
          </button>
        </p>
      </div>
      
      <div className="mt-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => setScreen('home')}
          className="!w-full"
        >
          ← Back to Home
        </Button>
      </div>
      
      <div className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
        <p className="text-xs text-slate-700 text-center leading-relaxed">
          ⚠️ <strong>Note:</strong> After signup, contact your system administrator to grant admin privileges.
        </p>
      </div>
    </div>
  );
};

export default AdminSignupScreen;
