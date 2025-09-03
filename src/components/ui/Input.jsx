import React from 'react';

const Input = ({ 
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseClasses = 'transition-all duration-200 focus:outline-none';
  
  const variants = {
    default: 'border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white',
    filled: 'bg-slate-100 border border-transparent focus:ring-2 focus:ring-orange-500 focus:bg-white',
    outlined: 'border-2 border-slate-300 focus:border-orange-500 bg-white',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-3 text-sm rounded-lg',
    lg: 'px-5 py-4 text-base rounded-lg',
  };
  
  const inputClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon && iconPosition === 'left' ? 'pl-10' : ''} ${icon && iconPosition === 'right' ? 'pr-10' : ''} ${inputClasses}`}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;