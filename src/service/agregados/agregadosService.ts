import api from '../../config/apiconfig';
import apiPy from '../../config/apipython';
import type { PersonsResponse, PersonFormData, PersonUpdateData } from '../../types/agregados';

// Servicio para gestionar las operaciones relacionadas con personas, incluyendo obtención, registro, actualización y eliminación.

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

  updatePerson: async (cedula: string, updateData: PersonUpdateData): Promise<any> => {
    try {
      const formData = new FormData();
      if (updateData.nombre) {
        formData.append('nombre', updateData.nombre);
      }
      if (updateData.email) {
        formData.append('email', updateData.email);
      }
      if (updateData.telefono) {
        formData.append('telefono', updateData.telefono);
      }
      if (updateData.photos && updateData.photos.length > 0) {
        updateData.photos.forEach((foto) => {
          formData.append('fotos_nuevas', foto);
        });
      }

      const response = await api.put(`/persons/cedula/${encodeURIComponent(cedula)}`, formData, {
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
  },

  deletePerson: async (cedula: string): Promise<any> => {
    try {
      const response = await api.delete(`/persons/cedula/${encodeURIComponent(cedula)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


};