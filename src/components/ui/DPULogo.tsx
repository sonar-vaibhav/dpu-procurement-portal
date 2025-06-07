
import React from 'react';

interface DPULogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const DPULogo: React.FC<DPULogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`${className} flex items-center`}>
      <span className={`text-dpu-red font-bold font-inter ${sizeClasses[size]}`}>
        DPU
      </span>
    </div>
  );
};

export default DPULogo;
