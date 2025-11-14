import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as AppUser } from '@/types/auth';
import { setupTestData } from '@/utils/setupTestData';

interface AuthContextType {
  appUser: AppUser | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Initialize test data if first time
      const hasInitialized = localStorage.getItem('studymatch_initialized');
      if (!hasInitialized) {
        console.log('🚀 Primera carga - inicializando datos...');
        try {
          await setupTestData();
          localStorage.setItem('studymatch_initialized', 'true');
          console.log('✅ Datos inicializados correctamente');
        } catch (error) {
          console.error('❌ Error inicializando datos:', error);
        }
      }

      // Check localStorage for user
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAppUser(user);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeApp();
  }, []);

  const signOut = () => {
    localStorage.removeItem('user');
    setAppUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ appUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
