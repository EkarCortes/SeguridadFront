import { useState, useRef, useEffect } from 'react';

interface HoldToConfirmButtonProps {
  onConfirm: () => void;
  onCancel?: () => void;
  holdDuration?: number;
  label?: string;
  holdingLabel?: string;
  className?: string;
  progressClassName?: string;
}

export default function HoldToConfirmButton({
  onConfirm,
  onCancel,
  holdDuration = 2000,
  label = 'Mantener para eliminar',
  holdingLabel = 'Manteniendo...',
  className = 'relative px-4 py-2 rounded bg-red-700 text-white overflow-hidden',
  progressClassName = 'absolute left-0 top-0 h-full bg-red-900'
}: HoldToConfirmButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);

  const clearAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const updateProgress = () => {
    const elapsed = Date.now() - startTimeRef.current;
    const newProgress = Math.min((elapsed / holdDuration) * 100, 100);
    progressRef.current = newProgress;
    setProgress(newProgress);

    if (newProgress >= 100) {
      clearAnimation();
      setIsHolding(false);
      setProgress(0);
      progressRef.current = 0;
      onConfirm();
    } else {
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleStart = () => {
    setIsHolding(true);
    setProgress(0);
    progressRef.current = 0;
    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(updateProgress);
  };

  const handleEnd = () => {
    const currentProgress = progressRef.current;
    clearAnimation();
    setIsHolding(false);
    setProgress(0);
    progressRef.current = 0;

    if (onCancel && currentProgress > 0 && currentProgress < 100) {
      onCancel();
    }
  };

  useEffect(() => {
    return () => clearAnimation();
  }, []);

  return (
    <button
      className={className}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      type="button"
    >
      {/* Barra de progreso visible */}
      <div
        className={progressClassName}
        style={{ width: `${progress}%` }}
      />
      <span className="relative z-10">
        {isHolding ? holdingLabel : label}
      </span>
    </button>
  );
}
