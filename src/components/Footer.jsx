import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16 border-t-[6px] border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-2 rounded-xl shadow-md">
                <img 
                  src="https://horizons-cdn.hostinger.com/2448214a-3cb0-469a-9b08-1f82454a803c/b5700194d93d06eb3396d3b3649fe904.png" 
                  alt="Michelle Nails Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <h3 className="text-2xl font-serif font-bold tracking-wide">Michelle Nails</h3>
            </div>
            <p className="text-primary-foreground/90 font-medium mb-4 text-lg">
              Servicio a domicilio · Belleza en tus manos
            </p>
            <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-sm">
              Brindamos servicios de manicura y pedicura profesional directamente en la comodidad de tu hogar, utilizando productos de la más alta calidad y garantizando una experiencia vibrante.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-6 text-white border-b border-white/20 pb-2 inline-block">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {['Servicios', 'Galería', 'Testimonios', 'Contacto'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-sm text-primary-foreground/80 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary group-hover:scale-150 transition-transform"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-6 text-white border-b border-white/20 pb-2 inline-block">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/90 hover:text-white transition-colors duration-200">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} />
                </div>
                <a href="tel:+525522203914838">+52 222 123 4567</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/90 hover:text-white transition-colors duration-200">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} />
                </div>
                <a href="mailto:hola@michellenails.com">hola@michellenails.com</a>
              </div>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/90">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                <span>Servicio a domicilio en Ciudad de México y área metropolitana</span>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Michelle Nails. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;