import React from 'react';

const ServiceCard = ({ service, index, onBook }) => {
  const num = String(index + 1).padStart(2, '0');
  return (
    <div
      style={{
        background: '#070d14',
        padding: '36px 28px',
        borderTop: index === 0 ? '2px solid #0066CC' : '2px solid transparent',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.3s', cursor: 'pointer', height: '100%',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderTopColor = '#0066CC'; e.currentTarget.style.background = '#0a1520'; }}
      onMouseLeave={e => { e.currentTarget.style.borderTopColor = index === 0 ? '#0066CC' : 'transparent'; e.currentTarget.style.background = '#070d14'; }}
    >
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: 'rgba(0,102,204,0.12)', lineHeight: 1, marginBottom: 14 }}>{num}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 400, color: '#fff', marginBottom: 10, letterSpacing: '0.3px' }}>{service.nombre}</div>
      <div style={{ fontSize: 11, lineHeight: 1.8, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>{service.descripcion}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: '#fff' }}>${service.precio}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>MXN</span>
        </div>
        <button
          onClick={() => onBook(service)}
          style={{
            background: 'none', border: '1px solid rgba(0,102,204,0.4)', color: '#3B9EFF',
            padding: '6px 16px', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0066CC'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#3B9EFF'; }}
        >Agendar</button>
      </div>
    </div>
  );
};

export default ServiceCard;
