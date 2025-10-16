import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './views/login/login'
import Home from './views/home/home'
import CustomDrawer from './drawer'
import ListaAgregados from './views/agregados/listaAgregados';
import ListaIngresados from './views/ingresados/listaIngresados';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import SessionExpiredModal from './components/SessionExpiredModal';
import { setSessionExpiredHandler } from './config/apiconfig';

function AppContent() {
  const { isAuthenticated, isLoading, logout, refreshAuth } = useAuth();
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setShowSessionModal(true);
    });
  }, []);

  const handleExtendSession = async () => {
    await refreshAuth();
    setShowSessionModal(false);
  };

  const handleLogout = async () => {
    setShowSessionModal(false);
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e4e7f7]">
        <div className="w-12 h-12 border-4 border-[#80858e]/30 border-t-[#80858e] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <CustomDrawer onLogout={logout}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/listaAgregados" element={<ListaAgregados />} />
          <Route path="/listaIngresados" element={<ListaIngresados />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </CustomDrawer>

      <SessionExpiredModal
        isOpen={showSessionModal}
        onExtend={handleExtendSession}
        onLogout={handleLogout}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App