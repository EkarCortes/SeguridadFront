import api from '../config/apiconfig';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  rol: string;
  person_id: number;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface MeResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async me(): Promise<MeResponse> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error durante logout:', error);
 
    }
  }
};

export const requestPasswordReset = async (email: string) => {
  const response = await api.post('/auth/requestPasswordReset', { email });
  return response.data;
};


export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post('/auth/resetPassword', { token, newPassword });
  return response.data;
};