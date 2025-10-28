import { useState } from 'react';
import { resetPassword } from '../service/authService';

export default function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const changePassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resetPassword(token, newPassword);
      setSuccess('Contraseña cambiada correctamente.');
    } catch (err: any) {
      setError('No se pudo cambiar la contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, changePassword };
}