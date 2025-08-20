import api from '../../config/apiconfig';

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

export const agregadosService = {
  getPersons: async (): Promise<PersonsResponse> => {
    try {
      const response = await api.get('/persons');
      return response.data;
    } catch (error) {
      console.error('Error fetching persons data:', error);
      throw error;
    }
  },

  registerPerson: async (personData: PersonFormData): Promise<any> => {
    try {
      const formData = new FormData();
      
      // Agregar campos de texto
      formData.append('nombre', personData.nombre);
      formData.append('cedula', personData.cedula);
      formData.append('email', personData.email);
      formData.append('telefono', personData.telefono);
      
      // Agregar archivos de fotos
      personData.fotos.forEach((foto, index) => {
        formData.append('fotos', foto);
      });

      const response = await api.post('/persons/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error registering person:', error);
      throw error;
    }
  }
};