import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../service/authService';

interface SessionContextType {
  isSessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const storedAuth = localStorage.getItem('authMe');
      
      // Solo enviamos si el usuario ya inició sesión
      if (storedAuth) {
        try {
          // Enviamos la petición directamente construyendo el objeto fijo según la documentación/swagger
          const response = await authService.refresh("string");
          
          if (response?.success && response?.data) {
             const authData = JSON.parse(storedAuth);
             localStorage.setItem('authMe', JSON.stringify({
               ...authData,
               accessToken: response.data.accessToken,
               refreshToken: response.data.refreshToken,
             }));
          }
        } catch (error) {
          console.error('Error refrescando el token:', error);
        }
      }
    }, 300000); //3 MINUTOS SON 300000 MILISEGUNDOS

    return () => clearInterval(interval);
  }, []);

  const setSessionExpired = (expired: boolean) => {
    setIsSessionExpired(expired);
  };

  return (
    <SessionContext.Provider value={{ isSessionExpired, setSessionExpired }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};