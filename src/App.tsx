import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';

import Home from './views/home/home'
import CustomDrawer from './drawer'
import ListaAgregados from './views/agregados/listaAgregados';
import ListaIngresados from './views/ingresados/listaIngresados';
import Login from './views/login/login';
import useAuth from './hooks/useAuth';
import SessionExpiredModal from './components/SessionExpiredModal';
import { SessionProvider, useSession } from './contexts/SessionContext';
import { setSessionExpiredCallback } from './config/apiconfig';
import LoadingSpinner from './components/Spinner';
import ChangePassword from './views/login/ChangePassword';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const { isSessionExpired, setSessionExpired } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      setSessionExpiredCallback(() => {
        setSessionExpired(true);
      });
    }
  }, [user, setSessionExpired]);

  const handleLogout = async () => {
    setIsRedirecting(true);
    await logout();
    window.location.replace('/');
  };

  if (loading || isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#e4e7f7]">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <>
      {user && (
        <SessionExpiredModal 
          isOpen={isSessionExpired} 
          onRedirect={handleLogout}
        />
      )}
      
      {user ? (
        <CustomDrawer onLogout={handleLogout}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/listaAgregados" element={<ListaAgregados />} />
            <Route path="/listaIngresados" element={<ListaIngresados />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </CustomDrawer>
      ) : (
        <Routes>
          <Route path="/login/changePassword" element={<ChangePassword />} />
          <Route path="*" element={<Login onLogin={() => window.location.reload()} />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}

export default App