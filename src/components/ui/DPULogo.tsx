
import React from 'react';

interface DPULogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'circle' | 'full';
}

const DPULogo: React.FC<DPULogoProps> = ({ 
  className = '', 
  size = 'md', 
  variant = 'default' 
}) => {
  const sizeClasses = {
    sm: { text: 'text-sm', circle: 'w-8 h-8', font: 'text-xs' },
    md: { text: 'text-xl', circle: 'w-10 h-10', font: 'text-sm' },
    lg: { text: 'text-2xl', circle: 'w-12 h-12', font: 'text-base' },
    xl: { text: 'text-3xl', circle: 'w-16 h-16', font: 'text-lg' }
  };

  if (variant === 'circle') {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className={`${sizeClasses[size].circle} bg-dpu-red rounded-full flex items-center justify-center shadow-lg`}>
          <span className={`text-white font-bold font-inter ${sizeClasses[size].font}`}>
            DPU
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`${className} flex items-center space-x-3`}>
        <div className={`${sizeClasses[size].circle} bg-dpu-red rounded-full flex items-center justify-center shadow-lg p-4`}>
          <span className={`text-white font-bold font-inter ${sizeClasses[size].font}`}>
            DPU
          </span>
        </div>
        <div className="flex flex-col">
          <span className={`text-dpu-red font-bold font-inter ${sizeClasses[size].text}`}>
            Dr. D. Y. Patil University
          </span>
          <span className="text-gray-600 text-xs font-medium">
            Procurement System
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center`}>
      <span className={`text-dpu-red font-bold font-inter ${sizeClasses[size].text} tracking-tight`}>
        DPU
      </span>
    </div>
  );
};

export default DPULogo;
