import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm";

  const variants = {
    primary: "bg-theme-accent hover:opacity-90 text-white focus:ring-theme-accent shadow-lg shadow-theme-accent/20",
    secondary: "bg-theme-element hover:bg-theme-border text-theme-text border border-theme-border focus:ring-theme-text-dim",
    danger: "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-theme-element text-theme-text-dim hover:text-theme-text",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};