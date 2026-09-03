import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'underline'
  size = 'md', // 'sm' | 'md' | 'lg'
  radius = 'xl', // 'xl' | '2xl' | 'full'
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  loadingText = 'PROCESSING...',
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {

  // Variant styling map
  const variants = {
    primary: 'bg-[#FFD400] hover:bg-[#e6be00] text-[#050505] font-black shadow-md hover:shadow-xl hover:shadow-[#FFD400]/30',
    secondary: 'bg-[#050505] hover:bg-[#1a1a1a] text-[#FFD400] font-black shadow-md hover:shadow-xl',
    outline: 'bg-white hover:bg-slate-50 text-[#050505] border-2 border-slate-200 hover:border-[#050505] font-bold shadow-xs',
    danger: 'bg-[#E31B23] hover:bg-[#cc141c] text-white font-black shadow-md hover:shadow-xl hover:shadow-red-500/20',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 font-bold',
    underline: 'bg-transparent text-[#050505] font-bold underline underline-offset-4 hover:text-[#E31B23] p-0'
  };

  // Size styling map
  const sizes = {
    sm: 'py-2 px-3 text-xs gap-1.5',
    md: 'py-3 px-5 text-xs sm:text-sm gap-2',
    lg: 'py-4 px-7 text-sm sm:text-base gap-2.5'
  };

  // Radius styling map
  const radii = {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };

  const isUnderline = variant === 'underline';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      /* 
        5. STATES: default, hover (scale-102), focus (ring-4 ring-[#FFD400]/40), active (scale-98), disabled (opacity-50 cursor-not-allowed)
      */
      className={`inline-flex items-center justify-center tracking-wider transition-all focus:outline-none focus:ring-4 focus:ring-[#FFD400]/40 ${
        !isUnderline ? `${sizes[size]} ${radii[radius]} ${variants[variant]}` : variants[variant]
      } ${
        fullWidth ? 'w-full' : ''
      } ${
        !disabled && !isLoading ? 'hover:scale-102 active:scale-98 cursor-pointer' : ''
      } ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
          
          {/* 4. COPY: Instructional text detailing what will happen when clicked */}
          <span>{children}</span>

          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </button>
  );
}
