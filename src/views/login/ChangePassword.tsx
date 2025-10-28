import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useResetPassword from '../../hooks/useResetPassword';;

export default function ChangePassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const { loading, error, success, changePassword } = useResetPassword();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !token) return;
    await changePassword(token, newPassword);
    if (success) {
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#e4e7f7]">
      <div className="w-full max-w-md rounded-2xl bg-[#262c3e]/90 p-8 flex flex-col gap-7">
        <h2 className="text-xl font-bold text-white text-center mb-4">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-white mb-1">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full rounded-md px-3 py-2 bg-[#23273a] text-white border border-[#3a405a] focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nueva contraseña"
              disabled={loading}
              required
            />
          </div>
          {error && (
            <div className="text-red-300 text-xs bg-red-900/30 border border-red-700/60 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-300 text-xs bg-green-900/30 border border-green-700/60 rounded-md px-3 py-2">
              {success}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 text-sm transition disabled:opacity-60"
          >
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}