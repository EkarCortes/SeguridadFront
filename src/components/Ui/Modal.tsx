import React from "react";

//Este componente Modal se utiliza para mostrar contenido en una ventana emergente centrada en la pantalla, con opciones para cerrar y personalizar el tamaño y título.

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  title?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  size = "md",
  title,
}) => {
  if (!open) return null;
  const sizeClass =
    size === "sm"
      ? "max-w-xs sm:max-w-sm"
      : size === "lg"
      ? "max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl"
      : "max-w-sm sm:max-w-md md:max-w-lg";
      
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60  backdrop-blur-sm  p-2 sm:p-4">
      <div
        className={`bg-[#2d3346] rounded-xl shadow-2xl w-full ${sizeClass} p-4 sm:p-6 relative
          max-h-[95vh] sm:max-h-[90vh] overflow-y-auto
        `}
      >
        <button
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-neutral-400 hover:text-white text-xl z-10"
          onClick={onClose}
        >
          ×
        </button>
        {title && (
          <h3 className="text-lg font-bold text-white mb-4 pr-8">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;