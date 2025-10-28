import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useResetPassword from '../../hooks/useResetPassword';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormField from '../../components/FormField';

export default function ChangePassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const { loading, error, success, changePassword } = useResetPassword();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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

            <div className="relative">
              <FormField
                label="Nueva contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
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