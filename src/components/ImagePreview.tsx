
// Componente para previsualizar imágenes seleccionadas con opción de eliminar

interface ImagePreviewProps {
  previews: string[];
  onRemove: (index: number) => void;
  title?: string;
}

export default function ImagePreview({ previews, onRemove, title = "Foto" }: ImagePreviewProps) {
  if (previews.length === 0) return null;

  return (
    <div>
      <p className="text-neutral-400 text-sm mb-2">{title}s seleccionadas:</p>
      <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            <img
              src={preview}
              alt={`${title} ${index + 1}`}
              className="w-full h-20 object-cover rounded border-2 border-[#303036]"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs hover:bg-red-700 flex items-center justify-center"
              title="Eliminar foto"
            >
              ×
            </button>
            <div className="text-center text-xs text-neutral-400 mt-1">
              {title} {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}