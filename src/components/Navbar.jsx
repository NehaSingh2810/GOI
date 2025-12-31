import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Logo />
          <span>Gov360</span>
        </Link>
        <div className="space-x-4">
          {!user && <Link to="/" className="hover:text-orange-300">Home</Link>}
          {!user && <Link to="/about" className="hover:text-orange-300">About</Link>}
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-orange-300">Dashboard</Link>
              <Link to="/news" className="hover:text-orange-300">News Feed</Link>
              <Link to="/add-news" className="hover:text-orange-300">Add News</Link>
              <Link to="/my-feedback" className="hover:text-orange-300">My Feedback</Link>
              <Link to="/profile" className="hover:text-orange-300">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-blue-100 text-blue-900 px-3 py-1 rounded hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-300">Login</Link>
              <Link to="/register" className="hover:text-orange-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;