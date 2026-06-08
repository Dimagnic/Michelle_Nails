import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (!isHome) { window.location.href = `/#${id}`; return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Servicios', id: 'servicios' },
    { label: 'Galería', id: 'galeria' },
    { label: 'Testimonios', id: 'testimonios' },
    { label: 'Contacto', id: 'contacto' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: isScrolled ? 'rgba(0,0,0,0.95)' : 'transparent',
      borderBottom: isScrolled ? '1px solid rgba(0,102,204,0.25)' : 'none',
      backdropFilter: isScrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.3s',
      padding: '0 clamp(16px,5vw,48px)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <button onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(15px,4vw,20px)', letterSpacing: 'clamp(3px,1.5vw,6px)', color: '#fff', fontWeight: 300 }}>
            MICHELLE <span style={{ color: '#3B9EFF' }}>NAILS</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="hidden md:flex">
          {navLinks.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, letterSpacing: '2.5px', color: 'rgba(255,255,255,0.65)',
              textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif",
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#3B9EFF'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
            >{l.label}</button>
          ))}
          {isAuthenticated && (
            <>
              <Link to="/admin" style={{ fontSize: 11, letterSpacing: '2px', color: '#3B9EFF', textDecoration: 'none', textTransform: 'uppercase' }}>Panel</Link>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>Salir</button>
            </>
          )}
          <button className="mn-btn-primary" onClick={() => scrollTo('contacto')} style={{ padding: '10px 24px' }}>
            Agendar cita
          </button>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }} className="flex md:hidden">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: 'rgba(0,0,0,0.98)', borderTop: '1px solid rgba(0,102,204,0.2)', padding: '16px clamp(16px,5vw,48px) 24px' }}>
          {navLinks.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} style={{
              display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, letterSpacing: '2px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
              fontFamily: "'Montserrat', sans-serif", padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>{l.label}</button>
          ))}
          <button className="mn-btn-primary" onClick={() => scrollTo('contacto')} style={{ marginTop: 20, width: '100%' }}>
            Agendar cita
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
