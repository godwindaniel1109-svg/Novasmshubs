import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="novaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#34ebd2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#349beb', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="url(#novaGradient)"
          opacity="0.1"
        />
        
        {/* Main N letter */}
        <path 
          d="M 25 25 L 25 75 L 35 75 L 35 40 L 65 75 L 75 75 L 75 25 L 65 25 L 65 60 L 35 25 Z" 
          fill="url(#novaGradient)"
        />
        
        {/* Decorative elements */}
        <circle 
          cx="25" 
          cy="25" 
          r="3" 
          fill="#34ebd2"
        />
        <circle 
          cx="75" 
          cy="75" 
          r="3" 
          fill="#349beb"
        />
      </svg>
    </div>
  );
};

export default Logo;
