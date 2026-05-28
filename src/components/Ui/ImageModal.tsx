import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  alt?: string;
}

export default function ImageModal({ isOpen, imageUrl, onClose, alt = "Vista ampliada" }: ImageModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative max-w-4xl max-h-full">
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full hover:bg-black/70 flex items-center justify-center transition backdrop-blur-sm text-lg"
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
}
