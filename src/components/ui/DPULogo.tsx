
import React from 'react';

interface DPULogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const DPULogo: React.FC<DPULogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <div className="bg-dpu-red rounded-full p-2 w-full h-full flex items-center justify-center">
        <span className="text-white font-bold text-xs sm:text-sm md:text-lg font-inter">
          DPU
        </span>
      </div>
    </div>
  );
};

export default DPULogo;
