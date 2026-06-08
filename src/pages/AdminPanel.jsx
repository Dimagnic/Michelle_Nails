import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
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

  const cell = { fontSize:12, color:'rgba(255,255,255,0.75)', padding:'10px 14px' };
  const head = { fontSize:10, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', padding:'10px 14px' };

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, border:'2px solid #0066CC', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', letterSpacing:'2px' }}>Cargando panel...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#000', fontFamily:"'Montserrat', sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <header style={{ background:'#070d14', borderBottom:'1px solid rgba(0,102,204,0.2)', position:'sticky', top:0, zIndex:10, padding:'0 clamp(16px,4vw,32px)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>

          {/* Izquierda: volver + logo */}
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button onClick={() => navigate('/')} style={{
              display:'flex', alignItems:'center', gap:7,
              background:'rgba(0,102,204,0.12)', border:'1px solid rgba(0,102,204,0.35)',
              color:'#3B9EFF', padding:'8px 14px', fontSize:11, letterSpacing:'1.5px',
              textTransform:'uppercase', cursor:'pointer', fontFamily:"'Montserrat', sans-serif",
              transition:'all 0.2s', borderRadius:2, flexShrink:0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(0,102,204,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(0,102,204,0.12)'; }}>
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Volver al sitio</span>
            </button>

            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'clamp(14px,3vw,18px)', letterSpacing:'clamp(2px,1vw,5px)', color:'#fff', fontWeight:300 }}>
              MICHELLE <span style={{ color:'#3B9EFF' }}>NAILS</span>
              <span style={{ fontSize:9, letterSpacing:'2px', color:'rgba(255,255,255,0.25)', marginLeft:12, fontFamily:"'Montserrat', sans-serif", textTransform:'uppercase' }}>Admin</span>
            </span>
          </div>

          {/* Derecha: email + cerrar sesión */}
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', display:'none' }} className="sm:inline-block">{currentUser?.email}</span>
            <button onClick={async () => { await logout(); navigate('/'); }} style={{
              display:'flex', alignItems:'center', gap:6,
              background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.3)',
              color:'rgba(255,100,100,0.8)', padding:'8px 14px', fontSize:11,
              letterSpacing:'1.5px', textTransform:'uppercase',
              cursor:'pointer', fontFamily:"'Montserrat', sans-serif",
              transition:'all 0.2s', borderRadius:2,
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(220,38,38,0.25)'; e.currentTarget.style.color='#ff6b6b'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(220,38,38,0.1)'; e.currentTarget.style.color='rgba(255,100,100,0.8)'; }}>
              <LogOut size={13} />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px' }}>
        <Tabs defaultValue="citas">
          <TabsList style={{ background:'#070d14', border:'1px solid rgba(0,102,204,0.2)', borderRadius:0, padding:4, marginBottom:24 }}>
            {[['citas','Citas'],['servicios','Servicios'],['testimonios','Testimonios'],['galeria','Galería']].map(([v,l]) => (
              <TabsTrigger key={v} value={v} style={{ fontFamily:"'Montserrat', sans-serif", fontSize:11, letterSpacing:'1.5px', textTransform:'uppercase', borderRadius:0 }}>{l}</TabsTrigger>
            ))}
          </TabsList>

          {/* CITAS */}
          <TabsContent value="citas">
            <div style={{ background:'#070d14', border:'1px solid rgba(0,102,204,0.15)' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:20, color:'#fff' }}>Citas</span>
                <span style={{ fontSize:11, color:'#3B9EFF', letterSpacing:'1px' }}>{data.citas.length} registros</span>
              </div>
              <div style={{ overflowX:'auto' }}>
                <Table>
                  <TableHeader><TableRow style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    {['Nombre','Teléfono','Colonia','Servicio','Fecha','Hora',''].map(h => <TableHead key={h} style={head}>{h}</TableHead>)}
                  </TableRow></TableHeader>
                  <TableBody>
                    {data.citas.map(c => (
                      <TableRow key={c.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <TableCell style={cell}>{c.nombre}</TableCell>
                        <TableCell style={cell}>{c.telefono}</TableCell>
                        <TableCell style={cell}>{c.colonia}</TableCell>
                        <TableCell style={cell}>{c.servicio}</TableCell>
                        <TableCell style={cell}>{new Date(c.fecha).toLocaleDateString('es-MX')}</TableCell>
                        <TableCell style={cell}>{c.hora}</TableCell>
                        <TableCell style={cell}>
                          <button onClick={() => del('citas', c.id, 'citas')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,60,60,0.6)', padding:4 }}><Trash2 size={14} /></button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!data.citas.length && <p style={{ textAlign:'center', padding:40, fontSize:12, color:'rgba(255,255,255,0.25)', letterSpacing:'2px' }}>No hay citas registradas</p>}
              </div>
            </div>
          </TabsContent>

          {/* SERVICIOS */}
          <TabsContent value="servicios">
            <div style={{ background:'#070d14', border:'1px solid rgba(0,102,204,0.15)' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:20, color:'#fff' }}>Servicios</span>
              </div>
              <div style={{ overflowX:'auto' }}>
                <Table>
                  <TableHeader><TableRow style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    {['Nombre','Descripción','Precio','Categoría',''].map(h => <TableHead key={h} style={head}>{h}</TableHead>)}
                  </TableRow></TableHeader>
                  <TableBody>
                    {data.servicios.map(s => (
                      <TableRow key={s.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <TableCell style={cell}>{s.nombre}</TableCell>
                        <TableCell style={{ ...cell, maxWidth:240 }}><span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.descripcion}</span></TableCell>
                        <TableCell style={{ ...cell, color:'#3B9EFF', fontFamily:"'Cormorant Garamond', serif", fontSize:16 }}>${s.precio}</TableCell>
                        <TableCell style={cell}>{s.categoria}</TableCell>
                        <TableCell style={cell}><button onClick={() => del('servicios', s.id, 'servicios')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,60,60,0.6)', padding:4 }}><Trash2 size={14} /></button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!data.servicios.length && <p style={{ textAlign:'center', padding:40, fontSize:12, color:'rgba(255,255,255,0.25)', letterSpacing:'2px' }}>No hay servicios registrados</p>}
              </div>
            </div>
          </TabsContent>

          {/* TESTIMONIOS */}
          <TabsContent value="testimonios">
            <div style={{ background:'#070d14', border:'1px solid rgba(0,102,204,0.15)' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:20, color:'#fff' }}>Testimonios</span>
              </div>
              <div style={{ overflowX:'auto' }}>
                <Table>
                  <TableHeader><TableRow style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    {['Nombre','Colonia','Cal.','Testimonio',''].map(h => <TableHead key={h} style={head}>{h}</TableHead>)}
                  </TableRow></TableHeader>
                  <TableBody>
                    {data.testimonios.map(t => (
                      <TableRow key={t.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <TableCell style={cell}>{t.nombre}</TableCell>
                        <TableCell style={cell}>{t.colonia}</TableCell>
                        <TableCell style={{ ...cell, color:'#3B9EFF' }}>{'★'.repeat(t.calificacion||5)}</TableCell>
                        <TableCell style={{ ...cell, maxWidth:300 }}><span style={{ display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.texto}</span></TableCell>
                        <TableCell style={cell}><button onClick={() => del('testimonios', t.id, 'testimonios')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,60,60,0.6)', padding:4 }}><Trash2 size={14} /></button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {!data.testimonios.length && <p style={{ textAlign:'center', padding:40, fontSize:12, color:'rgba(255,255,255,0.25)', letterSpacing:'2px' }}>No hay testimonios</p>}
              </div>
            </div>
          </TabsContent>

          {/* GALERÍA */}
          <TabsContent value="galeria">
            <div style={{ background:'#070d14', border:'1px solid rgba(0,102,204,0.15)', padding:24 }}>
              <div style={{ marginBottom:20 }}><span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:20, color:'#fff' }}>Galería</span></div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:2 }}>
                {data.galeria.map(item => (
                  <div key={item.id} style={{ position:'relative', aspectRatio:'1' }}
                    onMouseEnter={e => e.currentTarget.querySelector('.overlay').style.opacity=1}
                    onMouseLeave={e => e.currentTarget.querySelector('.overlay').style.opacity=0}>
                    <img src={item.foto_url} alt={item.categoria} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <div className="overlay" style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', opacity:0, transition:'opacity 0.2s', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <button onClick={() => del('galeria', item.id, 'galeria')} style={{ background:'rgba(220,38,38,0.8)', border:'none', color:'#fff', padding:'8px 16px', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:"'Montserrat', sans-serif" }}>
                        <Trash2 size={12} /> Eliminar
                      </button>
                    </div>
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent,rgba(0,0,0,0.8))', padding:'8px 10px' }}>
                      <span style={{ fontSize:9, letterSpacing:'1.5px', color:'rgba(255,255,255,0.6)', textTransform:'uppercase' }}>{item.categoria}</span>
                    </div>
                  </div>
                ))}
              </div>
              {!data.galeria.length && <p style={{ textAlign:'center', padding:40, fontSize:12, color:'rgba(255,255,255,0.25)', letterSpacing:'2px' }}>No hay imágenes en la galería</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
