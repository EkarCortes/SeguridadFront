import { Toaster, toast } from 'react-hot-toast';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import type { JSX } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastStyleDef {
  border: string;
  accent: string;
  bg: string;
  titleColor: string;
  textColor: string;
  icon: JSX.Element;
}

const palette = {
  success: { accent: '#6FBF73', accentSoft: '#fff' },
  error: { accent: '#B85C5C', accentSoft: '#fff' },
  info: { accent: '#5C7FB8', accentSoft: '#fff' }
};

const toastStyles: Record<ToastType, ToastStyleDef> = {
  success: {
    border: palette.success.accent,
    accent: palette.success.accent,
    bg: '#fff',
    titleColor: '#388E3C',
    textColor: '#184137',
    icon: <CheckCircle size={20} className="text-[#6FBF73]" />
  },
  error: {
    border: palette.error.accent,
    accent: palette.error.accent,
    bg: '#fff',
    titleColor: '#B85C5C',
    textColor: '#542224',
    icon: <AlertTriangle size={20} className="text-[#B85C5C]" />
  },
  info: {
    border: palette.info.accent,
    accent: palette.info.accent,
    bg: '#fff',
    titleColor: '#5C7FB8',
    textColor: '#243754',
    icon: <Info size={20} className="text-[#5C7FB8]" />
  }
};

export function showCustomToast(
  title: string,
  subtitle?: string,
  type: ToastType = 'success'
) {
  const { accent, bg, titleColor, textColor, icon } = toastStyles[type];

  toast.custom((t) => (
    <div
      className={`
        group relative w-[340px] pl-4 pr-4 py-3 rounded-xl flex items-start gap-3
        backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${t.visible ? 'animate-slideIn' : 'animate-slideOut'}
      `}
      style={{
        background: bg,
        borderLeft: `5px solid ${accent}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="mt-3">{icon}</div>
      <div className="flex-1 min-w-0 pr-1">
        <h5
          className="text-sm font-semibold tracking-wide truncate"
          style={{ color: titleColor }}
        >
          {title}
        </h5>
        {subtitle && (
          <p className="mt-1 text-xs line-clamp-3" style={{ color: textColor }}>
            {subtitle}
          </p>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="ml-2 mt-1 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  ), { duration: 3500 });
}

export default function CustomToaster() {
  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateY(-120%) scale(0.95);
            }
            70% {
              transform: translateY(4%) scale(1.02);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes slideOut {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-120%) scale(0.95);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .animate-slideOut {
            animation: slideOut 0.35s ease forwards;
          }
        `}
      </style>

      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            zIndex: 99999
          }
        }}
      />
    </>
  );
}
