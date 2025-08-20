import { useState, useEffect, useRef } from 'react';
import { videoService } from '../service/home/videoService';

export const useVideoStream = () => {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isStreamActive, setIsStreamActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const checkStreamStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = videoService.getStreamUrl();
      setStreamUrl(url);
      
      const isActive = await videoService.checkStreamStatus(url);
      setIsStreamActive(isActive);
      
      if (!isActive) {
        setError('Stream no disponible');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el stream');
      setIsStreamActive(false);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsStreamActive(true);
    setError(null);
  };

  const handleImageError = () => {
    setIsStreamActive(false);
    setError('Error al cargar el stream');
  };

  useEffect(() => {
    checkStreamStatus();
    
    // Verificar el estado del stream cada 30 segundos
    const interval = setInterval(checkStreamStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    streamUrl,
    isStreamActive,
    loading,
    error,
    imgRef,
    handleImageLoad,
    handleImageError,
    refetch: checkStreamStatus
  };
};