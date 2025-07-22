
import React from 'react';
import Sidebar from '@/components/common/Sidebar';
import { Toaster } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Sidebar />
      <main className="flex-1 overflow-auto ml-64">
        {children}
      </main>
      <Toaster richColors />
    </div>
  );
};

export default DashboardLayout;
