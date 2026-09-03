import React from 'react';

export default function InputField({
  label,
  hint,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
  inputMode,
  pattern,
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* 2. LABEL: Sentence Case (avoiding ALL CAPS to improve readability) */}
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-bold text-slate-800"
          >
            {label} {required && <span className="text-[#E31B23]">*</span>}
          </label>
          
          {/* Optional Hint next to label if provided */}
          {hint && <span className="text-[11px] text-slate-500 font-medium">{hint}</span>}
        </div>
      )}

      {/* 1. INPUT FIELD & 5. ILLUSTRATION OR ICON */}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          inputMode={inputMode}
          pattern={pattern}
          /* 
            1. Readable text size (text-base or text-sm with 16px min) preventing mobile auto-zoom
            3. Placeholder text color notably lighter (text-slate-400) than default text (text-slate-900)
            4. Data format styling
          */
          className={`w-full py-3 text-sm sm:text-base font-semibold text-slate-900 rounded-xl transition-all ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-2 border-[#E31B23] bg-red-50/40 focus:border-[#E31B23] focus:ring-2 focus:ring-red-200'
              : 'border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#FFD400] focus:ring-2 focus:ring-[#FFD400]/40'
          } ${
            disabled ? 'opacity-60 bg-slate-100 cursor-not-allowed' : ''
          } placeholder:text-slate-400 placeholder:font-normal`}
          {...props}
        />
      </div>

      {/* ERROR FEEDBACK OR ELABORATE HINT */}
      {error ? (
        <p className="text-xs font-bold text-[#E31B23] flex items-center gap-1">
          <span>⚠️ {error}</span>
        </p>
      ) : hint && !label ? (
        /* 6. HINT: Elaborate on the title if a user struggles */
        <p className="text-xs text-slate-500 font-medium">💡 {hint}</p>
      ) : null}
    </div>
  );
}
