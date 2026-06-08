import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer style={{ background: '#020810', borderTop: '1px solid rgba(0,102,204,0.2)', padding: '56px 48px 28px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 48, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: 6, color: '#fff', fontWeight: 300, marginBottom: 14 }}>
              MICHELLE <span style={{ color: '#3B9EFF' }}>NAILS</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, letterSpacing: '0.3px' }}>
              Servicio de manicure y pedicure<br />
              premium a domicilio en Puebla.<br />
              Porque la belleza llega a ti.
            </p>
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: '3px', color: '#3B9EFF', textTransform: 'uppercase', marginBottom: 18 }}>Navegación</div>
            {[['Servicios','servicios'],['Galería','galeria'],['Testimonios','testimonios'],['Agendar cita','contacto']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                display: 'block', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10,
                fontFamily: "'Montserrat', sans-serif", textAlign: 'left',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
              >{label}</button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: '3px', color: '#3B9EFF', textTransform: 'uppercase', marginBottom: 18 }}>Contacto</div>
            <a href="https://wa.me/522221234567" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color='#fff'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.4)'}>
              <MessageCircle size={14} color="#0066CC" /> WhatsApp directo
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color='#fff'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.4)'}>
              <Instagram size={14} color="#0066CC" /> @michelle.nails
            </a>
            <div style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.5px', lineHeight: 1.7 }}>
              Lunes – Sábado<br />9:00 AM – 7:00 PM
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>
            © 2026 Michelle Nails · Puebla, México
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            {[MessageCircle, Instagram].map((Icon, i) => (
              <div key={i} style={{ width: 32, height: 32, border: '1px solid rgba(0,102,204,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon size={13} color="rgba(255,255,255,0.4)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
