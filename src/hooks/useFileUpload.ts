import { useState } from "react";

export function useFileUpload(maxFiles: number = 5) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    if (files.length > maxFiles) {
      alert(`Máximo ${maxFiles} fotos permitidas`);
      return;
    }

    setSelectedFiles(files);

    // Crear previews
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function removeFile(index: number) {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  }

  function clearFiles() {
    setSelectedFiles([]);
    setPreviews([]);
  }

  return {
    selectedFiles,
    previews,
    handleFileChange,
    removeFile,
    clearFiles
  };
}