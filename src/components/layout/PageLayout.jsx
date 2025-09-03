import React from 'react';

const PageLayout = ({ 
  children, 
  title, 
  subtitle,
  headerActions,
  className = '',
  containerSize = 'full',
  padding = 'default'
}) => {
  const containerSizes = {
    sm: 'max-w-4xl mx-auto',
    md: 'max-w-6xl mx-auto',
    lg: 'max-w-7xl mx-auto',
    full: 'w-full',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`min-h-screen bg-slate-50 ${className}`}>
      <div className={`${containerSizes[containerSize]} ${paddings[padding]}`}>
        {(title || subtitle || headerActions) && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-lg text-slate-600">
                    {subtitle}
                  </p>
                )}
              </div>
              {headerActions && (
                <div className="flex items-center gap-3">
                  {headerActions}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;