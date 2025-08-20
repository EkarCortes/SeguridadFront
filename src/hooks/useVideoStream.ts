import { useState, useEffect } from 'react';
import { videoService } from '../service/home/videoService';

export const useVideoStream = () => {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isStreamActive, setIsStreamActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const initializeStream = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = videoService.getStreamUrl();
      setStreamUrl(url);
      setIsStreamActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el stream');
      setIsStreamActive(false);
    } finally {
      setLoading(false);
    }
  };

  const refetchStream = () => {
    console.log('Recargando stream...');
    // Agregar timestamp para forzar recarga
    const baseUrl = 'https://067704a8ce6c.ngrok-free.app/video';
    const urlWithTimestamp = `${baseUrl}?ngrok-skip-browser-warning=true&t=${Date.now()}`;
    setStreamUrl(urlWithTimestamp);
  };

  useEffect(() => {
    initializeStream();
  }, []);

  return {
    streamUrl,
    isStreamActive,
    loading,
    error,
    refetch: refetchStream
  };
};