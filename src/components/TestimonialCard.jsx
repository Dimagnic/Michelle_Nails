import React from 'react';

const TestimonialCard = ({ testimonial }) => {
  const initials = testimonial.nombre.split(' ').map(w => w[0]).slice(0,2).join('');
  return (
    <div style={{ background: '#070d14', padding: '36px 28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {Array(testimonial.calificacion || 5).fill(0).map((_, i) => (
          <div key={i} style={{ width: 12, height: 12, background: '#0066CC', clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' }} />
        ))}
      </div>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: 'italic', lineHeight: 1.75, color: 'rgba(255,255,255,0.75)', marginBottom: 28, flex: 1 }}>
        "{testimonial.texto}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
        {testimonial.foto
          ? <img src={testimonial.foto} alt={testimonial.nombre} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
          : <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#0052A3,#3B9EFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, color: '#fff' }}>{initials}</div>
        }
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', letterSpacing: '0.5px' }}>{testimonial.nombre}</div>
          <div style={{ fontSize: 10, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: 2 }}>{testimonial.colonia}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
