import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true }) => {
  if (!showText) {
    return <img src="/value-together-logo.png" alt="가치함께" className={`h-11 w-auto object-contain ${className}`} />;
  }
  return <img src="/value-together-logo.png" alt="사회적협동조합 가치함께" className={`h-11 sm:h-12 md:h-14 w-auto object-contain ${className}`} />;
};
