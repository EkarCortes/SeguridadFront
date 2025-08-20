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
    loading,
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

  return (
    <div className={`${containerClass} rounded-lg overflow-hidden border-2 border-[#303036] relative ${className}`}>
      {streamUrl && (
        <>
          <iframe
            src={streamUrl}
            className="w-full h-full border-0 rounded-lg"
            allow="camera; microphone"
            sandbox="allow-same-origin allow-scripts allow-forms"
            title="Stream en vivo"
            referrerPolicy="no-referrer-when-downgrade"
          />
          
          {/* Overlay clickeable */}
          <div 
            className="absolute inset-0 bg-transparent cursor-pointer opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
            onClick={onClick}
          >
            <div className="text-white text-sm bg-black/70 px-3 py-2 rounded-lg pointer-events-none flex items-center gap-2">
              <span>📹</span>
              <span>Ampliar</span>
            </div>
          </div>
          
          {/* Botón de recarga en esquina */}
          <button
            className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              refetch();
            }}
            title="Recargar stream"
          >
            🔄
          </button>
        </>
      )}
    </div>
  );
};

export default CameraStream;