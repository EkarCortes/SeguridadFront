import { useState } from "react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Login falso: simula autenticación
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#23232a] rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Inicio de sesión</h2>
        <p className="text-neutral-400 mb-2 text-sm text-center">
          Ingresa tus credenciales para acceder a tu cuenta.
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-neutral-300 mb-1" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-neutral-300 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="********"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-white text-neutral-900 font-semibold hover:bg-neutral-200 transition"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}