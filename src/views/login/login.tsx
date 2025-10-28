import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/FormField";
import logo from "../../assets/FaceCore 3.png";
import useAuth from "../../hooks/useAuth";
import Modal from "../../components/Modal";
import usePasswordReset from "../../hooks/usePasswordReset";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

interface LoginProps {
  onLogin?: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado

  const {
    loading: resetLoading,
    error: resetError,
    success: resetSuccess,
    sendResetEmail
  } = usePasswordReset();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    await sendResetEmail(resetEmail);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Completa ambos campos.");
      return;
    }

    setLoading(true);

    try {
      await login(username, password);
      onLogin?.();
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#e4e7f7] relative overflow-hidden">
      <div className="w-full max-w-md rounded-2xl bg-[#262c3e]/90 backdrop-blur-xl border border-[#2a3140] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_-10px_rgba(0,0,0,0.6)] p-8 sm:p-10 flex flex-col gap-7">
        <div className="flex flex-col items-center text-center gap-3">
          <img
            src={logo}
            alt="FaceCore"
            className="h-40 select-none drop-shadow-[0_0_25px_rgba(255,255,255,0.08)]"
            draggable={false}
          />
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-4">
            <FormField
              label="USUARIO"
              name="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Nombre de usuario"
            />
            <div className="relative">
              <FormField
                label="CONTRASEÑA"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="********"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                onClick={() => setShowPassword(v => !v)}
                style={{ background: "none", border: "none", padding: 0 }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-300 text-xs bg-red-900/30 border border-red-700/60 rounded-md px-3 py-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="relative w-full group rounded-lg overflow-hidden bg-[#80858e] hover:animate-[pulse_2s_ease-in-out_infinite] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm tracking-wide shadow-lg shadow-gray-900/40 transition"
          >
            <span className="relative flex items-center justify-center gap-2">
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Entrando..." : "Iniciar sesión"}
            </span>
            <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,white,transparent_60%)] transition" />
          </button>
        </form>

        <div className="pt-2 border-t border-[#e4e7f7] text-center">
          <p className="text-neutral-500 text-[11px] tracking-wide">
            <a
              href="#"
              className="text-blue-400 hover:underline"
              onClick={e => {
                e.preventDefault();
                setShowResetModal(true);
              }}
            >
              ¿Olvidaste tu contraseña?{" "}
            </a>
          </p>
        </div>

      </div>
      
      <Modal open={showResetModal} onClose={() => setShowResetModal(false)} title="Recuperar contraseña" size="sm">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm text-white mb-1">Correo electrónico</label>
            <input
              type="email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              className="w-full rounded-md px-3 py-2 bg-[#23273a] text-white border border-[#3a405a] focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="tu@email.com"
              disabled={resetLoading}
              required
            />
          </div>
          {resetError && (
            <div className="text-red-300 text-xs bg-red-900/30 border border-red-700/60 rounded-md px-3 py-2">
              {resetError}
            </div>
          )}
          {resetSuccess && (
            <div className="text-green-300 text-xs bg-green-900/30 border border-green-700/60 rounded-md px-3 py-2">
              {resetSuccess}
            </div>
          )}
          <button
            type="submit"
            disabled={resetLoading}
            className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 text-sm transition disabled:opacity-60"
          >
            {resetLoading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </Modal>
    </div>
  );
}