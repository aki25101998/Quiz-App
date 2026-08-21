import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '',
  showLabel = false
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between mb-1">
        {showLabel && (
          <span className="text-xs font-medium text-slate-500">Tiến độ</span>
        )}
        {showLabel && (
          <span className="text-xs font-medium text-slate-500">{Math.round(clampedProgress)}%</span>
        )}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <motion.div 
          className="h-2.5 rounded-full bg-gradient-to-r from-teal-400 to-teal-500"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
