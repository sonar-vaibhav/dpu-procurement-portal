
import React, { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import { Toaster } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 relative flex">
      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 right-4 z-50 md:hidden bg-white rounded-full p-2 shadow border border-gray-200"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6 text-dpu-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {/* Main content */}
      <main className="flex-1 overflow-auto transition-all duration-200 ml-0 md:ml-64">
        {children}
      </main>
      <Toaster richColors />
    </div>
  );
};

export default DashboardLayout;
