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
      try {
        console.log('🔍 Verificando datos en base de datos...');

        // Check if data exists in Supabase (not localStorage)
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: existingUsers, error: checkError } = await supabase
          .from('users')
          .select('id')
          .limit(1);

        if (checkError) {
          console.error('❌ Error verificando datos:', checkError);
        }

        // If no users exist in database, initialize
        if (!existingUsers || existingUsers.length === 0) {
          console.log('🚀 Base de datos vacía - inicializando datos...');
          try {
            await setupTestData();
            console.log('✅ Datos inicializados correctamente');
          } catch (error) {
            console.error('❌ Error inicializando datos:', error);
            console.error('⚠️ Por favor ejecuta /force-setup manualmente');
          }
        } else {
          console.log('✅ Datos ya existen en la base de datos');
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
      } catch (error) {
        console.error('❌ Error en initializeApp:', error);
      } finally {
        setLoading(false);
      }
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
