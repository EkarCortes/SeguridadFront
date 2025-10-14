import api from '../../config/apiconfig';
import type { DailyVerificationsResponse, MonthlyStatsResponse, SummaryData, TimeSeriesData } from '../../types/homeTypes';



export const homeService = {
  getTimeSeries: async (): Promise<TimeSeriesData[]> => {
    try {
      const response = await api.get('/stats/summary');
      const summaryData: SummaryData = response.data;
      
      // Convert summary data to TimeSeriesData format
      const timeSeriesData: TimeSeriesData[] = [{
        fecha: summaryData.date_from, // or use date_to, or format as needed
        aceptados: Number(summaryData.aceptados),
        rechazados: Number(summaryData.rechazados),
        total: summaryData.total
      }];
      
      return timeSeriesData;
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
     
      const url = `/verifications/daily`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily verifications:', error);
      throw error;
    }
  }
 
}
