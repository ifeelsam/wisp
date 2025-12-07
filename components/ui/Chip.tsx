import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'selected' | 'health' | 'warning';
  onClick?: () => void;
  className?: string;
}

export function Chip({ children, variant = 'default', onClick, className = '' }: ChipProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-300',
    selected: 'bg-[#EE7C2B] bg-opacity-10 text-[#EE7C2B] border border-[#EE7C2B]',
    health: 'bg-[#799B4B] bg-opacity-10 text-[#799B4B] border border-[#799B4B]',
    warning: 'bg-orange-100 text-orange-700 border border-orange-300',
  };
  
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
}


