import { useState } from "react";
import imageCompression from "browser-image-compression";

export function useFileUpload(maxFiles: number = 5) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  async function convertToPng(file: File): Promise<File> {
    const originalKB = (file.size / 1024).toFixed(1);
    console.log(`📷 [${file.name}] Original: ${originalKB} KB (${file.type})`);

    const converted = await imageCompression(file, {
      useWebWorker: true,
      fileType: "image/png",
      alwaysKeepResolution: true,
    });

    const convertedKB = (converted.size / 1024).toFixed(1);
    console.log(`  ✅ [${file.name}] → PNG: ${convertedKB} KB`);

    return new File([converted], file.name.replace(/\.[^.]+$/, ".png"), {
      type: "image/png",
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const slots = maxFiles - selectedFiles.length;
    if (files.length > slots) {
      alert(`Solo puedes añadir ${slots} foto${slots !== 1 ? "s" : ""} más`);
      return;
    }

    setIsCompressing(true);
    console.group(`🔄 Convirtiendo ${files.length} imagen${files.length !== 1 ? "es" : ""} a PNG`);

    try {
      const converted = await Promise.all(files.map(convertToPng));
      setSelectedFiles((prev) => [...prev, ...converted]);

      const newPreviews = await Promise.all(
        converted.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            })
        )
      );

      setPreviews((prev) => [...prev, ...newPreviews]);
    } finally {
      setIsCompressing(false);
      console.groupEnd();
    }
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function clearFiles() {
    setSelectedFiles([]);
    setPreviews([]);
  }

  return {
    selectedFiles,
    previews,
    isCompressing,
    handleFileChange,
    removeFile,
    clearFiles,
  };
}
