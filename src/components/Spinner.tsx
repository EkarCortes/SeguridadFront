import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Cargando...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const innerSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner principal */}
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-[#ccc] border-t-[#262c3e] rounded-full animate-spin`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${innerSizeClasses[size]} border-2 border-transparent border-t-[#262c3e] rounded-full animate-spin animate-reverse`}></div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-[#262c3e] text-base font-medium">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;