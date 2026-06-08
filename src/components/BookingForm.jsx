import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '522221234567';

const BookingForm = ({ services }) => {
  const [form, setForm] = useState({ nombre:'', telefono:'', colonia:'', servicio:'', fecha:'', hora:'', mensaje:'' });
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const colonias = ['Centro Histórico','Analco','La Paz','Xonaca','Hueyotlipan','San Manuel','Azcarate','Los Ángeles','Jardines de San Manuel','Angelópolis','Otra colonia'];
  const horarios = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, telefono, colonia, servicio, fecha, hora } = form;
    if (!nombre || !telefono || !colonia || !servicio || !fecha || !hora) {
      toast.error('Por favor completa todos los campos requeridos'); return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('citas').insert([form]);
      if (error) throw error;
      const msg = [`*Nueva Cita - Michelle Nails*`, ``, `👤 *Nombre:* ${nombre}`, `📱 *Teléfono:* ${telefono}`, `📍 *Colonia:* ${colonia}`, `💅 *Servicio:* ${servicio}`, `📅 *Fecha:* ${fecha}`, `⏰ *Hora:* ${hora}`, form.mensaje ? `💬 *Mensaje:* ${form.mensaje}` : ''].filter(Boolean).join('\n');
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
      toast.success('¡Cita registrada! Abriendo WhatsApp...');
      setForm({ nombre:'', telefono:'', colonia:'', servicio:'', fecha:'', hora:'', mensaje:'' });
    } catch (err) {
      toast.error('Error al registrar. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle = { display: 'block', fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 8 };
  const inputStyle = { width: '100%', background: 'rgba(0,102,204,0.06)', border: '1px solid rgba(0,102,204,0.2)', padding: '12px 14px', color: '#fff', fontFamily: "'Montserrat', sans-serif", fontSize: 13, outline: 'none' };
  const selectStyle = { ...inputStyle, appearance: 'none', cursor: 'pointer' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start', maxWidth: 960, margin: '0 auto' }}>
      {/* Info */}
      <div>
        <div style={{ fontSize: 10, letterSpacing: '4px', color: '#3B9EFF', textTransform: 'uppercase', marginBottom: 14 }}>Reservaciones</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
          Agenda tu<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>cita ahora</em>
        </h2>
        <p style={{ fontSize: 12, lineHeight: 1.9, color: 'rgba(255,255,255,0.45)', marginBottom: 36 }}>
          Completa el formulario y te confirmamos en menos de 2 horas por WhatsApp. Sin complicaciones.
        </p>
        {[
          { icon: Clock, title: 'Horario flexible', desc: 'Lunes a sábado de 9 AM a 7 PM' },
          { icon: MapPin, title: 'Toda Puebla', desc: 'Llegamos a tu colonia sin costo extra' },
          { icon: CheckCircle2, title: 'Confirmación inmediata', desc: 'Respuesta garantizada en 2 horas' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, border: '1px solid rgba(0,102,204,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={14} color="#3B9EFF" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div style={{ background: '#070d14', border: '1px solid rgba(0,102,204,0.2)', padding: 36 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div><label style={labelStyle}>Nombre *</label><input style={inputStyle} placeholder="Tu nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} required /></div>
            <div><label style={labelStyle}>Teléfono *</label><input style={inputStyle} placeholder="222 000 0000" value={form.telefono} onChange={e => set('telefono', e.target.value)} required /></div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Servicio *</label>
            <select style={selectStyle} value={form.servicio} onChange={e => set('servicio', e.target.value)} required>
              <option value="" style={{ background: '#070d14' }}>Selecciona un servicio</option>
              {services.map(s => <option key={s.id} value={s.nombre} style={{ background: '#070d14' }}>{s.nombre} — ${s.precio}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Fecha *</label>
              <input style={inputStyle} type="date" min={new Date().toISOString().split('T')[0]} value={form.fecha} onChange={e => set('fecha', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Hora *</label>
              <select style={selectStyle} value={form.hora} onChange={e => set('hora', e.target.value)} required>
                <option value="" style={{ background: '#070d14' }}>Selecciona horario</option>
                {horarios.map(h => <option key={h} value={h} style={{ background: '#070d14' }}>{h}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Colonia *</label>
            <select style={selectStyle} value={form.colonia} onChange={e => set('colonia', e.target.value)} required>
              <option value="" style={{ background: '#070d14' }}>Tu colonia en Puebla</option>
              {colonias.map(c => <option key={c} value={c} style={{ background: '#070d14' }}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Notas adicionales</label>
            <textarea style={{ ...inputStyle, resize: 'none' }} rows={3} placeholder="Diseño especial, alergias, instrucciones..." value={form.mensaje} onChange={e => set('mensaje', e.target.value)} />
          </div>

          <button type="submit" disabled={submitting} style={{
            width: '100%', background: 'linear-gradient(135deg,#0052A3,#0066CC)', color: '#fff', border: 'none',
            padding: 16, fontSize: 11, letterSpacing: '3px', textTransform: 'uppercase',
            cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Montserrat', sans-serif",
            opacity: submitting ? 0.7 : 1, transition: 'all 0.2s',
          }}>
            {submitting ? 'Registrando...' : 'Confirmar por WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
