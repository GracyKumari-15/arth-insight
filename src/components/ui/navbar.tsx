import { useState } from 'react';
import { Button } from './button';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import arthLogo from '@/assets/arth-logo.png';

interface NavbarProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  subscriptionMode: boolean;
  onSubscriptionToggle: () => void;
}

const Navbar = ({ onLoginClick, onSignupClick, subscriptionMode, onSubscriptionToggle }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigateTo = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={arthLogo} alt="Arth Logo" className="w-8 h-8 md:w-10 md:h-10" />
        <h1 className="text-2xl md:text-3xl font-cursive font-bold text-black">
          Arth
        </h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <Button variant="outline" onClick={onLoginClick} className="rounded-full">
          Login
        </Button>
        <Button onClick={onSignupClick} className="rounded-full bg-gradient-primary">
          Sign Up
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMenu}
          className="ml-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onLoginClick}>
          Login
        </Button>
        <Button size="sm" onClick={onSignupClick} className="bg-gradient-primary">
          Sign Up
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleMenu}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-6 mt-2 w-64 bg-card rounded-lg shadow-soft border p-4 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Menu</h3>
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigateTo('/about')}
            >
              About Us
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigateTo('/library')}
            >
              Library
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigateTo('/feedback')}
            >
              Feedback
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigateTo('/contact')}
            >
              Contact Us
            </Button>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Subscription Mode</span>
              <button
                onClick={onSubscriptionToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  subscriptionMode ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    subscriptionMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;