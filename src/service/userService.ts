import api from '../config/apiconfig';

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface UserResponse {
  success: boolean;
  data: Array<{
    id: number;
    cedula: number;
    username: string;
    foto: string | null;
    nombre: string;
    email: string;
    rol: string;
    estado: string;
    estado_registro: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface PersonByCedula {
  person_id: number;
  nombre_completo: string;
  cedula: string;
  email: string;
}

interface RegisterUserData {
  username: string;
  password: string;
  person_id: number;
  rol: 'admin' | 'operador' | 'guarda';
}

export const userService = {
  getUsers: async (params?: PaginationParams): Promise<UserResponse> => {
    const { data } = await api.get<UserResponse>('/auth/users', { params });
    return data;
  },

  getPersonByCedula: async (cedula: string): Promise<PersonByCedula> => {
    const { data } = await api.get<PersonByCedula>(`/persons/cedula/${cedula}`);
    return data;
  },

  registerUser: async (userData: RegisterUserData): Promise<any> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  deleteUser: async (cedula: number): Promise<void> => {
    await api.delete(`/persons/cedula/${cedula}`);
  },

};