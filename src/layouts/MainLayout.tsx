import React from 'react';
import Navbar from '../components/Navbar';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 relative overflow-hidden">
      {/* Glowing background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-100/40 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-teal-100/40 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-50/40 blur-[100px] rounded-full pointer-events-none z-0"></div>
      
      <Navbar />
      
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
