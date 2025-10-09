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

export interface DetalleIntento {
  id: number;
  timestamp: string;
  cam_id: string;
  faces_detected: number;
  authorized: boolean;
  distance: number;
  threshold: number;
  image_source: string;
}

export interface ActividadPersona {
  nombre: string;
  cedula: string | null;
  email: string | null;
  telefono: string | null;
  foto_perfil_url: string;
  total_intentos: number;
  intentos_autorizados: number;
  intentos_rechazados: number;
  tasa_autorizacion: number;
  primer_intento: string;
  ultimo_intento: string;
  fotos_intentos: string[];
  detalle_intentos: DetalleIntento[];
}

export interface DailyVerificationsResponse {
  fecha: string;
  total_personas_activas: number;
  total_verificaciones: number;
  total_autorizadas: number;
  total_rechazadas: number;
  actividad_por_persona: ActividadPersona[];
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

  getMonthlyStats: async (year_from?: number, year_to?: number): Promise<MonthlyStatsResponse> => {
    try {
      let url = '/verifications/monthly';
      if (year_from && year_to) {
        url += `?year_from=${year_from}&year_to=${year_to}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      throw error;
    }
  },

  getDailyVerifications: async (): Promise<DailyVerificationsResponse> => {
    try {
      const hoy = "2025-09-19";
      const today = new Date().toLocaleString('sv-SE', { timeZone: 'America/Costa_Rica' }).slice(0, 10); 
      const url = `/verifications/daily?date=${hoy}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily verifications:', error);
      throw error;
    }
  }
 
}
