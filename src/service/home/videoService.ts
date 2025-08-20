export interface VideoStreamConfig {
  streamUrl: string;
  isActive: boolean;
}

export const videoService = {
  getStreamUrl: (): string => {
    return 'https://9b7a2d9a79dc.ngrok-free.app/video';
  },

  checkStreamStatus: async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Error checking stream status:', error);
      return false;
    }
  }
};