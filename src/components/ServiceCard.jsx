import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const ServiceCard = ({ service, onBook }) => {
  return (
    <Card className="overflow-hidden bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col border-t-4 border-t-primary border-x-border border-b-border relative group">
      
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <Sparkles className="text-secondary/40" size={24} />
      </div>

      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={service.image}
          alt={service.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Subtle blue overlay on image */}
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
      </div>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded-md">
            {service.categoria}
          </span>
        </div>
        <h3 className="text-xl font-serif font-bold mb-3 text-primary group-hover:text-secondary transition-colors">{service.nombre}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{service.descripcion}</p>
        <div className="flex items-baseline gap-1 mt-auto">
          <span className="text-sm text-muted-foreground font-medium">Desde</span>
          <span className="text-3xl font-bold text-secondary">${service.precio}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => onBook(service)}
          className="w-full bg-primary text-white hover:bg-secondary transition-all duration-300 active:scale-[0.98] shadow-md shadow-primary/20"
        >
          Agendar Servicio
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;