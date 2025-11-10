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
      <label className="block text-neutral-100 text-sm mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="space-y-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onFileChange}
          className="w-full rounded bg-[#2d3346] text-white px-3 py-2  focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-800"
        />
        {helperText && (
          <p className="text-neutral-200 text-xs">{helperText}</p>
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