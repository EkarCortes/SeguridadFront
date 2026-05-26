import { LogOut } from "lucide-react";
import Modal from './Ui/Modal';

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
    <Modal open={isOpen} onClose={onCancel} size="sm" title="Cerrar sesión">
      <div className="flex flex-col items-center text-center gap-5 py-1">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.1)", border: "1.5px solid rgba(239,68,68,0.2)" }}
        >
          <LogOut size={22} strokeWidth={1.8} style={{ color: "#ef4444" }} />
        </div>

        <div className="space-y-1.5">
          <h3
            className="text-base font-bold text-slate-900"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            ¿Estás seguro?
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Tu sesión se cerrará y tendrás que volver a iniciar sesión.
          </p>
        </div>

        <div className="flex gap-2.5 w-full">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-medium transition disabled:opacity-50"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: "white",
              border: "1.5px solid #e2e8f0",
              color: "#475569",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-10 rounded-xl text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ fontFamily: "'Inter', sans-serif", background: "#ef4444" }}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Cerrando..." : "Cerrar sesión"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
