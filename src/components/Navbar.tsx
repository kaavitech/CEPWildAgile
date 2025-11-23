import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import mahaForestLogo from '@/assets/mahaForestLogo.jpeg';
import { useStage } from '@/hooks/useStage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { checkRoute, config } = useStage();
  
  // Force re-render when config changes (for stage updates)
  useEffect(() => {
    // This will cause re-render when config changes
  }, [config]);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm shadow-soft border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={mahaForestLogo} alt="Maharashtra Forest Department" className="h-23 w-14 object-contain" />
            <span className="font-bold text-xl">CEP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {checkRoute('/') && (
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
            )}
            {checkRoute('/about') && (
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
            )}
            {checkRoute('/eco-centres') && (
              <Link to="/eco-centres" className="text-foreground hover:text-primary transition-colors">
                Eco Centres
              </Link>
            )}
            {checkRoute('/bookings') && (
              <Link to="/bookings" className="text-foreground hover:text-primary transition-colors">
                Bookings
              </Link>
            )}
            {checkRoute('/execution-plan') && (
              <Link to="/execution-plan" className="text-foreground hover:text-primary transition-colors">
                Execution Plan
              </Link>
            )}
            {checkRoute('/lecturers') && (
              <Link to="/lecturers" className="text-foreground hover:text-primary transition-colors">
                Guest Lecturers
              </Link>
            )}
            {checkRoute('/gallery') && (
              <Link to="/gallery" className="text-foreground hover:text-primary transition-colors">
                Gallery
              </Link>
            )}
            {checkRoute('/contact') && (
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            )}
            {checkRoute('/school/register') && (
              <Link to="/school/register">
                <Button variant="forest" size="lg">
                  Send Enquiry
                </Button>
              </Link>
            )}
            {checkRoute('/admin') && (
              <Link to="/admin">
                <Button variant="outline">
                  Admin
                </Button>
              </Link>
            )}
            {checkRoute('/admin?tab=bookings') && (
              <Link to="/admin?tab=bookings">
                <Button variant="outline" size="sm">
                  Eco Centre Bookings
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border animate-fade-in">
            {checkRoute('/') && (
              <Link
                to="/"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            )}
            {checkRoute('/about') && (
              <Link
                to="/about"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            )}
            {checkRoute('/eco-centres') && (
              <Link
                to="/eco-centres"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Eco Centres
              </Link>
            )}
            {checkRoute('/bookings') && (
              <Link
                to="/bookings"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Bookings
              </Link>
            )}
            {checkRoute('/execution-plan') && (
              <Link
                to="/execution-plan"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Execution Plan
              </Link>
            )}
            {checkRoute('/lecturers') && (
              <Link
                to="/lecturers"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Guest Lecturers
              </Link>
            )}
            {checkRoute('/gallery') && (
              <Link
                to="/gallery"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
            )}
            {checkRoute('/contact') && (
              <Link
                to="/contact"
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            )}
            {checkRoute('/school/register') && (
              <Link to="/school/register" onClick={() => setIsOpen(false)}>
                <Button variant="forest" className="w-full">
                  Register School
                </Button>
              </Link>
            )}
            {checkRoute('/admin') && (
              <Link to="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  Admin
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
