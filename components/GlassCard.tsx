
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  const baseClasses = "bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg";
  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
