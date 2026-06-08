import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const ServiceCalculator = ({ services }) => {
  const [selected, setSelected] = useState([]);
  const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const total = services.filter(s => selected.includes(s.id)).reduce((sum, s) => sum + s.precio, 0);

  return (
    <div style={{ background: '#070d14', border: '1px solid rgba(0,102,204,0.2)', padding: '36px 32px', marginTop: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Calculator size={18} color="#3B9EFF" />
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#fff', letterSpacing: '1px' }}>Cotizador de servicios</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 28 }}>
        {services.map(s => (
          <label key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            padding: '10px 14px', border: `1px solid ${selected.includes(s.id) ? '#0066CC' : 'rgba(255,255,255,0.07)'}`,
            background: selected.includes(s.id) ? 'rgba(0,102,204,0.1)' : 'transparent',
            transition: 'all 0.2s',
          }}>
            <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)}
              style={{ accentColor: '#0066CC', width: 14, height: 14 }} />
            <span style={{ flex: 1, fontSize: 12, color: selected.includes(s.id) ? '#fff' : 'rgba(255,255,255,0.55)' }}>{s.nombre}</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#3B9EFF' }}>${s.precio}</span>
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(0,102,204,0.2)', paddingTop: 20 }}>
        <span style={{ fontSize: 11, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Total estimado</span>
        <div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: '#fff' }}>${total}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>MXN</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCalculator;
