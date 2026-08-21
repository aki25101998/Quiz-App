import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const QuizLayout: React.FC<{ children: React.ReactNode; onBack?: () => void }> = ({ 
  children, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Subtle background for quiz to keep focus */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-50/50 to-transparent z-0"></div>
      
      {/* Simple Header */}
      <div className="absolute top-0 w-full px-6 py-4 flex items-center justify-between z-20">
        {onBack ? (
          <button onClick={onBack} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors flex items-center gap-2 text-slate-600 font-medium">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
        ) : (
          <Link to="/" className="p-2 hover:bg-slate-200/50 rounded-full transition-colors flex items-center gap-2 text-slate-600 font-medium">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Trang chủ</span>
          </Link>
        )}
        <div className="text-lg font-bold text-slate-800 opacity-50">
          Quiz<span className="text-orange-500">App</span>
        </div>
      </div>
      
      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
        {children}
      </main>
    </div>
  );
};
