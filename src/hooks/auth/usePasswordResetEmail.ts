import { useState } from 'react';
import { requestPasswordReset } from '../../service/authService';

// Hook que gestiona el envío de correos para restablecer la contraseña

export default function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendResetEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await requestPasswordReset(email);
      setSuccess('¡Correo enviado! Revisa tu bandeja de entrada.');
    } catch (err: any) {
      setError('No se pudo enviar el correo. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, sendResetEmail };
}