import React, { useState, useRef, useEffect } from 'react';
import { MdMoreVert } from 'react-icons/md';

const Dropdown = ({ 
  trigger, 
  children, 
  placement = 'bottom-end',
  className = '',
  overlayClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 ${placementClasses[placement]} ${overlayClassName}`}
        >
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[160px] fade-in">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ 
  children, 
  onClick, 
  icon,
  danger = false,
  disabled = false,
  className = '' 
}) => {
  const baseClasses = 'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors';
  const stateClasses = danger 
    ? 'text-red-600 hover:bg-red-50' 
    : 'text-slate-700 hover:bg-slate-50';
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  return (
    <div
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  );
};

Dropdown.Item = DropdownItem;

export default Dropdown;