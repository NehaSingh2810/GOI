import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-navy-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-orange-400">
              GOI News Portal
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-orange-400 transition-colors">
              Dashboard
            </Link>
            <Link to="/news" className="text-white hover:text-orange-400 transition-colors">
              News Feed
            </Link>
            {user && (
              <>
                <Link to="/my-feedback" className="text-white hover:text-orange-400 transition-colors">
                  My Feedback
                </Link>
                <Link to="/profile" className="text-white hover:text-orange-400 transition-colors">
                  Profile
                </Link>
              </>
            )}
            <Link to="/about" className="text-white hover:text-orange-400 transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-navy-700 hover:bg-navy-800 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;