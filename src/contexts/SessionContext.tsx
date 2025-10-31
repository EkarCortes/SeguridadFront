import { createContext, useContext, useState, type ReactNode } from 'react';

interface SessionContextType {
  isSessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

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