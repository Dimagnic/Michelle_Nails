import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (!isHomePage) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Inicio', id: 'hero' },
    { label: 'Servicios', id: 'servicios' },
    { label: 'Galería', id: 'galeria' },
    { label: 'Testimonios', id: 'testimonios' },
    { label: 'Contacto', id: 'contacto' }
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => scrollToSection('hero')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src="https://horizons-cdn.hostinger.com/2448214a-3cb0-469a-9b08-1f82454a803c/b5700194d93d06eb3396d3b3649fe904.png" 
              alt="Michelle Nails Logo" 
              className="h-12 w-12 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className={`text-2xl font-bold font-serif transition-colors duration-300 ${isScrolled || !isHomePage ? 'text-primary' : 'text-white'}`}>
              Michelle Nails
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${isScrolled || !isHomePage ? 'text-foreground' : 'text-white/90 hover:text-white'}`}
              >
                {link.label}
              </button>
            ))}
            
            <div className="flex items-center gap-4 pl-4 border-l border-border/30">
              {!isAuthenticated ? (
                <Link to="/admin/login" className={`text-xs font-medium flex items-center gap-1 transition-colors hover:text-primary ${isScrolled || !isHomePage ? 'text-muted-foreground' : 'text-white/70'}`}>
                  <LogIn size={14} /> Admin
                </Link>
              ) : (
                <>
                  <Link to="/admin" className={`text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary ${isScrolled || !isHomePage ? 'text-primary' : 'text-white'}`}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className={`text-sm font-medium flex items-center gap-1 transition-colors hover:text-destructive ${isScrolled || !isHomePage ? 'text-muted-foreground' : 'text-white/70'}`}>
                    <LogOut size={16} /> Salir
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden transition-colors ${isScrolled || !isHomePage ? 'text-primary' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border absolute w-full shadow-lg">
          <nav className="flex flex-col py-4 px-4 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left py-3 px-4 text-base font-medium text-foreground hover:bg-accent hover:text-primary rounded-lg transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
            
            <div className="my-2 border-t border-border"></div>
            
            {!isAuthenticated ? (
              <Link 
                to="/admin/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-3 px-4 text-base font-medium text-muted-foreground hover:bg-accent hover:text-primary rounded-lg"
              >
                <LogIn size={18} /> Acceso Admin
              </Link>
            ) : (
              <>
                <Link 
                  to="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-3 px-4 text-base font-medium text-primary hover:bg-accent rounded-lg"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 text-left py-3 px-4 text-base font-medium text-destructive hover:bg-red-50 rounded-lg w-full"
                >
                  <LogOut size={18} /> Cerrar Sesión
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;