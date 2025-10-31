import { useState, useEffect } from 'react';
import { authService, type User, type AuthResponse } from '../service/authService';
import { setInitialLoadComplete } from '../config/apiconfig';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export default function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const saveAuthData = (authData: AuthResponse['data']) => {
    localStorage.setItem('authMe', JSON.stringify(authData));
    setUser(authData.user);
  };

  const clearAuthData = () => {
    localStorage.removeItem('authMe');
    setUser(null);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      if (response.success) {
        saveAuthData(response.data);
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const logout = async () => {
    try {

      await authService.logout();
   
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      
      clearAuthData();
    }
  };

  const checkAuth = async () => {
    try {
      // Verificar si hay datos en localStorage
      const storedAuth = localStorage.getItem('authMe');
      if (!storedAuth) {
        setLoading(false);
        setInitialLoadComplete();
        return;
      }

      // Verificar sesión con el servidor (las cookies se envían automáticamente)
      const response = await authService.me();
      if (response.success) {
        saveAuthData(response.data);
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      clearAuthData();
    } finally {
      setLoading(false);
      setInitialLoadComplete();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    login,
    logout
  };
}