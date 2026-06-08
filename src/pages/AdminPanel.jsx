import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [s, t, g, c] = await Promise.all([
        supabase.from('servicios').select('*'),
        supabase.from('testimonios').select('*'),
        supabase.from('galeria').select('*').order('orden'),
        supabase.from('citas').select('*').order('created_at', { ascending: false }),
      ]);
      if (s.error) throw s.error;
      if (t.error) throw t.error;
      if (g.error) throw g.error;
      if (c.error) throw c.error;
      setServicios(s.data ?? []);
      setTestimonios(t.data ?? []);
      setGaleria(g.data ?? []);
      setCitas(c.data ?? []);
    } catch (error) {
      toast.error('Error al cargar datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const deleteRow = async (table, id, setter, list) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) { toast.error('Error al eliminar'); return; }
    setter(list.filter(r => r.id !== id));
    toast.success('Eliminado correctamente');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-primary">Panel · Michelle Nails</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{currentUser?.email}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut size={16} className="mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="citas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="citas">Citas</TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
            <TabsTrigger value="testimonios">Testimonios</TabsTrigger>
            <TabsTrigger value="galeria">Galería</TabsTrigger>
          </TabsList>

          {/* CITAS */}
          <TabsContent value="citas">
            <Card>
              <CardHeader><CardTitle>Citas ({citas.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Colonia</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {citas.map((cita) => (
                        <TableRow key={cita.id}>
                          <TableCell className="font-medium">{cita.nombre}</TableCell>
                          <TableCell>{cita.telefono}</TableCell>
                          <TableCell>{cita.colonia}</TableCell>
                          <TableCell>{cita.servicio}</TableCell>
                          <TableCell>{new Date(cita.fecha).toLocaleDateString('es-MX')}</TableCell>
                          <TableCell>{cita.hora}</TableCell>
                          <TableCell className="text-right">
                            <Button onClick={() => deleteRow('citas', cita.id, setCitas, citas)}
                              variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {citas.length === 0 && <p className="text-center text-muted-foreground py-8">No hay citas registradas</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SERVICIOS */}
          <TabsContent value="servicios">
            <Card>
              <CardHeader><CardTitle>Servicios ({servicios.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {servicios.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.nombre}</TableCell>
                          <TableCell className="max-w-xs truncate">{s.descripcion}</TableCell>
                          <TableCell>${s.precio}</TableCell>
                          <TableCell>{s.categoria}</TableCell>
                          <TableCell className="text-right">
                            <Button onClick={() => deleteRow('servicios', s.id, setServicios, servicios)}
                              variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {servicios.length === 0 && <p className="text-center text-muted-foreground py-8">No hay servicios registrados</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TESTIMONIOS */}
          <TabsContent value="testimonios">
            <Card>
              <CardHeader><CardTitle>Testimonios ({testimonios.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Colonia</TableHead>
                        <TableHead>Calificación</TableHead>
                        <TableHead>Texto</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testimonios.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.nombre}</TableCell>
                          <TableCell>{t.colonia}</TableCell>
                          <TableCell>{t.calificacion}/5 ⭐</TableCell>
                          <TableCell className="max-w-xs truncate">{t.texto}</TableCell>
                          <TableCell className="text-right">
                            <Button onClick={() => deleteRow('testimonios', t.id, setTestimonios, testimonios)}
                              variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {testimonios.length === 0 && <p className="text-center text-muted-foreground py-8">No hay testimonios registrados</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* GALERÍA */}
          <TabsContent value="galeria">
            <Card>
              <CardHeader><CardTitle>Galería ({galeria.length} imágenes)</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galeria.map((item) => (
                    <div key={item.id} className="relative group">
                      <img src={item.foto_url} alt={item.categoria}
                        className="w-full aspect-square object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <Button onClick={() => deleteRow('galeria', item.id, setGaleria, galeria)}
                          variant="destructive" size="sm">
                          <Trash2 size={16} className="mr-2" />
                          Eliminar
                        </Button>
                      </div>
                      <p className="text-xs text-center mt-2 text-muted-foreground">{item.categoria}</p>
                    </div>
                  ))}
                </div>
                {galeria.length === 0 && <p className="text-center text-muted-foreground py-8">No hay imágenes en la galería</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
