import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Store, Search, Wallet, User, LogOut, ShoppingCart } from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const handleLogout = () => { logout(); navigate('/'); };
  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    onSearch && onSearch(e.target.value);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="brand-icon">
          <Store size={18} />
        </div>
        <span>Kantin<em>Ku</em></span>
      </Link>

      {onSearch !== undefined && (
        <div className="navbar-search">
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            placeholder="Cari kedai atau makanan..."
            value={searchVal}
            onChange={handleSearch}
          />
        </div>
      )}

      <div className="navbar-actions">
        <Link to="/" className="navbar-link">Home</Link>
        {user ? (
          <>
            {user.role === 'customer' && (
              <Link to="/orders" className="navbar-link">Pesanan Saya</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className="navbar-link">Dashboard</Link>
            )}
            {user.role === 'merchant' && (
              <Link to="/merchant" className="navbar-link">Dashboard</Link>
            )}

            {user.role === 'customer' && (
              <div 
                onClick={() => navigate('/wallet')}
                style={{ 
                  padding: '0.5rem 0.85rem', 
                  background: 'rgba(34,197,94,0.1)', 
                  border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '0.85rem', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: 'var(--success)',
                  cursor: 'pointer'
                }}
                title="Klik untuk Top Up KantinPay"
              >
                <Wallet size={14} />
                KantinPay
              </div>
            )}

            <div style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} style={{ color: 'var(--primary)' }} />
              {user.name.split(' ')[0]}
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LogOut size={14} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary btn-sm">Masuk</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
          </>
        )}
        {user?.role === 'customer' && (
          <div className="cart-btn-wrap">
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/cart')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={18} />
              Cart {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
