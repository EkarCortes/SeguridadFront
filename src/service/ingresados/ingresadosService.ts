import api from '../../config/apiconfig';

export interface Verificacion {
  id: number;
  timestamp: string;
  image_source: string;
  faces_detected: number;
  authorized: boolean;
  person_label: string | null; 
}

export interface VerificationsResponse {
  total_personas: number;
  personas: Verificacion[];
}

export const ingresadosService = {
  getVerifications: async (): Promise<VerificationsResponse> => {
    try {
      const response = await api.get('/verifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching verifications data:', error);
      throw error;
    }
  }
};