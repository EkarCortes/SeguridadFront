import React from 'react';
import Modal from './Modal';

type Props = {
  open: boolean;
  onExtend: () => void;
  onLogout: () => void;
  onClose?: () => void;
};

const SessionExpiryModal: React.FC<Props> = ({ open, onExtend, onLogout, onClose }) => {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose ?? onLogout} size="sm" title="Sesión expirada">
      <div className="space-y-4">
        <p className="text-sm text-neutral-200">
          Tu sesión ha expirado. ¿Deseas extenderla o cerrar sesión?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Cerrar sesión
          </button>
          <button
            onClick={onExtend}
            className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            Extender sesión
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SessionExpiryModal;
