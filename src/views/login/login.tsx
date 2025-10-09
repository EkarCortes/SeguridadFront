import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/FormField";
import logo from "../../assets/FaceCore 3.png";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !pwd) {
      setError("Completa ambos campos.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
      navigate("/home");
    }, 900);
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
              label="CORREO"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="usuario@dominio.com"
            />
            <FormField
              label="CONTRASEÑA"
              name="password"
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              required
              disabled={loading}
              placeholder="********"
            />
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
          // Aquí puedes navegar o mostrar modal de recuperación
              }}
            >
               ¿Olvidaste tu contraseña?{" "}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}