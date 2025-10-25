import Modal from './Modal';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function LogoutConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  loading = false
}: LogoutConfirmModalProps) {
  return (
    <Modal open={isOpen} onClose={onCancel} size="sm" title="Confirmar Cierre de Sesión">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-white">¿Cerrar Sesión?</h3>
        
        <p className="text-neutral-400 text-sm">
          ¿Estás seguro de que quieres cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder.
        </p>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold text-sm transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading ? 'Cerrando...' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>
    </Modal>
  );
}