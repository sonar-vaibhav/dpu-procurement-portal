import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES, ROLE_NAMES } from '@/constants/roles';
import DPULogo from '@/components/ui/DPULogo';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  User,
  Package,
  Truck,
  Wallet,
  Building,
  BarChart3,
  Mail,
  Clock,
  LogOut
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const getSidebarItems = (role: string): SidebarItem[] => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', path: '', icon: Home }
  ];

  switch (role) {
    case USER_ROLES.USER_DEPT:
      return [
        ...baseItems,
        { id: 'indents', label: 'Indents', path: '/indents', icon: FileText },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
    case USER_ROLES.HOD:
      return [
        ...baseItems,
        { id: 'indents', label: 'All Indents', path: '/indents', icon: FileText },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
      case USER_ROLES.PRINCIPAL:
      return [
        ...baseItems,
        { id: 'indents', label: 'All Indents', path: '/indents', icon: FileText },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
    case USER_ROLES.STORE:
      return [
        ...baseItems,
        { id: 'indents', label: 'Indents', path: '/indents', icon: FileText },
        { id: 'stock', label: 'Stock Management', path: '/stock', icon: Package },
        { id: 'track', label: 'Delivery Tracking', path: '/track', icon: Truck },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
    case USER_ROLES.REGISTRAR:
      return [
        ...baseItems,
        { id: 'indents', label: 'Budget & Approvals', path: '/indents', icon: Wallet },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
    case USER_ROLES.CPD:
      return [
        ...baseItems,
        { id: 'indents', label: 'All Indents', path: '/indents', icon: FileText },
        { id: 'vendors', label: 'Vendor Directory', path: '/vendors', icon: Building },
        { id: 'officers', label: 'Officer Management', path: '/officers', icon: User },
        { id: 'finalized_vendors', label: 'Finalized Vendors', path: '/finalized-vendors', icon: BarChart3 },
        { id: 'stock_checkup', label: 'Stock Checkup', path: '/stock-checkup', icon: Package },
        { id: 'track', label: 'Indent Tracker', path: '/track', icon: BarChart3 },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
    case USER_ROLES.OFFICER:
      return [
        ...baseItems,
        { id: 'indents', label: 'Assigned Indents', path: '/indents', icon: FileText },
        { id: 'vendors', label: 'Vendor List', path: '/vendors', icon: Building },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
    case USER_ROLES.MANAGEMENT:
      return [
        ...baseItems,
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
    case USER_ROLES.VENDOR:
      return [
        ...baseItems,
        { id: 'enquiries', label: 'New Enquiries', path: '/enquiries', icon: Mail },
        { id: 'quotes', label: 'Quote History', path: '/quotes', icon: Clock },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
    case USER_ROLES.ACCOUNT:
      return [
        ...baseItems,
        { id: 'indents', label: 'All Indents', path: '/indents', icon: FileText },
        { id: 'profile', label: 'Profile', path: '/profile', icon: User }
      ];
    default:
      return baseItems;
  }
};

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open = false, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const sidebarItems = getSidebarItems(user.role);
  const currentBasePath = user.role === USER_ROLES.USER_DEPT ? "/users" : `/${user.role.replace('_', '')}`;

  const handleNavigation = (item: SidebarItem) => {
    const fullPath = item.path === '' ? currentBasePath : `${currentBasePath}${item.path}`;
    navigate(fullPath);
  };

  const isActive = (item: SidebarItem) => {
    const fullPath = item.path === '' ? currentBasePath : `${currentBasePath}${item.path}`;
    return location.pathname === fullPath;
  };

  // Responsive sidebar classes
  const sidebarClass = `
    fixed top-0 left-0 h-screen w-64 flex flex-col bg-white border-r border-gray-200 shadow-lg z-50
    transition-transform duration-200
    md:translate-x-0 md:fixed md:static md:z-40
    ${open ? 'translate-x-0' : '-translate-x-full'}
    md:block
  `;

  return (
    <>
      {/* Sidebar */}
      <div className={sidebarClass} style={{ pointerEvents: open || window.innerWidth >= 768 ? 'auto' : 'none' }}>
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-2">
          <button onClick={onClose} aria-label="Close sidebar" className="bg-gray-100 rounded-full p-2 border border-gray-200">
            <svg className="w-6 h-6 text-dpu-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Header */}
        <div className="p-2 border-b border-gray-200 bg-gradient-to-r from-dpu-red-light to-white flex items-center justify-center">
          <img src="/og_dpu_logo.png" alt="DPU Logo" className="h-16 w-auto object-contain" />
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-dpu-red to-dpu-red-dark rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-600 font-medium">{ROLE_NAMES[user.role as keyof typeof ROLE_NAMES]}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                  isActive(item)
                    ? 'bg-gradient-to-r from-dpu-red to-dpu-red-dark text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-dpu-red hover:shadow-md'
                }`}
              >
                <IconComponent className={`w-5 h-5 transition-colors duration-200 ${
                  isActive(item) ? 'text-white' : 'text-gray-500 group-hover:text-dpu-red'
                }`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <Button
            onClick={logout}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
