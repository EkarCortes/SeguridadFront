import api from '../../config/apiconfig';
import apiPy from '../../config/apipython';
import type { PersonsResponse, PersonFormData, PersonUpdateData } from '../../types/agregados';

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