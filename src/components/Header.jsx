import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MOBILE_BP = 768;

const useMobile = () => {
  const [m, setM] = useState(typeof window !== 'undefined' ? window.innerWidth < MOBILE_BP : false);
  useEffect(() => {
    const h = () => setM(window.innerWidth < MOBILE_BP);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return m;
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const scrollTo = (id) => {
    setOpen(false);
    if (!isHome) { window.location.href = `/#${id}`; return; }
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  const links = [
    { label: 'Inicio',      id: 'hero' },
    { label: 'Servicios',   id: 'servicios' },
    { label: 'Galería',     id: 'galeria' },
    { label: 'Testimonios', id: 'testimonios' },
    { label: 'Contacto',    id: 'contacto' },
  ];

  const navBtn = {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 10, letterSpacing: '2.5px', color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif",
    transition: 'color 0.2s', padding: 0,
  };

  return (
    <>
      {/* ── HEADER BAR ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled || open ? 'rgba(0,0,0,0.97)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(0,102,204,0.25)' : 'none',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        transition: 'background 0.3s',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 clamp(16px,5vw,48px)',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(14px,3.5vw,20px)', letterSpacing: 'clamp(2px,1vw,6px)', color: '#fff', fontWeight: 300 }}>
              MICHELLE <span style={{ color: '#3B9EFF' }}>NAILS</span>
            </span>
          </button>

          {/* ── DESKTOP NAV — solo si NO es mobile ── */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {links.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)}
                  style={navBtn}
                  onMouseEnter={e => e.currentTarget.style.color = '#3B9EFF'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >{l.label}</button>
              ))}

              {isAuthenticated ? (
                <>
                  <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, letterSpacing: '2px', color: '#3B9EFF', textDecoration: 'none', textTransform: 'uppercase' }}>
                    <LayoutDashboard size={13} /> Panel
                  </Link>
                  <button onClick={logout} style={{ ...navBtn, color: 'rgba(255,255,255,0.3)' }}>Salir</button>
                </>
              ) : (
                <Link to="/admin/login" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', textTransform: 'uppercase' }}>
                  <LayoutDashboard size={12} /> Admin
                </Link>
              )}

              <button onClick={() => scrollTo('contacto')} style={{
                background: 'linear-gradient(135deg,#0052A3,#0066CC)', color: '#fff', border: 'none',
                padding: '9px 20px', fontSize: 10, letterSpacing: '2.5px', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: "'Montserrat', sans-serif",
              }}>Agendar</button>
            </nav>
          )}

          {/* ── MOBILE: Admin icon + Hamburger ── */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Link to={isAuthenticated ? '/admin' : '/admin/login'}
                style={{ color: isAuthenticated ? '#3B9EFF' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center' }}>
                <LayoutDashboard size={19} />
              </Link>

              {/* Hamburger */}
              <button onClick={() => setOpen(p => !p)} aria-label="Menú"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ display: 'block', width: 22, height: 2, background: open ? '#3B9EFF' : '#fff', transform: open ? 'translateY(7px) rotate(45deg)' : 'none', transition: 'all 0.3s', borderRadius: 1 }} />
                <span style={{ display: 'block', width: 22, height: 2, background: '#fff', opacity: open ? 0 : 1, transition: 'opacity 0.2s', borderRadius: 1 }} />
                <span style={{ display: 'block', width: 22, height: 2, background: open ? '#3B9EFF' : '#fff', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none', transition: 'all 0.3s', borderRadius: 1 }} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── MOBILE MENU OVERLAY — solo si mobile ── */}
      {isMobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 199,
          background: 'rgba(0,0,0,0.98)',
          display: 'flex', flexDirection: 'column',
          padding: '96px clamp(24px,8vw,48px) 40px',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <nav style={{ flex: 1 }}>
            {links.map((l, i) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(30px,9vw,42px)', fontWeight: 300,
                color: '#fff', padding: '13px 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                letterSpacing: 1,
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0)' : 'translateX(16px)',
                transition: `opacity 0.3s ${i * 0.05}s, transform 0.3s ${i * 0.05}s`,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#3B9EFF'}
              onMouseLeave={e => e.currentTarget.style.color = '#fff'}
              >{l.label}</button>
            ))}

            <Link to={isAuthenticated ? '/admin' : '/admin/login'}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                color: isAuthenticated ? '#3B9EFF' : 'rgba(255,255,255,0.3)',
                textDecoration: 'none', padding: '16px 0',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                opacity: open ? 1 : 0,
                transition: 'opacity 0.3s 0.27s',
              }}>
              <LayoutDashboard size={14} />
              {isAuthenticated ? 'Panel Admin' : 'Admin Login'}
            </Link>
          </nav>

          <button onClick={() => scrollTo('contacto')} style={{
            width: '100%', background: 'linear-gradient(135deg,#0052A3,#0066CC)',
            color: '#fff', border: 'none', padding: '16px',
            fontSize: 12, letterSpacing: '3px', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'Montserrat', sans-serif",
            opacity: open ? 1 : 0, transition: 'opacity 0.3s 0.32s', marginTop: 24,
          }}>Agendar mi cita</button>
        </div>
      )}
    </>
  );
};

export default Header;
