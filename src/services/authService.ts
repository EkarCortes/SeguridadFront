import api from '../config/apiconfig';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    expiresIn: string;
    expiresAt: string;
    tokenType: string;
  };
}

interface User {
  id: number;
  username: string;
  rol: string;
  person_id: number;
  person_name: string;
  cedula: string;
  email: string;
  activo: boolean;
  fecha_creacion: string;
  ultimo_acceso: string;
}

interface MeResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log('🔵 Iniciando login con credenciales:', { username: credentials.username });
    const response = await api.post('/auth/login', credentials);
    console.log('📥 Respuesta de login:', response.data);
    
    if (response.data.success) {
      // Los tokens NO vienen en el body, sino en las cookies HTTP-only
      console.log('✅ Login exitoso - cookies inyectadas por el backend');
      console.log('👤 Usuario:', response.data.data.user.username);
      console.log('⏰ Expira en:', response.data.data.expiresIn);
      
      // Verificación de cookies (opcional, para debug)
      setTimeout(() => {
        const savedAccessToken = getAccessToken();
        const savedRefreshToken = getRefreshToken();
        console.log('✔️ Verificación de cookies:', {
          accessToken: savedAccessToken ? 'Presente ✅' : 'Ausente ❌',
          refreshToken: savedRefreshToken ? 'Presente ✅' : 'Ausente ❌'
        });
      }, 100);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    console.log('🔴 Iniciando logout...');
    console.log('📝 RefreshToken obtenido:', refreshToken ? refreshToken.substring(0, 30) + '...' : 'null');
    console.log('📋 Cookies actuales antes de logout:', document.cookie);
    
    if (refreshToken) {
      try {
        console.log('📤 Enviando petición POST a /auth/logout');
        const response = await api.post('/auth/logout', { refreshToken });
        console.log('✅ Respuesta del servidor:', response.data);
      } catch (error: any) {
        console.error('❌ Error al cerrar sesión:', error);
        console.error('📋 Detalles del error:', error.response?.data);
        // Continuar con la limpieza de cookies incluso si falla la petición
      }
    } else {
      console.log('⚠️ No hay refreshToken disponible, procediendo a limpiar cookies');
    }
    
    // Limpiar cookies de múltiples formas para asegurar eliminación
    console.log('🧹 Limpiando cookies de autenticación...');
    const cookiesToDelete = ['accessToken', 'refreshToken'];
    cookiesToDelete.forEach(cookieName => {
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
    
    console.log('📋 Cookies después de limpiar:', document.cookie);
    console.log('✅ Proceso de logout completado');
  },

  refresh: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    console.log('🔄 Intentando refrescar token...');
    
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await api.post('/auth/refresh', { refreshToken });
    console.log('✅ Token refrescado - nuevo accessToken inyectado por el backend');
    console.log('⏰ Nueva expiración:', response.data.data?.expiresIn);
    
    // El nuevo token se inyecta automáticamente en las cookies
  },

  me: async (): Promise<User> => {
    console.log('👤 Solicitando información del usuario actual...');
    const response = await api.get<MeResponse>('/auth/me');
    console.log('✅ Usuario obtenido:', response.data.data.user.username);
    return response.data.data.user;
  },
};

export function getAccessToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? match[1] : null;
}

export function getRefreshToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)refreshToken=([^;]*)/);
  return match ? match[1] : null;
}