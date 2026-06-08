import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, MapPin, CheckCircle2, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import ServiceCalculator from '@/components/ServiceCalculator';
import GalleryFilter from '@/components/GalleryFilter';
import GalleryCarousel from '@/components/GalleryCarousel';
import TestimonialCard from '@/components/TestimonialCard';
import BookingForm from '@/components/BookingForm';
import { supabase } from '@/lib/supabaseClient';

const useMobile = () => {
  const [m, setM] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  React.useEffect(() => {
    const h = () => setM(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return m;
};

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '522221234567';

const defaultServices = [
  { id:'1', nombre:'Acrílico Escultural', descripcion:'Extensiones con acrílico premium. Diseño personalizado y acabado impecable que dura semanas.', precio:550, categoria:'Acrílicas', image:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400' },
  { id:'2', nombre:'Gel Semipermanente', descripcion:'Manicura completa con gel de alta calidad. Brillo espejo y duración hasta 4 semanas sin astillarse.', precio:380, categoria:'Gel', image:'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400' },
  { id:'3', nombre:'Nail Art & Diseños', descripcion:'Arte a mano alzada, cristales Swarovski, cromados, encapsulados y efectos únicos para cada ocasión.', precio:250, categoria:'Nail Art', image:'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400' },
  { id:'4', nombre:'Spa Pedicure', descripcion:'Experiencia de spa completa. Exfoliación, masaje relajante y esmaltado perfecto para tus pies.', precio:450, categoria:'Pedicure', image:'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400' },
];
const defaultGallery = [
  { id:'1', image:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', categoria:'Acrílicas' },
  { id:'2', image:'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=600', categoria:'Gel' },
  { id:'3', image:'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600', categoria:'Nail Art' },
  { id:'4', image:'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600', categoria:'Pedicure' },
  { id:'5', image:'https://images.unsplash.com/photo-1599948128020-9a44e4a3f1e1?w=600', categoria:'Acrílicas' },
  { id:'6', image:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', categoria:'Gel' },
];
const defaultTestimonials = [
  { id:'1', nombre:'Ana Sofía M.', colonia:'Angelópolis', calificacion:5, texto:'El servicio a domicilio es increíble. Llegaron puntualísimas, traían todo esterilizado y mis uñas quedaron espectaculares.' },
  { id:'2', nombre:'Valeria R.', colonia:'La Paz', calificacion:5, texto:'El gel me dura casi un mes intacto. La calidad y el diseño son de otro nivel. ¡Ya no voy a ningún otro salón!' },
  { id:'3', nombre:'Daniela M.', colonia:'San Manuel', calificacion:5, texto:'La higiene y profesionalismo son impecables. Me hice el spa pedicure en casa y fue la experiencia más relajante.' },
];

const fadeUp = { hidden:{ opacity:0, y:28 }, show:{ opacity:1, y:0, transition:{ duration:0.7 } } };
const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.1 } } };

const Divider = () => (
  <div style={{ display:'flex', alignItems:'center', gap:16, padding:'28px clamp(16px,5vw,48px)', background:'#000' }}>
    <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,rgba(0,102,204,0.4),transparent)' }} />
    <div style={{ width:6, height:6, background:'#0066CC', transform:'rotate(45deg)', flexShrink:0 }} />
    <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(0,102,204,0.4),transparent)' }} />
  </div>
);

const SectionHeader = ({ eyebrow, title, italic }) => (
  <div style={{ textAlign:'center', marginBottom:52 }}>
    <div style={{ fontSize:10, letterSpacing:'4px', color:'#3B9EFF', textTransform:'uppercase', marginBottom:14 }}>{eyebrow}</div>
    <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:42, fontWeight:300, color:'#fff', lineHeight:1.2 }}>
      {title} <em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.5)' }}>{italic}</em>
    </h2>
  </div>
);

const HomePage = () => {
  const isMobile = useMobile();
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [{ data: svc }, { data: gal }, { data: test }] = await Promise.all([
        supabase.from('servicios').select('*'),
        supabase.from('galeria').select('*').order('orden'),
        supabase.from('testimonios').select('*'),
      ]);
      setServices(svc?.length ? svc.map((s,i) => ({ ...s, image: s.foto_url || defaultServices[i]?.image || defaultServices[0].image })) : defaultServices);
      setGallery(gal?.length ? gal.map(g => ({ ...g, image: g.foto_url })) : defaultGallery);
      setTestimonials(test?.length ? test.map(t => ({ ...t, foto: t.foto_url || null })) : defaultTestimonials);
    } catch {
      setServices(defaultServices); setGallery(defaultGallery); setTestimonials(defaultTestimonials);
    }
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
  const categories = ['Todos', ...new Set(gallery.map(g => g.categoria))];
  const filtered = activeCategory === 'Todos' ? gallery : gallery.filter(g => g.categoria === activeCategory);

  return (
    <div style={{ background:'#000', minHeight:'100vh' }}>
      <Header />

      {/* WhatsApp FAB */}
      <button
        onClick={() => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Michelle Nails, me gustaría agendar una cita 💅')}`, '_blank')}
        aria-label="Contactar por WhatsApp"
        style={{
          position:'fixed', bottom:28, right:28, zIndex:40,
          width:52, height:52, borderRadius:'50%',
          background:'linear-gradient(135deg,#0052A3,#0080FF)',
          border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 20px rgba(0,102,204,0.5)',
          animation:'pulse-blue 2.5s infinite',
        }}>
        <MessageCircle size={22} color="#fff" fill="#fff" />
      </button>

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight:'100vh', background:'linear-gradient(180deg,#000 0%,#010d1a 50%,#011833 100%)', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'100px clamp(16px,5vw,48px) 80px', position:'relative', overflow:'hidden', boxSizing:'border-box', width:'100%', maxWidth:'100vw' }}>
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,102,204,0.16) 0%,transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,158,255,0.08) 0%,transparent 70%)', top:'25%', right:'8%', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:2, maxWidth:780 }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, border:'1px solid rgba(59,158,255,0.4)', padding:'7px 20px', fontSize:10, letterSpacing:'3px', color:'#3B9EFF', textTransform:'uppercase', marginBottom:28 }}>
                <div style={{ width:4, height:4, borderRadius:'50%', background:'#3B9EFF' }} />
                Servicio Premium a Domicilio · Puebla
              </div>
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'clamp(52px,8vw,80px)', fontWeight:300, lineHeight:1.05, letterSpacing:2, marginBottom:12, color:'#fff' }}>
              Belleza que<br /><em style={{ fontStyle:'italic', color:'#3B9EFF' }}>llega a ti</em>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize:11, letterSpacing:'4px', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:40 }}>
              Uñas Acrílicas · Gel · Nail Art · Pedicure Spa
            </motion.p>
            <motion.div variants={fadeUp} style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', width:'100%', maxWidth:440 }}>
              <button className="mn-btn-primary" onClick={() => scrollTo('contacto')}>Agenda tu cita</button>
              <button className="mn-btn-ghost" onClick={() => scrollTo('galeria')}>Ver trabajos</button>
            </motion.div>
            <motion.div variants={fadeUp} style={{ display:'flex', gap:'clamp(20px,5vw,48px)', justifyContent:'center', marginTop:60, paddingTop:40, borderTop:'1px solid rgba(255,255,255,0.07)', flexWrap:'wrap' }}>
              {[['500+','Clientas felices'],['3+','Años de experiencia'],['100%','Materiales premium']].map(([num, label]) => (
                <div key={label} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:38, fontWeight:300, color:'#fff', lineHeight:1 }}>
                    {num.replace(/[^0-9]/g, '')}<span style={{ color:'#3B9EFF' }}>{num.replace(/[0-9]/g, '')}</span>
                  </div>
                  <div style={{ fontSize:10, letterSpacing:'2px', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginTop:6 }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:36, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:9, letterSpacing:'3px', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>Descubre</span>
          <div style={{ width:1, height:48, background:'rgba(255,255,255,0.1)', overflow:'hidden', borderRadius:4 }}>
            <div style={{ width:'100%', height:'50%', background:'rgba(0,102,204,0.7)', animation:'slideDown 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── SERVICIOS ── */}
      <section id="servicios" style={{ padding:'80px clamp(16px,5vw,48px)', background:'#000' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={fadeUp}>
          <SectionHeader eyebrow="Nuestros servicios" title="Diseñado para" italic="realzar tu belleza" />
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
          style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:2 }}>
          {services.map((s, i) => (
            <motion.div key={s.id} variants={fadeUp}>
              <ServiceCard service={s} index={i} onBook={() => scrollTo('contacto')} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={fadeUp}>
          <ServiceCalculator services={services} />
        </motion.div>
      </section>

      <Divider />

      {/* ── PROCESO ── */}
      <section id="como-funciona" style={{ padding:'80px clamp(16px,5vw,48px)', background:'#030810' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={fadeUp}>
          <SectionHeader eyebrow="Cómo funciona" title="Tu experiencia" italic="sin complicaciones" />
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'clamp(24px,4vw,0px)', maxWidth:900, margin:'0 auto', position:'relative' }}>
          {!isMobile && <div style={{ position:'absolute', top:28, left:'16%', right:'16%', height:1, background:'linear-gradient(90deg,transparent,rgba(0,102,204,0.5),rgba(59,158,255,0.5),rgba(0,102,204,0.5),transparent)' }} />}
          {[
            { num:'1', title:'Elige y agenda', desc:'Selecciona tu servicio y reserva tu cita desde la web o WhatsApp en menos de 2 minutos.' },
            { num:'2', title:'Confirmación', desc:'Recibes confirmación inmediata. Te recordamos 24 horas antes de tu cita.' },
            { num:'3', title:'Llegamos a ti', desc:'Tu manicurista llega puntual con todo el equipo esterilizado. Tú solo disfrutas.' },
          ].map((step, i) => (
            <motion.div key={i} initial="hidden" whileInView="show" viewport={{ once:true }} variants={fadeUp}
              style={{ textAlign:'center', padding:'0 28px' }}>
              <div style={{ width:56, height:56, border:'1px solid rgba(0,102,204,0.45)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', background:'#000', position:'relative', zIndex:1 }}>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, fontWeight:300, color:'#3B9EFF' }}>{step.num}</span>
              </div>
              <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:21, fontWeight:400, color:'#fff', marginBottom:10 }}>{step.title}</h3>
              <p style={{ fontSize:11, lineHeight:1.8, color:'rgba(255,255,255,0.42)' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── GALERÍA ── */}
      <section id="galeria" style={{ paddingTop:80, paddingBottom:0, background:'#000', overflow:'hidden' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={fadeUp}
          style={{ padding:'0 clamp(16px,5vw,48px)', marginBottom:32 }}>
          <SectionHeader eyebrow="Galería de trabajos" title="Arte que" italic="habla por sí solo" />
          <GalleryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </motion.div>
        <GalleryCarousel images={filtered} />
      </section>

      <Divider />

      {/* ── TESTIMONIOS ── */}
      <section id="testimonios" style={{ padding:'80px clamp(16px,5vw,48px)', background:'#030810' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={fadeUp}>
          <SectionHeader eyebrow="Testimonios" title="Lo que dicen" italic="nuestras clientas" />
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once:true }} variants={stagger}
          style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap:2 }}>
          {testimonials.map(t => (
            <motion.div key={t.id} variants={fadeUp}>
              <TestimonialCard testimonial={t} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Divider />

      {/* ── CONTACTO ── */}
      <section id="contacto" style={{ padding:'80px clamp(16px,5vw,48px)', background:'#000' }}>
        <BookingForm services={services} />
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
