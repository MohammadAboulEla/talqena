import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'gray';
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', onClick }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    gray: "bg-theme-element text-theme-text-dim border-theme-border",
  };

  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${colors[color]} 
        ${onClick ? 'cursor-pointer hover:bg-opacity-20 transition-colors' : ''}
      `}
    >
      {children}
    </span>
  );
};