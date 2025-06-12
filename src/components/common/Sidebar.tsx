
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
    default:
      return baseItems;
  }
};

const Sidebar: React.FC = () => {
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

  return (
    <div className="bg-white border-r border-gray-200 h-screen w-64 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <DPULogo size="md" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Procurement</h1>
            <p className="text-sm text-gray-500">System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-dpu-red rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors duration-200 ${
                isActive(item)
                  ? 'bg-dpu-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
