import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '',
  padding = 'default',
  hover = false,
  ...props 
}) => {
  const baseClasses = 'transition-all duration-200';
  
  const variants = {
    default: 'bg-white rounded-xl shadow-md border border-slate-200',
    elevated: 'bg-white rounded-xl shadow-lg border border-slate-200',
    outlined: 'bg-white rounded-xl border-2 border-slate-300',
    glass: 'bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200',
    gradient: 'bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };
  
  const hoverEffect = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  
  const cardClasses = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverEffect} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;