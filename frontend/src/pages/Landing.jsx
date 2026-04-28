import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import WebsiteReviews from '../components/WebsiteReviews';
import { Rocket, Flame, Star, MapPin, Search, ShoppingCart, Target, Layers } from 'lucide-react';

const AREA_ICONS = [<MapPin size={14} />, <MapPin size={14} />, <MapPin size={14} />, <MapPin size={14} />, <MapPin size={14} />, <MapPin size={14} />, <MapPin size={14} />];

const isKedaiOpen = (open, close) => {
  if (!open || !close) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = open.split(':').map(Number);
  const [closeH, closeM] = close.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  if (closeMinutes < openMinutes) return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};

export default function Landing() {
  const [areas, setAreas] = useState([]);
  const [kedai, setKedai] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    api.get('/kantin')
      .then(r => setAreas(r.data))
      .catch(err => console.error('Gagal memuat area kantin:', err));

    api.get('/kedai')
      .then(r => setKedai(r.data))
      .catch(err => console.error('Gagal memuat daftar kedai:', err));
  }, []);

  const handleAreaClick = (id) => {
    setSelectedArea(id);
    const section = document.getElementById('kedai-populer');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredKedai = selectedArea
    ? kedai.filter(k => {
      const area = areas.find(a => a.id === selectedArea);
      return k.kantin_area_id === selectedArea || (area && k.kantin_name === area.name);
    })
    : kedai.slice(0, 8);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Layers size={18} />
          </div>
          <span>Kantin<em>Ku</em></span>
        </Link>
        <div className="navbar-actions">
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : user.role === 'merchant' ? '/merchant' : '/home'} className="btn btn-primary btn-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Masuk</Link>
              <Link to="/home" className="btn btn-primary btn-sm">Mulai Pesan</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(255,107,53,0.15) 0%, var(--bg-dark) 80%), radial-gradient(circle at 100% 100%, rgba(255,107,53,0.05) 0%, transparent 40%)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div className="hero-badge">
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Rocket size={12} />
              </span> Sistem Kantin Digital Kampus
            </div>
            <h1>Pesan Makanan Kampus<br />Lebih Mudah & Cepat</h1>
            <p>Temukan berbagai pilihan makanan dari kedai favorit di kampus pesan sekarang ambil sendiri  tanpa antre panjang</p>
            <div className="hero-actions">
              <Link to="/home" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <Rocket size={20} />
                Mulai Sekarang
              </Link>
              <Link to="/home" className="btn btn-secondary btn-lg">Lihat Kedai →</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">{areas.length}</div>
                <div className="hero-stat-label">Area Kantin</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{kedai.length}</div>
                <div className="hero-stat-label">Kedai Aktif</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">100%</div>
                <div className="hero-stat-label">Pickup</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          </div>
        </div>
      </section>

      {/* Area Filter (Image 2 Style) */}
      <section style={{ padding: '2rem 0', background: 'var(--bg-dark)', borderBottom: '1px solid rgba(255,107,53,0.1)' }}>
        <div className="container">
          <div className="filter-row">
            <span className="filter-label">Filter Area:</span>
            <button
              className={`filter-pill ${!selectedArea ? 'active' : ''}`}
              onClick={() => setSelectedArea(null)}
            >
              Semua Area
            </button>
            {areas.map((area) => (
              <button
                key={area.id}
                className={`filter-pill ${selectedArea === area.id ? 'active' : ''}`}
                onClick={() => setSelectedArea(area.id)}
              >
                {area.name.replace('Kantin ', '')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Kedai */}
      <section id="kedai-populer" style={{ padding: '6rem 0', background: 'linear-gradient(180deg, var(--bg-dark) 0%, rgba(255,107,53,0.08) 40%, var(--bg-dark) 100%)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2 className="section-title">
                {selectedArea ? `Kedai di Area ${areas.find(a => a.id === selectedArea)?.name.replace('Kantin ', '')}` : 'Kedai Populer'}
              </h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>Pilihan terbaik untuk mahasiswa hari ini</p>
            </div>
          </div>
          <div className="grid-kedai">
            {filteredKedai.length > 0 ? filteredKedai.map(k => {
              const isOpen = isKedaiOpen(k.open_time, k.close_time);
              return (
                <Link to={`/kedai/${k.id}`} key={k.id} className="kedai-card">
                  <div className="kedai-card-img">
                    <img 
                      src={k.image_url?.startsWith('/uploads/') ? `http://localhost:5000${k.image_url}` : (k.image_url || (k.name.includes('Budi') ? '/images/kedai_budi.png' : k.name.includes('Sari') ? '/images/kedai_sari.png' : k.name.includes('Joko') ? '/images/kedai_joko.png' : '/images/kedai_bakso.png'))} 
                      alt={k.name} 
                      onError={(e) => { e.target.src = '/images/kedai_bakso.png'; }}
                    />
                    <div className="kedai-badge">
                      <MapPin size={12} style={{ marginRight: '3px' }} />
                      {k.kantin_name?.replace('Kantin ', '')}
                    </div>
                    {k.rating >= 4.5 && (
                      <div className="populer-pill">
                        <Flame size={12} style={{ marginRight: '4px' }} />
                        POPULER
                      </div>
                    )}
                    <div className={isOpen ? 'kedai-status-badge open' : 'kedai-status-badge closed'}>
                      {isOpen ? '● BUKA' : '● TUTUP'}
                    </div>
                  </div>
                  <div className="kedai-card-body">
                    <div className="kedai-card-name">{k.name}</div>
                    <div className="kedai-card-loc">
                      <MapPin size={14} style={{ marginRight: '4px', color: 'var(--primary)' }} />
                      {k.kantin_name}
                    </div>
                    <div className="kedai-card-meta">
                      <span className="kedai-rating">
                        <Star size={12} fill="#ffb400" style={{ marginRight: '4px', color: '#ffb400' }} />
                        {parseFloat(k.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                <div style={{ marginBottom: '1.5rem', color: 'var(--primary)', opacity: 0.5 }}>
                  <Search size={64} style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ color: 'var(--text-secondary)' }}>Belum ada kedai di area ini</h3>
                <p style={{ color: 'var(--text-muted)' }}>Silakan pilih area lain</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, var(--bg-dark) 50%, rgba(255,107,53,0.06) 100%)', borderTop: '1px solid rgba(255,107,53,0.15)', borderBottom: '1px solid rgba(255,107,53,0.15)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Cara Pemesanan</h2>
          <p className="section-sub" style={{ textAlign: 'center' }}>Pesan dalam 3 langkah mudah</p>
          <div className="grid-3" style={{ marginTop: '2rem' }}>
            {[
              { 
                icon: <Search size={48} />, 
                title: '1. Pilih Kedai', 
                desc: 'Browse kedai berdasarkan area kantin atau kategori makanan favoritmu' 
              },
              { 
                icon: <ShoppingCart size={48} />, 
                title: '2. Tambah ke Cart', 
                desc: 'Pilih menu yang kamu inginkan, atur jumlah, dan tentukan waktu pickup' 
              },
              { 
                icon: <Target size={48} />, 
                title: '3. Ambil Pesanan', 
                desc: 'Datang ke kedai sesuai waktu yang dipilih, tunjukkan kode order, dan nikmati!' 
              },
            ].map((step, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{step.icon}</div>
                <h3 style={{ marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Task 2A: Ulasan Website */}
      <WebsiteReviews />

      {/* Footer */}
      <footer style={{ background: 'linear-gradient(180deg, var(--bg-dark) 0%, rgba(255,107,53,0.08) 100%)', borderTop: '1px solid rgba(255,107,53,0.2)', padding: '4rem 0 2rem', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div className="brand-icon" style={{ width: '28px', height: '28px' }}>
              <Layers size={14} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Kantin<em style={{ color: 'var(--primary)', fontStyle: 'normal' }}>Ku</em></span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2026 KantinKu - Sistem Pemesanan Makanan Digital Kampus</p>
        </div>
      </footer>
    </div>
  );
}
