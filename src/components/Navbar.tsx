
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white/70 dark:bg-black/70 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold tracking-tight hover:text-primary/80 transition-colors"
            >
              University Portal
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                    location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Dashboard
                </Link>
                
                {user?.role === 'teacher' && (
                  <Link 
                    to="/test-create" 
                    className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                      location.pathname === '/test-create' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Create Tests
                  </Link>
                )}
                
                {user?.role === 'student' && (
                  <Link 
                    to="/test-take" 
                    className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                      location.pathname === '/test-take' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Take Tests
                  </Link>
                )}
                
                <Link 
                  to="/results" 
                  className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                    location.pathname === '/results' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Results
                </Link>
              </>
            )}
          </nav>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="container mx-auto px-4 py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                  location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                      location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Dashboard
                  </Link>
                  
                  {user?.role === 'teacher' && (
                    <Link 
                      to="/test-create" 
                      className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                        location.pathname === '/test-create' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Create Tests
                    </Link>
                  )}
                  
                  {user?.role === 'student' && (
                    <Link 
                      to="/test-take" 
                      className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                        location.pathname === '/test-take' ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      Take Tests
                    </Link>
                  )}
                  
                  <Link 
                    to="/results" 
                    className={`text-sm font-medium hover:text-primary/80 transition-colors ${
                      location.pathname === '/results' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    Results
                  </Link>
                </>
              )}
            </nav>
            
            {isAuthenticated ? (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm">
                    <Link to="/login">Log in</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
