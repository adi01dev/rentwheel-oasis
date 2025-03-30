
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AlignRight, X, User, LogOut, Car } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Car className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold text-secondary">RentWheel</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/cars" className="text-gray-700 hover:text-accent">Browse Cars</Link>
          {isAuthenticated ? (
            <>
              <Link 
                to={user?.role === 'host' ? '/host-dashboard' : '/user-dashboard'} 
                className="text-gray-700 hover:text-accent"
              >
                Dashboard
              </Link>
              {user?.role === 'host' && (
                <Link to="/add-car" className="text-gray-700 hover:text-accent">
                  Add a Car
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Hi, {user?.name}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <AlignRight className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 left-0 bg-white shadow-md py-4 px-6 animate-slide-from-right">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/cars" 
              className="text-gray-700 hover:text-accent py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Cars
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to={user?.role === 'host' ? '/host-dashboard' : '/user-dashboard'} 
                  className="text-gray-700 hover:text-accent py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user?.role === 'host' && (
                  <Link 
                    to="/add-car" 
                    className="text-gray-700 hover:text-accent py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Add a Car
                  </Link>
                )}
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Hi, {user?.name}</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Button variant="outline" onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}>
                  Login
                </Button>
                <Button onClick={() => {
                  navigate('/register');
                  setIsMenuOpen(false);
                }}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
