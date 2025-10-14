import api from '../../config/apiconfig';
import type { VerificationsResponse } from '../../types/ingresados';



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