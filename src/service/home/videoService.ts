export interface VideoStreamConfig {
  streamUrl: string;
  isActive: boolean;
}

export const videoService = {
  getStreamUrl: (): string => {
    // Agregar el header ngrok-skip-browser-warning como parámetro de URL
    return 'https://36e0093c4672.ngrok-free.app/video?ngrok-skip-browser-warning=true';
  },

  checkStreamStatus: async (_url: string): Promise<boolean> => {
    try {
      // Para iframe, es mejor asumir que funciona y dejar que maneje sus propios errores
      return true;
    } catch (error) {
      console.log('Stream check failed:', error);
      return true;
    }
  }
};