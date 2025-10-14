import api from '../../config/apiconfig';
import apiPy from '../../config/apipython';

export interface Persona {
  nombre: string;
  cedula: string | null;
  email: string | null;
  telefono: string | null;
  foto_url: string;
  encodings_count: number;
  total_intentos: number;
  autorizados: number;
  rechazados: number;
  tasa_autorizacion: number;
  ultimo_acceso: string | null;
  primer_acceso: string | null;
  fecha_registro: string;
}

export interface PersonsResponse {
  total_personas: number;
  personas: Persona[];
}

export interface PersonFormData {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  fotos: File[];
}

export interface PersonUpdateData {
  cedula?: string;
  email?: string;
  telefono?: string;
  fotos_nuevas?: File[];
}

export const agregadosService = {
  getPersons: async (): Promise<PersonsResponse> => {
    try {
      const response = await api.get('/persons');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  registerPerson: async (personData: PersonFormData): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('nombre', personData.nombre);
      formData.append('cedula', personData.cedula);
      formData.append('email', personData.email);
      formData.append('telefono', personData.telefono);
      personData.fotos.forEach((foto) => {
        formData.append('fotos', foto);
      });

      const response = await apiPy.post('/persons/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePerson: async (nombre: string, updateData: PersonUpdateData): Promise<any> => {
    try {
      const formData = new FormData();
      if (updateData.cedula) {
        formData.append('cedula', updateData.cedula);
      }
      if (updateData.email) {
        formData.append('email', updateData.email);
      }
      if (updateData.telefono) {
        formData.append('telefono', updateData.telefono);
      }
      if (updateData.fotos_nuevas && updateData.fotos_nuevas.length > 0) {
        updateData.fotos_nuevas.forEach((foto) => {
          formData.append('fotos_nuevas', foto);
        });
      }

      const response = await api.put(`/persons/${encodeURIComponent(nombre)}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
     
      }
      throw error;
    }
  }
};