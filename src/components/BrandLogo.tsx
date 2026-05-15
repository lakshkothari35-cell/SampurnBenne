import React from 'react';

interface BrandLogoProps {
  className?: string;
  color?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = "w-10 h-10", 
  color = "#FFFFF0" 
}) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Interlocking infinity loops */}
      <path 
        d="M20,50 C20,30 45,30 50,50 C55,70 80,70 80,50 C80,30 55,30 50,50 C45,70 20,70 20,50 Z" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Diagonal Slash */}
      <path 
        d="M40,75 L60,25" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
      {/* Brand Dots */}
      <circle cx="50" cy="15" r="4.5" fill={color} />
      <circle cx="50" cy="85" r="4.5" fill={color} />
    </svg>
  );
};

export default BrandLogo;
