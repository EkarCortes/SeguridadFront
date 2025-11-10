
// Este componente muestra una imagen en un modal ampliado cuando se hace clic en ella.

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  alt?: string;
}

export default function ImageModal({ isOpen, imageUrl, onClose, alt = "Vista ampliada" }: ImageModalProps) {
  if (!isOpen || !imageUrl) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="relative max-w-4xl max-h-full">
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 bg-black/50 text-white rounded-full hover:bg-black/70 flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
          title="Cerrar vista ampliada"
        >
          ×
        </button>
      </div>
    </div>
  );
}