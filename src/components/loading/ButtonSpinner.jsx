import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ButtonSpinner({
  isLoading,
  loadingText = "PROCESSING...",
  children,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`relative transition-all flex items-center justify-center gap-2 ${className} ${
        isLoading ? 'cursor-wait opacity-80' : ''
      }`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
