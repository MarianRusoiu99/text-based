import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '../../stores/authStore';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Text Adventure Platform
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/stories" className="text-gray-600 hover:text-gray-900">
              Stories
            </Link>
            {isAuthenticated && (
              <Link to="/editor" className="text-gray-600 hover:text-gray-900">
                Editor
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <span className="text-gray-700">
                  Welcome, {user?.displayName || user?.username}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
