import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/Toast';
import { Layers, Crown, Store, GraduationCap, Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showMerchant, setShowMerchant] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Selamat datang, ${user.name}!`);
      const map = { admin: '/admin', merchant: '/merchant', customer: '/home' };
      navigate(map[user.role] || '/');
    } catch (err) {
      console.error('LOGIN ERROR DETAILS:', err);
      toast.error(err.response?.data?.message || 'Login gagal. Periksa koneksi backend.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      admin: { email: 'admin@kantinku.id', password: 'password' },
      merchant: { email: 'budi@kantinku.id', password: 'password' },
      customer: { email: 'andi@student.ac.id', password: 'password' },
    };
    setForm(creds[role]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,107,53,0.1) 0%, transparent 60%), var(--bg-dark)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <Layers size={22} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.6rem' }}>Kantin<em style={{ color: 'var(--primary)', fontStyle: 'normal' }}>Ku</em></span>
          </Link>
          <h2 style={{ marginBottom: '0.35rem' }}>Selamat Datang!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Masuk ke akun KantinKu kamu</p>
        </div>

        <div className="card">
          {/* Demo accounts */}
          <div style={{ background: 'var(--bg-card2)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 600 }}>Demo Akun (Pilih Salah Satu Opsi 3 Role dibawah ini)</div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button onClick={() => fillDemo('admin')} className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Crown size={14} />
                Admin
              </button>
              
              <div style={{ position: 'relative' }}>
                <button 
                  type="button"
                  onClick={() => setShowMerchant(!showMerchant)}
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Store size={14} />
                  Merchant
                </button>

                {showMerchant && (
                  <>
                    <div 
                      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
                      onClick={() => setShowMerchant(false)}
                    />
                    <div className="dropdown-menu-custom">
                      <div className="dropdown-header-custom">Pilih Kedai Demo</div>
                      {[
                        { id: 'budi', name: 'Warung Pak Budi' },
                        { id: 'sri', name: 'Dapur Bu Sri' },
                        { id: 'joko', name: 'Mie Ayam Mas Joko' },
                        { id: 'cemara', name: 'Bakso Selera Cemara' },
                        { id: 'hendra', name: 'Nasi Uduk Pak Hendra' },
                        { id: 'ratna', name: 'Warung Bu Ratna' },
                        { id: 'fajar', name: 'Kedai Mas Fajar' }
                      ].map((k) => (
                        <button
                          key={k.id}
                          type="button"
                          className="dropdown-item-custom"
                          onClick={() => {
                            setForm({ email: `${k.id}@kantinku.id`, password: 'password' });
                            setShowMerchant(false);
                          }}
                        >
                          <Store size={12} style={{ opacity: 0.5 }} />
                          {k.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button onClick={() => fillDemo('customer')} className="btn btn-sm btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <GraduationCap size={14} />
                Customer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-wrap">
                <span className="icon">
                  <Mail size={18} />
                </span>
                <input className="form-control" type="email" placeholder="email@kampus.ac.id" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <span className="icon">
                  <Lock size={18} />
                </span>
                <input className="form-control" type="password" placeholder="Password kamu" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              {loading ? (
                <><span className="loading-spinner"></span> Memproses...</>
              ) : (
                <>
                  <LogIn size={20} />
                  Masuk
                </>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Belum punya akun? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}
