import { useState } from 'react';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onRedirect: () => void;
}

export default function SessionExpiredModal({
  isOpen,
  onRedirect,
}: SessionExpiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#262c3e] rounded-2xl border border-[#2a3140] shadow-2xl p-8 max-w-md w-full">
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
              onClick={onRedirect}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
            >
              Ir al Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}