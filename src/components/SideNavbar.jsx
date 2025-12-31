import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideNavbar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/news', label: 'News Feed', icon: '📰' },
    { path: '/my-feedback', label: 'My Feedback', icon: '💬' },
    { path: '/add-news', label: 'Add News', icon: '➕' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="bg-navy-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-orange-400">Gov360</h2>
        <p className="text-sm text-navy-200">Citizen Portal</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-orange-600 text-white shadow-lg'
                : 'text-navy-100 hover:bg-navy-700 hover:text-white'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-navy-600">
        <div className="text-sm text-navy-300">
          <p>Stay informed, stay engaged</p>
          <p className="mt-2">Your voice matters in governance</p>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;