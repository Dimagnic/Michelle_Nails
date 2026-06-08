import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { MapPin, CheckCircle2, Sparkles, MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import ServiceCalculator from '@/components/ServiceCalculator';
import GalleryFilter from '@/components/GalleryFilter';
import TestimonialCard from '@/components/TestimonialCard';
import BookingForm from '@/components/BookingForm';
import { supabase } from '@/lib/supabaseClient';

const HomePage = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [{ data: serviciosData }, { data: galeriaData }, { data: testimoniosData }] = await Promise.all([
        supabase.from('servicios').select('*'),
        supabase.from('galeria').select('*').order('orden'),
        supabase.from('testimonios').select('*'),
      ]);

      const serviciosWithImages = (serviciosData || []).map((s, index) => ({
        id: s.id,
        nombre: s.nombre,
        descripcion: s.descripcion,
        precio: s.precio,
        categoria: s.categoria,
        image: s.foto_url || defaultServiceImages[index] || defaultServiceImages[0],
      }));

      const galeriaWithUrls = (galeriaData || []).map(g => ({
        id: g.id,
        image: g.foto_url,
        categoria: g.categoria,
      }));

      const testimoniosWithUrls = (testimoniosData || []).map(t => ({
        id: t.id,
        nombre: t.nombre,
        colonia: t.colonia,
        foto: t.foto_url || null,
        calificacion: t.calificacion,
        texto: t.texto,
      }));

      setServices(serviciosWithImages.length > 0 ? serviciosWithImages : defaultServices);
      setGalleryImages(galeriaWithUrls.length > 0 ? galeriaWithUrls : defaultGallery);
      setTestimonials(testimoniosWithUrls.length > 0 ? testimoniosWithUrls : defaultTestimonials);
    } catch (error) {
      console.error('Error loading data:', error);
      setServices(defaultServices);
      setGalleryImages(defaultGallery);
      setTestimonials(defaultTestimonials);
    }
  };

  const defaultServiceImages = [
    'https://images.unsplash.com/photo-1653058697255-4234cec16e52',
    'https://images.unsplash.com/photo-1700760933910-d3c03aa18b65',
    'https://images.unsplash.com/photo-1687723977270-4f86dbda39e6',
    'https://images.unsplash.com/photo-1633955726992-2b7c0d2d2a69'
  ];

  const defaultServices = [
    {
      id: '1',
      nombre: 'Acrílico Escultural',
      descripcion: 'Extensión de uñas con acrílico de alta calidad, diseño personalizado y acabado impecable.',
      precio: 550,
      categoria: 'Acrílicas',
      image: defaultServiceImages[0]
    },
    {
      id: '2',
      nombre: 'Gel Semipermanente',
      descripcion: 'Manicura completa con esmaltado en gel que asegura un brillo perfecto y duradero.',
      precio: 380,
      categoria: 'Gel',
      image: defaultServiceImages[1]
    },
    {
      id: '3',
      nombre: 'Nail Art & Diseños',
      descripcion: 'Diseños artísticos a mano alzada, cristalería, efectos cromados y encapsulados.',
      precio: 250,
      categoria: 'Nail Art',
      image: defaultServiceImages[2]
    },
    {
      id: '4',
      nombre: 'Spa Pedicure',
      descripcion: 'Cuidado profundo para tus pies, incluyendo exfoliación, masaje y esmaltado perfecto.',
      precio: 450,
      categoria: 'Pedicure',
      image: defaultServiceImages[3]
    }
  ];

  const defaultGallery = [
    { id: '1', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371', categoria: 'Acrílicas' },
    { id: '2', image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc', categoria: 'Gel' },
    { id: '3', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53', categoria: 'Nail Art' },
    { id: '4', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b', categoria: 'Pedicure' },
    { id: '5', image: 'https://images.unsplash.com/photo-1599948128020-9a44e4a3f1e1', categoria: 'Acrílicas' },
    { id: '6', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e', categoria: 'Gel' }
  ];

  const defaultTestimonials = [
    {
      id: '1',
      nombre: 'Ana Sofía',
      colonia: 'Polanco',
      foto: null,
      calificacion: 5,
      texto: 'El servicio a domicilio de Michelle Nails es increíble. Llegaron súper puntuales, traían todo esterilizado y mis uñas de acrílico quedaron espectaculares.'
    },
    {
      id: '2',
      nombre: 'Valeria R.',
      colonia: 'Condesa',
      foto: null,
      calificacion: 5,
      texto: 'Me fascina su trabajo. El gel me dura intacto por casi un mes. ¡Súper recomendadas para cuando no tienes tiempo de ir a un salón!'
    },
    {
      id: '3',
      nombre: 'Daniela M.',
      colonia: 'Roma Norte',
      foto: null,
      calificacion: 5,
      texto: 'La higiene y profesionalismo son de otro nivel. Me hice un pedicure spa en la sala de mi casa y fue de lo más relajante.'
    }
  ];

  const categories = ['Todos', ...new Set(galleryImages.map(img => img.categoria))];
  
  const filteredGallery = activeCategory === 'Todos'
    ? galleryImages
    : galleryImages.filter(img => img.categoria === activeCategory);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookService = (service) => {
    scrollToSection('contacto');
  };

  const openWhatsApp = (message) => {
    window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '521234567890'}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <Header />

      <button
        onClick={() => openWhatsApp('Hola Michelle Nails, me gustaría agendar una cita para arreglar mis uñas')}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={24} />
      </button>

      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1460980445968-0a5d622f295b"
            alt="Michelle Nails Manicure"
            className="w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-michelle opacity-90"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex justify-center"
          >
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-xl"
          >
            Bienvenida a Michelle Nails
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-3xl mb-10 text-white/90 font-light tracking-wide drop-shadow-md"
          >
            Servicio a domicilio · Belleza en tus manos
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={() => scrollToSection('contacto')}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/50 text-lg px-10 py-7 rounded-full transition-all duration-300 active:scale-95 shadow-lg border border-white/20 font-semibold"
            >
              Agenda tu cita hoy
            </Button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-white/80 text-sm tracking-widest uppercase font-medium">Descubre</span>
          <div className="w-[2px] h-12 bg-white/20 overflow-hidden rounded-full">
            <div className="w-full h-1/2 bg-white animate-[slideDown_2s_ease-in-out_infinite]"></div>
          </div>
        </motion.div>
      </section>

      <section id="servicios" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary drop-shadow-sm">
              En Michelle Nails ofrecemos...
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Descubre nuestra selección de servicios diseñados para realzar tu belleza sin salir de casa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <ServiceCard service={service} onBook={handleBookService} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <ServiceCalculator services={services} />
          </motion.div>
        </div>
      </section>

      <section id="como-funciona" className="py-24 bg-accent/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary">
              Con Michelle Nails es fácil...
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              El proceso perfecto para que disfrutes de una experiencia relajante en tu propio espacio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-border border-dashed border-2 border-primary/30"></div>

            {[
              {
                icon: Heart,
                title: 'Eliges lo que amas',
                description: 'Revisa nuestra galería, escoge el servicio y diseño vibrante que más te guste.'
              },
              {
                icon: CheckCircle2,
                title: 'Agendas fácilmente',
                description: 'Completa nuestro formulario o envíanos un WhatsApp para reservar tu espacio.'
              },
              {
                icon: MapPin,
                title: 'Llegamos a tu puerta',
                description: 'Nuestra profesional acude a tu domicilio con equipo esterilizado y puntualidad.'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number Badge */}
                <div className="w-24 h-24 rounded-full bg-white border-4 border-accent flex items-center justify-center mb-6 shadow-xl shadow-primary/20 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-inner">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-primary">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed px-4">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="galeria" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary">
              Galería de Arte en Uñas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Inspírate con nuestros últimos trabajos. Cada diseño es creado con pasión y detalle.
            </p>
          </motion.div>

          <GalleryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredGallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="break-inside-avoid group relative overflow-hidden rounded-2xl shadow-lg border border-border"
              >
                <img
                  src={item.image}
                  alt={`Trabajo de ${item.categoria}`}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <span className="text-white font-medium bg-primary/90 px-3 py-1 rounded-full text-sm backdrop-blur-md shadow-md border border-white/20">
                      {item.categoria}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonios" className="py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-primary">
              Nuestras clientas de Michelle Nails dicen...
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              La satisfacción de quienes nos eligen es nuestra mejor carta de presentación.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="py-24 bg-background relative">
        <div className="absolute left-0 w-1/3 h-full bg-accent/30 rounded-r-[100px] -z-10 hidden lg:block"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <BookingForm services={services} />
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;