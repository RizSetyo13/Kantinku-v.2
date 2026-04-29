import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { API_URL } from '../../config';
import { MapPin, Search, Flame, Star, Coffee, Utensils, Pizza, Apple, Cake, Soup, IceCream } from 'lucide-react';

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

export default function CustomerHome() {
  const [areas, setAreas] = useState([]);
  const [kedai, setKedai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeArea = searchParams.get('kantin') || 'all';

  const liveCount = kedai.filter(k => isKedaiOpen(k.open_time, k.close_time)).length;

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Tunggu 500ms setelah berhenti mengetik
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    api.get('/kantin')
      .then(r => setAreas(r.data))
      .catch(err => console.error('Gagal memuat area kantin:', err));
  }, []);

  useEffect(() => {
    const params = {};
    if (activeArea !== 'all') params.kantin_area_id = activeArea;
    if (debouncedSearch) params.search = debouncedSearch;
    setLoading(true);
    api.get('/kedai', { params })
      .then(r => { setKedai(r.data); setLoading(false); })
      .catch(err => {
        console.error('Gagal memuat kedai:', err);
        setLoading(false);
      });
  }, [activeArea, debouncedSearch]);

  const setArea = (id) => {
    if (id === 'all') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('kantin');
      setSearchParams(newParams);
    } else {
      setSearchParams({ kantin: id });
    }
  };

  return (
    <div>
      <Navbar onSearch={setSearch} />

      {/* Hero Section - FoodieHub Inspired */}
      <div className="hero" style={{ padding: '4rem 0', minHeight: 'auto', marginBottom: '2rem' }}>
        <div className="container">
          <div className="hero-badge">
            <Flame size={12} fill="currentColor" style={{ marginRight: '4px' }} /> Live: {liveCount} Kedai Kampus Sedang Buka
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '1rem' }}>
            Mau makan apa <br /> <em>hari ini?</em>
          </h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', marginBottom: '2.5rem', color: 'var(--text-secondary)' }}>
            Nikmati kemudahan pesan makanan di kantin kampus.
            Tanpa antre, bayar dengan <strong>KantinPay</strong>, dan ambil pesananmu saat sudah siap.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => {
              document.getElementById('explore-kedai').scrollIntoView({ behavior: 'smooth' });
            }}>
              Jelajahi Kedai
            </button>
            <Link to="/orders" className="btn btn-secondary btn-lg">
              Lacak Pesanan
            </Link>
          </div>
        </div>
      </div>

      <div className="container" id="explore-kedai" style={{ paddingBottom: '4rem' }}>
        {/* Page Header */}
        <div className="page-header-row" style={{ marginBottom: '2rem' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              {activeArea === 'all' ? 'Kedai Populer' : `Kedai di ${areas.find(a => a.id == activeArea)?.name}`}
            </h2>
            <p className="section-sub" style={{ fontSize: '1rem' }}>{kdnLabel(kedai.length, search)}</p>
          </div>
        </div>

        {/* Compact Area Filter (Pills - Image 2 Style) */}
        <div className="filter-row" style={{ marginBottom: '2.5rem' }}>
          <span className="filter-label">Filter Area:</span>
          <button
            className={`filter-pill ${activeArea === 'all' ? 'active' : ''}`}
            onClick={() => setArea('all')}
          >
            Semua Area
          </button>
          {areas.map((area) => (
            <button
              key={area.id}
              className={`filter-pill ${activeArea == area.id ? 'active' : ''}`}
              onClick={() => setArea(area.id)}
            >
              {area.name.replace('Kantin ', '')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="page-loading"><div className="loading-spinner" style={{ width: 36, height: 36, borderWidth: 3 }}></div></div>
        ) : kedai.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={64} style={{ opacity: 0.2 }} />
            </div>
            <h3>Tidak ada kedai ditemukan</h3>
            <p>Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <div className="grid-kedai">
            {kedai.map(k => {
              const isOpen = isKedaiOpen(k.open_time, k.close_time);
              return (
                <Link to={`/kedai/${k.id}`} key={k.id} className="kedai-card">
                  <div className="kedai-card-img">
                    <img
                      src={k.image_url?.startsWith('/uploads/') ? `${API_URL}${k.image_url}` : (k.image_url || (k.name.includes('Budi') ? '/images/kedai_budi.png' : k.name.includes('Sari') ? '/images/kedai_sari.png' : k.name.includes('Joko') ? '/images/kedai_joko.png' : '/images/kedai_bakso.png'))}
                      alt={k.name}
                      onError={(e) => { e.target.src = '/images/kedai_bakso.png'; }}
                    />
                    <div className="kedai-badge">
                      <MapPin size={12} style={{ marginRight: '3px' }} />
                      {k.kantin_name?.replace('Kantin ', '')}
                    </div>
                    {k.rating >= 4.5 && (
                      <div className="populer-pill">
                        <Flame size={12} fill="currentColor" style={{ marginRight: '4px' }} />
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function kdnLabel(count, search) {
  if (search) return `${count} hasil untuk "${search}"`;
  return `${count} kedai tersedia`;
}
