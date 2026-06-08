import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator } from 'lucide-react';

const ServiceCalculator = ({ services }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const total = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.precio, 0);

  return (
    <Card className="bg-white border-border shadow-xl shadow-primary/5 overflow-hidden">
      <CardHeader className="bg-accent border-b border-border/50 pb-5">
        <CardTitle className="text-xl font-serif text-primary flex items-center gap-3">
          <Calculator className="text-secondary" />
          Cotizador de Servicios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between py-2 group hover:bg-accent/30 px-2 rounded-md transition-colors">
            <div className="flex items-center gap-3">
              <Checkbox
                id={`calc-${service.id}`}
                checked={selectedServices.includes(service.id)}
                onCheckedChange={() => toggleService(service.id)}
                className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary border-primary/30"
              />
              <label 
                htmlFor={`calc-${service.id}`} 
                className="text-sm font-medium cursor-pointer text-foreground group-hover:text-primary transition-colors"
              >
                {service.nombre}
              </label>
            </div>
            <span className="text-sm font-semibold text-secondary">${service.precio}</span>
          </div>
        ))}
        
        <div className="pt-6 mt-4 border-t border-border">
          <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl border border-primary/10">
            <span className="text-lg font-serif font-bold text-primary">Total Estimado:</span>
            <span className="text-3xl font-bold text-primary">${total}</span>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            * Los precios son aproximados y pueden variar según el diseño.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCalculator;