import ImagePreview from "./ImagePreview";

//Este componente gestiona la subida de archivos, mostrando una vista previa de las imágenes seleccionadas y permitiendo su eliminación antes de la subida final.

interface FileUploadProps {
  label: string;
  selectedFiles: File[];
  previews: string[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  required?: boolean;
  maxFiles?: number;
  helperText?: string;
}

export default function FileUpload({
  label,
  previews,
  onFileChange,
  onRemoveFile,
  required = false,
  helperText
}: FileUploadProps) {
  return (
    <div>
      <label className="block text-neutral-400 text-sm mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="space-y-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onFileChange}
          className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-700 file:text-white hover:file:bg-blue-600"
        />
        {helperText && (
          <p className="text-neutral-500 text-xs">{helperText}</p>
        )}

        <ImagePreview 
          previews={previews} 
          onRemove={onRemoveFile}
          title="Nueva foto"
        />
      </div>
    </div>
  );
}