import api from '../../config/apiconfig';



export interface Persona {
  nombre: string;
  foto_url: string;
  ultimo_acceso: string;
  primer_acceso: string;
}

export interface PersonsResponse {
  total_personas: number;
  personas: Persona[];
}

export const agregadosService = {
 

  getPersons: async (): Promise<PersonsResponse> => {
    try {
      const response = await api.get('/persons');
      return response.data;
    } catch (error) {
      console.error('Error fetching persons data:', error);
      throw error;
    }
  }
};