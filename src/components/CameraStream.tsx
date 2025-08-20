import { useVideoStream } from '../hooks/useVideoStream';

interface CameraStreamProps {
  className?: string;
  onClick?: () => void;
  size?: 'small' | 'large';
}

const CameraStream: React.FC<CameraStreamProps> = ({ 
  className = '', 
  onClick, 
  size = 'small' 
}) => {
  const { 
    streamUrl, 
    isStreamActive, 
    loading, 
    error, 
    imgRef, 
    handleImageLoad, 
    handleImageError,
    refetch 
  } = useVideoStream();

  const containerClass = size === 'large' 
    ? 'w-full h-full' 
    : 'w-32 h-24';

  if (loading) {
    return (
      <div className={`${containerClass} bg-[#18181b] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[#a3a3a3] ${className}`}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-neutral-600 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-neutral-400 text-xs">Conectando...</span>
        </div>
      </div>
    );
  }

  if (error || !isStreamActive) {
    return (
      <div className={`${containerClass} bg-[#18181b] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-[#a3a3a3] ${className}`}>
        <button
          className="flex flex-col items-center gap-1 text-center p-2 hover:bg-[#23232a] rounded transition-colors w-full h-full"
          onClick={onClick}
        >
          <span className="text-neutral-400 text-sm">Cámara en vivo</span>
          <span className="text-red-400 text-xs">Sin señal</span>
          <button
            className="text-blue-400 text-xs hover:text-blue-300 mt-1"
            onClick={(e) => {
              e.stopPropagation();
              refetch();
            }}
          >
            Reintentar
          </button>
        </button>
      </div>
    );
  }

  return (
    <div className={`${containerClass} rounded-lg overflow-hidden border-2 border-[#303036] ${className}`}>
      <button
        className="w-full h-full relative group"
        onClick={onClick}
      >
        <img
          ref={imgRef}
          src={streamUrl}
          alt="Stream en vivo"
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {/* Overlay para indicar que es clickeable */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="text-white opacity-0 group-hover:opacity-100 text-sm transition-opacity">
            📹 Ampliar
          </span>
        </div>
      </button>
    </div>
  );
};

export default CameraStream;