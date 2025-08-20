import React from "react";

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
      ? "max-w-xs"
      : size === "lg"
      ? "max-w-2xl"
      : "max-w-lg";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className={`bg-[#23232a] rounded-xl shadow-2xl w-full ${sizeClass} p-6 relative`}
style={{
              background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
            }}
      >
        <button
          className="absolute top-3 right-3 text-neutral-400 hover:text-white text-xl"
          onClick={onClose}
        >
          ×
        </button>
        {title && (
          <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;