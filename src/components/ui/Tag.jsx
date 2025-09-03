import React from 'react';

const Tag = ({ 
  children, 
  color = 'default', 
  size = 'default',
  icon,
  className = '',
  ...props 
}) => {
  const colorClasses = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  };

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  };

  const baseClasses = 'inline-flex items-center gap-1 font-medium rounded-full border transition-colors';
  const tagClasses = `${baseClasses} ${colorClasses[color]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={tagClasses} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Tag;