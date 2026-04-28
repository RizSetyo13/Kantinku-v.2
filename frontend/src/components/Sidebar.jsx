import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { LayoutDashboard, Users, Store, MapPin, ClipboardList, MessageSquare, Menu, Star, LogOut } from 'lucide-react';

const adminLinks = [
  { to: '/admin',                icon: <LayoutDashboard size={20} />, label: 'Dashboard',         end: true },
  { to: '/admin/users',         icon: <Users size={20} />,           label: 'Manajemen User' },
  { to: '/admin/kedai',         icon: <Store size={20} />,           label: 'Manajemen Kedai' },
  { to: '/admin/kantin',        icon: <MapPin size={20} />,          label: 'Area Kantin' },
  { to: '/admin/orders',        icon: <ClipboardList size={20} />,   label: 'Semua Pesanan' },
  { to: '/admin/website-reviews', icon: <MessageSquare size={20} />, label: 'Ulasan Website' },
];

const merchantLinks = [
  { to: '/merchant',         icon: <LayoutDashboard size={20} />, label: 'Dashboard',     end: true },
  { to: '/merchant/kedai',   icon: <Store size={20} />,           label: 'Kedai Saya' },
  { to: '/merchant/menu',    icon: <Menu size={20} />,            label: 'Kelola Menu' },
  { to: '/merchant/orders',  icon: <ClipboardList size={20} />,   label: 'Pesanan Masuk', hasBadge: true },
  { to: '/merchant/reviews', icon: <Star size={20} />,            label: 'Ulasan Kedai' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'merchant') {
      const fetchPending = () => {
        api.get('/merchant/stats')
          .then(res => setPendingCount(res.data.pending || 0))
          .catch(() => {});
      };
      fetchPending();
      const interval = setInterval(fetchPending, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const links = user?.role === 'admin' ? adminLinks : merchantLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Store size={20} color="#fff" />
        </div>
        <span>Kantin<em>Ku</em></span>
      </div>

      <nav>
        <div className="nav-label">Menu Utama</div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            <span style={{flex: 1}}>{link.label}</span>
            {link.hasBadge && pendingCount > 0 && (
              <span className="badge badge-danger" style={{ 
                marginLeft: 'auto', 
                fontSize: '0.7rem', 
                padding: '2px 6px',
                animation: 'pulse 1.5s infinite'
              }}>
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
