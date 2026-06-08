import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <Card className="h-full bg-white border-none shadow-md hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden group">
      {/* Left blue accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-michelle"></div>
      
      <CardContent className="p-8">
        <Quote className="text-accent absolute top-6 right-6 w-12 h-12 opacity-50 -rotate-12 group-hover:scale-110 transition-transform duration-300" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-accent flex-shrink-0 border-2 border-secondary p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden">
              {testimonial.foto ? (
                <img
                  src={testimonial.foto}
                  alt={testimonial.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary font-serif font-bold text-xl">
                  {testimonial.nombre.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-primary text-lg">{testimonial.nombre}</h4>
            <p className="text-sm text-secondary font-medium">{testimonial.colonia}</p>
          </div>
        </div>
        
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < testimonial.calificacion ? 'fill-secondary text-secondary' : 'text-muted'}
            />
          ))}
        </div>
        
        <p className="text-base leading-relaxed text-foreground/80 relative z-10 font-serif italic">
          "{testimonial.texto}"
        </p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;