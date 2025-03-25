
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'subtle';
  hoverEffect?: boolean;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  hoverEffect = true,
  delay = 0,
  ...props 
}) => {
  const variants = {
    default: 'bg-card shadow-md',
    glass: 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-sm',
    subtle: 'bg-muted/50 shadow-sm'
  };
  
  const hoverStyles = hoverEffect ? 'hover:shadow-lg hover:-translate-y-1' : '';
  
  return (
    <div 
      className={cn(
        'rounded-lg p-5 transition-all duration-300 ease-in-out animate-slide-up',
        variants[variant],
        hoverStyles,
        className
      )}
      style={{ animationDelay: `${delay * 0.1}s` }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
