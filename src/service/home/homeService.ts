import api from '../../config/apiconfig';

export interface TimeSeriesData {
  fecha: string;
  aceptados: number;
  rechazados: number;
  total: number;
}

export interface MonthlyStats {
  año: number;
  mes: number;
  mes_nombre: string;
  total_verificaciones: number;
  autorizados: number;
  rechazados: number;
  tasa_autorizacion: number;
  personas_unicas: number;
  camaras_activas: number;
}

export interface MonthlyStatsResponse {
  total_meses: number;
  estadisticas_mensuales: MonthlyStats[];
}

export const homeService = {
  getTimeSeries: async (): Promise<TimeSeriesData[]> => {
    try {
      const response = await api.get('/stats/timeseries');
      return response.data;
    } catch (error) {
      console.error('Error fetching time series data:', error);
      throw error;
    }
  },

  getMonthlyStats: async (): Promise<MonthlyStatsResponse> => {
    try {
      const response = await api.get('/verifications/monthly');
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      throw error;
    }
  }
};