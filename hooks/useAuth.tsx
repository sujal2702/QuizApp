import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signInAdmin, signUpAdmin, resetPassword, signOutUser, getAdminClaim } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const adminClaim = await getAdminClaim(firebaseUser);
        setIsAdmin(adminClaim);
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInAdmin(email, password);
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    await signUpAdmin(email, password, displayName);
  };

  const sendPasswordReset = async (email: string) => {
    await resetPassword(email);
  };

  const logout = async () => {
    await signOutUser();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, signup, sendPasswordReset, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
