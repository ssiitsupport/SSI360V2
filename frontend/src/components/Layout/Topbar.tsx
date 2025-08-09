import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UserCircleIcon, 
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTenantMenu, setShowTenantMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Tenant Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowTenantMenu(!showTenantMenu)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <span>{user?.tenantName || 'Default Tenant'}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            
            {showTenantMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  Current Tenant
                </div>
                <div className="px-4 py-2 text-sm text-gray-900">
                  {user?.tenantName || 'Default Tenant'}
                </div>
                <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
                  Tenant switching functionality can be added here
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <UserCircleIcon className="h-6 w-6" />
              <span>{user?.firstName} {user?.lastName}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  Signed in as
                </div>
                <div className="px-4 py-2 text-sm text-gray-900">
                  {user?.email}
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close menus */}
      {(showUserMenu || showTenantMenu) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowUserMenu(false);
            setShowTenantMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default Topbar;
