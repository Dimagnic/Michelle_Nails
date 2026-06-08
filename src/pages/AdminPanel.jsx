import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, ArrowLeft, Calendar, Scissors, MessageSquare, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

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

const AdminPanel = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [tab, setTab] = useState('citas');
  const [data, setData] = useState({ servicios:[], testimonios:[], galeria:[], citas:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [s,t,g,c] = await Promise.all([
        supabase.from('servicios').select('*'),
        supabase.from('testimonios').select('*'),
        supabase.from('galeria').select('*').order('orden'),
        supabase.from('citas').select('*').order('created_at', { ascending:false }),
      ]);
      setData({ servicios:s.data||[], testimonios:t.data||[], galeria:g.data||[], citas:c.data||[] });
    } catch { toast.error('Error al cargar datos'); }
    finally { setLoading(false); }
  };

  const del = async (table, id, key) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) { toast.error('Error al eliminar'); return; }
    setData(p => ({ ...p, [key]: p[key].filter(r => r.id !== id) }));
    toast.success('Eliminado');
  };

  const tabs = [
    { key:'citas',       label:'Citas',        icon: Calendar,     count: data.citas.length },
    { key:'servicios',   label:'Servicios',    icon: Scissors,     count: data.servicios.length },
    { key:'testimonios', label:'Testimonios',  icon: MessageSquare,count: data.testimonios.length },
    { key:'galeria',     label:'Galería',      icon: Image,        count: data.galeria.length },
  ];

  const s = {
    label: { fontSize:10, letterSpacing:'1.5px', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:4 },
    value: { fontSize:13, color:'rgba(255,255,255,0.85)' },
  };

  // Tarjeta mobile para una cita
  const CitaCard = ({ c }) => (
    <div style={{ background:'#0a1520', border:'1px solid rgba(0,102,204,0.15)', borderRadius:4, padding:'16px', marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div>
          <div style={{ fontSize:15, fontFamily:"'Cormorant Garamond',serif", color:'#fff', marginBottom:2 }}>{c.nombre}</div>
          <div style={{ fontSize:11, color:'#3B9EFF' }}>{c.servicio}</div>
        </div>
        <button onClick={() => del('citas',c.id,'citas')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,80,80,0.6)', padding:4 }}><Trash2 size={15}/></button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 16px' }}>
        <div><div style={s.label}>Teléfono</div><div style={s.value}>{c.telefono}</div></div>
        <div><div style={s.label}>Colonia</div><div style={s.value}>{c.colonia}</div></div>
        <div><div style={s.label}>Fecha</div><div style={s.value}>{new Date(c.fecha).toLocaleDateString('es-MX')}</div></div>
        <div><div style={s.label}>Hora</div><div style={s.value}>{c.hora}</div></div>
      </div>
      {c.mensaje && <div style={{ marginTop:10, fontSize:11, color:'rgba(255,255,255,0.4)', borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:8 }}>{c.mensaje}</div>}
    </div>
  );

  const ServicioCard = ({ s: sv }) => (
    <div style={{ background:'#0a1520', border:'1px solid rgba(0,102,204,0.15)', borderRadius:4, padding:'16px', marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:15, fontFamily:"'Cormorant Garamond',serif", color:'#fff', marginBottom:4 }}>{sv.nombre}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:8, lineHeight:1.5 }}>{sv.descripcion}</div>
          <div style={{ display:'flex', gap:16 }}>
            <span style={{ fontSize:13, color:'#3B9EFF', fontFamily:"'Cormorant Garamond',serif" }}>${sv.precio} MXN</span>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', border:'1px solid rgba(255,255,255,0.1)', padding:'2px 8px', borderRadius:2 }}>{sv.categoria}</span>
          </div>
        </div>
        <button onClick={() => del('servicios',sv.id,'servicios')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,80,80,0.6)', padding:4, flexShrink:0 }}><Trash2 size={15}/></button>
      </div>
    </div>
  );

  const TestimonioCard = ({ t }) => (
    <div style={{ background:'#0a1520', border:'1px solid rgba(0,102,204,0.15)', borderRadius:4, padding:'16px', marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div>
          <div style={{ fontSize:14, color:'#fff', fontWeight:500, marginBottom:2 }}>{t.nombre}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'1px' }}>{t.colonia} · {'★'.repeat(t.calificacion||5)}</div>
        </div>
        <button onClick={() => del('testimonios',t.id,'testimonios')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,80,80,0.6)', padding:4 }}><Trash2 size={15}/></button>
      </div>
      <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6, fontStyle:'italic' }}>"{t.texto}"</p>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:44, height:44, border:'2px solid #0066CC', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 14px' }} />
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:'2px' }}>Cargando...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#000', fontFamily:"'Montserrat',sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* HEADER */}
      <header style={{ background:'#070d14', borderBottom:'1px solid rgba(0,102,204,0.2)', position:'sticky', top:0, zIndex:50, padding:'0 clamp(12px,4vw,28px)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>

          {/* ← Volver */}
          <button onClick={() => navigate('/')} style={{
            display:'flex', alignItems:'center', gap:6,
            background:'rgba(0,102,204,0.12)', border:'1px solid rgba(0,102,204,0.4)',
            color:'#3B9EFF', padding: isMobile ? '7px 10px' : '7px 14px',
            fontSize:11, letterSpacing:'1px', textTransform:'uppercase',
            cursor:'pointer', fontFamily:"'Montserrat',sans-serif", borderRadius:2, flexShrink:0,
          }}>
            <ArrowLeft size={14}/>
            {!isMobile && 'Volver'}
          </button>

          {/* Logo */}
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(13px,3vw,17px)', letterSpacing:'clamp(2px,1vw,5px)', color:'#fff', fontWeight:300 }}>
            MICHELLE <span style={{ color:'#3B9EFF' }}>NAILS</span>
            <span style={{ fontSize:9, letterSpacing:'2px', color:'rgba(255,255,255,0.2)', marginLeft:10, fontFamily:"'Montserrat',sans-serif" }}>ADMIN</span>
          </span>

          {/* Cerrar sesión */}
          <button onClick={async () => { await logout(); navigate('/'); }} style={{
            display:'flex', alignItems:'center', gap:6,
            background:'rgba(200,30,30,0.1)', border:'1px solid rgba(200,30,30,0.35)',
            color:'rgba(255,100,100,0.85)', padding: isMobile ? '7px 10px' : '7px 14px',
            fontSize:11, letterSpacing:'1px', textTransform:'uppercase',
            cursor:'pointer', fontFamily:"'Montserrat',sans-serif", borderRadius:2, flexShrink:0,
          }}>
            <LogOut size={14}/>
            {!isMobile && 'Salir'}
          </button>
        </div>
      </header>

      {/* TABS */}
      <div style={{ background:'#070d14', borderBottom:'1px solid rgba(0,102,204,0.15)', overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        <div style={{ display:'flex', minWidth:'max-content', padding:'0 clamp(12px,4vw,28px)' }}>
          {tabs.map(({ key, label, icon: Icon, count }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              display:'flex', alignItems:'center', gap:6,
              padding: isMobile ? '14px 16px' : '16px 20px',
              background:'none', border:'none', cursor:'pointer',
              borderBottom: tab===key ? '2px solid #0066CC' : '2px solid transparent',
              color: tab===key ? '#fff' : 'rgba(255,255,255,0.4)',
              fontSize: isMobile ? 10 : 11, letterSpacing:'1.5px', textTransform:'uppercase',
              fontFamily:"'Montserrat',sans-serif", transition:'color 0.2s', whiteSpace:'nowrap',
            }}>
              <Icon size={13}/>
              {label}
              <span style={{ fontSize:9, background: tab===key ? '#0066CC' : 'rgba(255,255,255,0.08)', color: tab===key ? '#fff' : 'rgba(255,255,255,0.35)', padding:'1px 6px', borderRadius:8, marginLeft:2 }}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'clamp(16px,4vw,28px) clamp(12px,4vw,28px)' }}>

        {/* CITAS */}
        {tab==='citas' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:'#fff', fontWeight:300 }}>Citas</h2>
              <span style={{ fontSize:11, color:'#3B9EFF' }}>{data.citas.length} registros</span>
            </div>
            {data.citas.length === 0
              ? <p style={{ textAlign:'center', padding:40, fontSize:12, color:'rgba(255,255,255,0.2)', letterSpacing:'2px' }}>No hay citas registradas</p>
              : data.citas.map(c => <CitaCard key={c.id} c={c}/>)
            }
          </div>
        )}

        {/* SERVICIOS */}
        {tab==='servicios' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:'#fff', fontWeight:300 }}>Servicios</h2>
              <span style={{ fontSize:11, color:'#3B9EFF' }}>{data.servicios.length} registros</span>
            </div>
            {data.servicios.length === 0
              ? <p style={{ textAlign:'center', padding:40, fontSize:12, color:'rgba(255,255,255,0.2)', letterSpacing:'2px' }}>No hay servicios</p>
              : data.servicios.map(sv => <ServicioCard key={sv.id} s={sv}/>)
            }
          </div>
        )}

        {/* TESTIMONIOS */}
        {tab==='testimonios' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:'#fff', fontWeight:300 }}>Testimonios</h2>
              <span style={{ fontSize:11, color:'#3B9EFF' }}>{data.testimonios.length} registros</span>
            </div>
            {data.testimonios.length === 0
              ? <p style={{ textAlign:'center', padding:40, fontSize:12, color:'rgba(255,255,255,0.2)', letterSpacing:'2px' }}>No hay testimonios</p>
              : data.testimonios.map(t => <TestimonioCard key={t.id} t={t}/>)
            }
          </div>
        )}

        {/* GALERÍA */}
        {tab==='galeria' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:'#fff', fontWeight:300 }}>Galería</h2>
              <span style={{ fontSize:11, color:'#3B9EFF' }}>{data.galeria.length} imágenes</span>
            </div>
            {data.galeria.length === 0
              ? <p style={{ textAlign:'center', padding:40, fontSize:12, color:'rgba(255,255,255,0.2)', letterSpacing:'2px' }}>No hay imágenes</p>
              : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:4 }}>
                  {data.galeria.map(item => (
                    <div key={item.id} style={{ position:'relative', aspectRatio:'1', borderRadius:2, overflow:'hidden' }}
                      onMouseEnter={e => e.currentTarget.querySelector('.ov').style.opacity=1}
                      onMouseLeave={e => e.currentTarget.querySelector('.ov').style.opacity=0}>
                      <img src={item.foto_url} alt={item.categoria} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                      <div className="ov" style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', opacity:0, transition:'opacity 0.2s', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}>
                        <span style={{ fontSize:9, letterSpacing:'1.5px', color:'rgba(255,255,255,0.6)', textTransform:'uppercase' }}>{item.categoria}</span>
                        <button onClick={() => del('galeria',item.id,'galeria')} style={{ background:'rgba(200,30,30,0.8)', border:'none', color:'#fff', padding:'6px 12px', fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:"'Montserrat',sans-serif", borderRadius:2 }}>
                          <Trash2 size={11}/> Borrar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
