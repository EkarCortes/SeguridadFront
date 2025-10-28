import { useState } from 'react';
import { authService } from '../service/authService';
import Modal from './Modal';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onRedirect: () => void;
}

export default function SessionExpiredModal({
  isOpen,
  onRedirect,
}: SessionExpiredModalProps) {
  const [redirecting, setRedirecting] = useState(false);

  const handleRedirect = async () => {
    setRedirecting(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error haciendo logout en servidor:', error);
    }
    localStorage.removeItem('authMe');
    localStorage.clear();
    onRedirect();
  };

  return (
    <Modal open={isOpen} onClose={() => {}} size="md" title="Sesión Expirada">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white">Sesión Expirada</h2>
        <p className="text-neutral-400 text-sm">
          Tu sesión ha expirado por inactividad. Serás redirigido al login.
        </p>

        <div className="pt-4">
          <button
            onClick={handleRedirect}
            disabled={redirecting}
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {redirecting && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {redirecting ? 'Cerrando sesión...' : 'Ir al Login'}
          </button>
        </div>
      </div>
    </Modal>
  );
}