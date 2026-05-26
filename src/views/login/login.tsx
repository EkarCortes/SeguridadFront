import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/FaceCore 3.png";
import useAuth from "../../hooks/auth/useAuth";
import Modal from "../../components/Ui/Modal";
import usePasswordReset from "../../hooks/auth/usePasswordResetEmail";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LockKeyhole, User, MailCheck } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const {
    loading: resetLoading,
    error: resetError,
    success: resetSuccess,
    sendResetEmail,
  } = usePasswordReset();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  function handleCloseResetModal() {
    setShowResetModal(false);
    setResetEmail("");
  }

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f7f9ff]">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
          {/* Dark header with logo — sidebar color */}
          <div className="bg-[#262c3e] px-8 py-8 flex justify-center">
            <img
              src={logo}
              alt="FaceCore"
              className="h-28 select-none"
              draggable={false}
            />
          </div>

          {/* Form body */}
          <div className="px-8 py-7 flex flex-col gap-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Username */}
              <div className="space-y-1">
                <label className="block text-slate-700 text-sm font-medium">
                  Usuario
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    placeholder="Nombre de usuario"
                    required
                    autoComplete="username"
                    className="w-full rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm px-3 py-2.5 pl-9 focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 transition disabled:opacity-50 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-slate-700 text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm px-3 py-2.5 pl-9 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 transition disabled:opacity-50 disabled:bg-slate-50"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 rounded-lg bg-[#262c3e] hover:bg-[#2f3650] active:bg-[#1a1f2e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm tracking-wide shadow-md shadow-slate-900/20 transition-all duration-150"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {loading ? "Entrando..." : "Iniciar sesión"}
                </span>
              </button>
            </form>

            {/* Forgot password */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-slate-400 hover:text-slate-600 text-xs transition-colors underline underline-offset-2"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      <Modal
        open={showResetModal}
        onClose={handleCloseResetModal}
        title="Recuperar contraseña"
        size="sm"
      >
        {resetSuccess ? (
          /* Confirmation state */
          <div className="py-2 flex flex-col items-center text-center gap-5">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
              <MailCheck size={26} className="text-[#6b7fd4]" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-neutral-700">Revisa tu bandeja</p>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Si tu correo está registrado en el sistema, recibirás un enlace en los
                próximos minutos para restablecer tu contraseña.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCloseResetModal}
              className="w-full rounded-lg bg-[#1e2336] hover:bg-[#252b42] text-white font-semibold py-2.5 text-sm transition"
            >
              Entendido
            </button>
          </div>
        ) : (
          /* Form state */
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-neutral-500 leading-relaxed">
              Ingresa tu correo electrónico y, si está registrado, te enviaremos un enlace
              para restablecer tu contraseña.
            </p>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">
                Correo electrónico
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 bg-white text-neutral-800 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#6b7fd4]/30 focus:border-[#6b7fd4]/50 text-sm transition placeholder-neutral-400"
                placeholder="tu@correo.com"
                disabled={resetLoading}
                required
                autoComplete="email"
              />
            </div>
            {resetError && (
              <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {resetError}
              </div>
            )}
            <button
              type="submit"
              disabled={resetLoading}
              className="w-full rounded-lg bg-[#6b7fd4] hover:bg-[#7a8ee3] text-white font-semibold py-2.5 text-sm transition disabled:opacity-60"
            >
              {resetLoading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
