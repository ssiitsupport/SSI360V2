import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    path: '/'
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: UserGroupIcon,
    children: [
      {
        id: 'users',
        label: 'Users',
        icon: UsersIcon,
        path: '/users'
      },
      {
        id: 'roles',
        label: 'Roles',
        icon: UserGroupIcon,
        path: '/roles'
      },
      {
        id: 'tenants',
        label: 'Tenants',
        icon: BuildingOfficeIcon,
        path: '/tenants'
      }
    ]
  }
];

const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['administration']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleExpanded(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors ${
                level > 0 ? 'pl-8' : ''
              }`}
            >
              <div className="flex items-center">
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </div>
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
            {isExpanded && (
              <div className="ml-4">
                {item.children?.map(child => renderMenuItem(child, level + 1))}
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to={item.path || '#'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                level > 0 ? 'pl-8' : ''
              } ${
                isActive
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">SSI360V2</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </div>
  );
};

export default Sidebar;
