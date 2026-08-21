import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  glass = true,
  interactive = false,
  className = '', 
  ...props 
}) => {
  const baseClass = glass ? 'glass-card' : 'bg-white shadow-sm border border-slate-200 rounded-xl';
  const interactiveClass = interactive ? 'cursor-pointer hover:shadow-md transition-shadow' : '';

  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClass} ${interactiveClass} ${className} overflow-hidden`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClass} ${className} overflow-hidden`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
