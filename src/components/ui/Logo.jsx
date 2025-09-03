import React from 'react';
import logoImage from '../../assets/images/logo.jpg';

const KacchiExpressLogo = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    return (
        <div className={`${sizeClasses[size]} ${className} relative`}>
            <img
                src={logoImage}
                alt="Kacchi Express Logo"
                className="w-full h-full object-contain rounded-full"
            />
        </div>
    );
};

export default KacchiExpressLogo;