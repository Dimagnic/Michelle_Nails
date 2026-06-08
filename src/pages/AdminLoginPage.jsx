import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Acceso concedido');
      navigate('/admin');
    } catch {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:'100%', background:'rgba(0,102,204,0.06)', border:'1px solid rgba(0,102,204,0.25)',
    padding:'13px 16px', color:'#fff', fontFamily:"'Montserrat', sans-serif", fontSize:13,
    outline:'none', transition:'border-color 0.2s',
  };
  const labelStyle = { display:'block', fontSize:10, letterSpacing:'2px', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:8 };

  return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Montserrat', sans-serif" }}>
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,102,204,0.1) 0%,transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
      <div style={{ width:'100%', maxWidth:400, background:'#070d14', border:'1px solid rgba(0,102,204,0.2)', padding:44, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ width:48, height:48, border:'1px solid rgba(0,102,204,0.4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <Lock size={18} color="#3B9EFF" />
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:22, letterSpacing:5, color:'#fff', fontWeight:300, marginBottom:6 }}>
            MICHELLE <span style={{ color:'#3B9EFF' }}>NAILS</span>
          </div>
          <div style={{ fontSize:10, letterSpacing:'3px', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>Panel de administración</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:18 }}>
            <label style={labelStyle}>Correo electrónico</label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@michelle-nails.com" required
              onFocus={e => e.target.style.borderColor='#0066CC'}
              onBlur={e => e.target.style.borderColor='rgba(0,102,204,0.25)'} />
          </div>
          <div style={{ marginBottom:28 }}>
            <label style={labelStyle}>Contraseña</label>
            <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              onFocus={e => e.target.style.borderColor='#0066CC'}
              onBlur={e => e.target.style.borderColor='rgba(0,102,204,0.25)'} />
          </div>
          <button type="submit" disabled={loading} style={{
            width:'100%', background: loading ? 'rgba(0,102,204,0.4)' : 'linear-gradient(135deg,#0052A3,#0066CC)',
            color:'#fff', border:'none', padding:15, fontSize:11, letterSpacing:'3px',
            textTransform:'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily:"'Montserrat', sans-serif", transition:'all 0.2s',
          }}>
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
