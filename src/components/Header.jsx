import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard } from 'lucide-react';
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

  // Bloquear scroll cuando menú abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (!isHome) { window.location.href = `/#${id}`; return; }
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const navLinks = [
    { label: 'Inicio',       id: 'hero' },
    { label: 'Servicios',    id: 'servicios' },
    { label: 'Galería',      id: 'galeria' },
    { label: 'Testimonios',  id: 'testimonios' },
    { label: 'Contacto',     id: 'contacto' },
  ];

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: isScrolled || menuOpen ? 'rgba(0,0,0,0.97)' : 'transparent',
        borderBottom: isScrolled ? '1px solid rgba(0,102,204,0.25)' : 'none',
        backdropFilter: isScrolled ? 'blur(14px)' : 'none',
        transition: 'background 0.3s, border 0.3s',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 clamp(16px,5vw,48px)',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(15px,4vw,20px)', letterSpacing: 'clamp(3px,1.5vw,6px)', color: '#fff', fontWeight: 300 }}>
              MICHELLE <span style={{ color: '#3B9EFF' }}>NAILS</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="hidden md:flex">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 10, letterSpacing: '2.5px', color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#3B9EFF'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              >{l.label}</button>
            ))}

            {/* Admin link - desktop */}
            {isAuthenticated ? (
              <>
                <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, letterSpacing: '2px', color: '#3B9EFF', textDecoration: 'none', textTransform: 'uppercase' }}>
                  <LayoutDashboard size={13} /> Panel
                </Link>
                <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>Salir</button>
              </>
            ) : (
              <Link to="/admin/login" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', textTransform: 'uppercase' }}>
                <LayoutDashboard size={12} /> Admin
              </Link>
            )}

            <button className="mn-btn-primary" onClick={() => scrollTo('contacto')} style={{ padding: '9px 20px', fontSize: 10 }}>
              Agendar
            </button>
          </nav>

          {/* Mobile: Admin icon + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="flex md:hidden">
            <Link to={isAuthenticated ? '/admin' : '/admin/login'}
              style={{ color: isAuthenticated ? '#3B9EFF' : 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center' }}
              title="Panel admin">
              <LayoutDashboard size={18} />
            </Link>

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen(p => !p)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', width: 36, height: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 4 }}
            >
              <span style={{
                display: 'block', width: 22, height: 1.5,
                background: menuOpen ? '#3B9EFF' : '#fff',
                transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
                transition: 'all 0.3s',
              }} />
              <span style={{
                display: 'block', width: 22, height: 1.5,
                background: menuOpen ? '#3B9EFF' : '#fff',
                opacity: menuOpen ? 0 : 1,
                transition: 'all 0.3s',
              }} />
              <span style={{
                display: 'block', width: 22, height: 1.5,
                background: menuOpen ? '#3B9EFF' : '#fff',
                transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                transition: 'all 0.3s',
              }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99,
        background: 'rgba(0,0,0,0.98)',
        display: 'flex', flexDirection: 'column',
        padding: '100px 40px 48px',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: menuOpen ? 'all' : 'none',
      }} className="md:hidden">

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          {navLinks.map((l, i) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(28px,8vw,38px)',
                fontWeight: 300,
                color: '#fff',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                letterSpacing: 2,
                transform: menuOpen ? 'translateX(0)' : 'translateX(20px)',
                opacity: menuOpen ? 1 : 0,
                transition: `all 0.35s ${0.05 * i}s`,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#3B9EFF'}
              onMouseLeave={e => e.currentTarget.style.color = '#fff'}
            >
              {l.label}
            </button>
          ))}

          {/* Admin en menú mobile */}
          <Link
            to={isAuthenticated ? '/admin' : '/admin/login'}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase',
              color: isAuthenticated ? '#3B9EFF' : 'rgba(255,255,255,0.3)',
              textDecoration: 'none',
              padding: '18px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              transform: menuOpen ? 'translateX(0)' : 'translateX(20px)',
              opacity: menuOpen ? 1 : 0,
              transition: 'all 0.35s 0.28s',
            }}
          >
            <LayoutDashboard size={15} />
            {isAuthenticated ? 'Panel Admin' : 'Admin Login'}
          </Link>
        </nav>

        {/* CTA bottom */}
        <div style={{ opacity: menuOpen ? 1 : 0, transition: 'opacity 0.3s 0.3s' }}>
          <button className="mn-btn-primary" onClick={() => scrollTo('contacto')}
            style={{ width: '100%', padding: '16px', fontSize: 12, letterSpacing: '3px', marginBottom: 24 }}>
            Agendar mi cita
          </button>
          <p style={{ fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', textTransform: 'uppercase' }}>
            Michelle Nails · Puebla
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;
