import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Calendar, Clock, MapPin, User, Phone, MessageSquare } from 'lucide-react';

// Número de WhatsApp de Michelle (formato: 52 + 10 dígitos)
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '521234567890';

const BookingForm = ({ services }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    colonia: '',
    servicio: '',
    fecha: '',
    hora: '',
    mensaje: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colonias = [
    'Centro Histórico', 'Analco', 'La Paz', 'Xonaca',
    'Hueyotlipan', 'San Manuel', 'Azcarate', 'Los Ángeles',
    'Jardines de San Manuel', 'Otra colonia',
  ];

  const horarios = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, telefono, colonia, servicio, fecha, hora } = formData;
    if (!nombre || !telefono || !colonia || !servicio || !fecha || !hora) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('citas').insert([formData]);
      if (error) throw error;

      const msg = [
        '*Nueva Cita - Michelle Nails*',
        '',
        `👤 *Nombre:* ${nombre}`,
        `📱 *Teléfono:* ${telefono}`,
        `📍 *Colonia:* ${colonia}`,
        `💅 *Servicio:* ${servicio}`,
        `📅 *Fecha:* ${fecha}`,
        `⏰ *Hora:* ${hora}`,
        formData.mensaje ? `💬 *Mensaje:* ${formData.mensaje}` : '',
      ].filter(Boolean).join('\n');

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

      toast.success('¡Cita registrada! Te redirigimos a WhatsApp para confirmar.');
      setFormData({ nombre: '', telefono: '', colonia: '', servicio: '', fecha: '', hora: '', mensaje: '' });
    } catch (error) {
      console.error(error);
      toast.error('Hubo un error al registrar tu cita. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Info lateral */}
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Agenda tu cita
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Completa el formulario y te confirmaremos por WhatsApp. ¡Sin complicaciones!
          </p>
        </div>
        <div className="space-y-5">
          {[
            { icon: MapPin, title: 'Servicio a domicilio', desc: 'Llegamos a donde estés en Puebla' },
            { icon: Clock, title: 'Horarios flexibles', desc: 'Lunes a sábado de 9 AM a 6 PM' },
            { icon: Calendar, title: 'Confirmación rápida', desc: 'Respuesta en menos de 2 horas' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <Card className="shadow-xl shadow-primary/5 border-border">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-primary">Datos de tu cita</CardTitle>
          <CardDescription>Los campos marcados con * son obligatorios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="flex items-center gap-1">
                  <User size={14} /> Nombre *
                </Label>
                <Input id="nombre" placeholder="Tu nombre completo"
                  value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono" className="flex items-center gap-1">
                  <Phone size={14} /> Teléfono *
                </Label>
                <Input id="telefono" placeholder="222 123 4567" type="tel"
                  value={formData.telefono} onChange={e => handleChange('telefono', e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1"><MapPin size={14} /> Colonia *</Label>
              <Select value={formData.colonia} onValueChange={v => handleChange('colonia', v)} required>
                <SelectTrigger><SelectValue placeholder="Selecciona tu colonia" /></SelectTrigger>
                <SelectContent>
                  {colonias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Servicio *</Label>
              <Select value={formData.servicio} onValueChange={v => handleChange('servicio', v)} required>
                <SelectTrigger><SelectValue placeholder="¿Qué servicio deseas?" /></SelectTrigger>
                <SelectContent>
                  {services.map(s => (
                    <SelectItem key={s.id} value={s.nombre}>{s.nombre} — ${s.precio}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha" className="flex items-center gap-1">
                  <Calendar size={14} /> Fecha *
                </Label>
                <Input id="fecha" type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.fecha} onChange={e => handleChange('fecha', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Clock size={14} /> Hora *</Label>
                <Select value={formData.hora} onValueChange={v => handleChange('hora', v)} required>
                  <SelectTrigger><SelectValue placeholder="Horario" /></SelectTrigger>
                  <SelectContent>
                    {horarios.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensaje" className="flex items-center gap-1">
                <MessageSquare size={14} /> Notas adicionales
              </Label>
              <Textarea id="mensaje" placeholder="Diseño especial, alergias, instrucciones de acceso..."
                rows={3} value={formData.mensaje} onChange={e => handleChange('mensaje', e.target.value)} />
            </div>

            <Button type="submit" disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold rounded-full transition-all duration-300 active:scale-[0.98]">
              {isSubmitting ? 'Registrando...' : '💅 Confirmar cita por WhatsApp'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;
