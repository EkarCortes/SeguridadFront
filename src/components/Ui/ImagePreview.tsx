// Componente para previsualizar imágenes seleccionadas con opción de eliminar

import { useState } from 'react';
import ImageModal from './ImageModal';

interface ImagePreviewProps {
  previews: string[];
  onRemove: (index: number) => void;
  title?: string;
}

export default function ImagePreview({ previews, onRemove, title = "Foto" }: ImagePreviewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (previews.length === 0) return null;

  return (
    <div>
      <p className="text-neutral-400 text-sm mb-4">{title}s seleccionadas ({previews.length}):</p>
      

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-2 bg-neutral-900/50 rounded-lg border border-neutral-700">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <div 
              className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-neutral-600 hover:border-gray-200 transition-all duration-200"
              onClick={() => setSelectedImage(preview)}
            >
              <img
                src={preview}
                alt={`${title} ${index + 1}`}
                className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
            
       
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 flex items-center justify-center shadow-lg border-1 border-white transition-colors duration-200"
              title={`Eliminar ${title.toLowerCase()} ${index + 1}`}
            >
              ×
            </button>
            
            
            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>


      <ImageModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
        alt={`${title} ampliada`}
      />
    </div>
  );
}