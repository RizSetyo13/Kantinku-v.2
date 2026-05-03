import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import { toast } from '../../components/Toast';
import { MessageSquare, Phone, Clock, Trash2, Send, Edit } from 'lucide-react';

export default function AdminWebsiteReviews() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [replyMap, setReplyMap] = useState({}); // { [id]: text }
  const [sending, setSending]   = useState(null);

  const load = () => {
    api.get('/admin/website-reviews')
      .then(r => { setReviews(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs} jam lalu`;
    return `${Math.floor(hrs / 24)} hari lalu`;
  };

  const handleReply = async (id) => {
    const balasan = replyMap[id]?.trim();
    if (!balasan) { toast.error('Balasan tidak boleh kosong'); return; }
    setSending(id);
    try {
      await api.post(`/admin/website-reviews/${id}/reply`, { balasan });
      toast.success('Balasan berhasil dikirim');
      setReplyMap(m => ({ ...m, [id]: '' }));
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim balasan');
    } finally {
      setSending(null);
    }
  };

  const handleDeleteReply = async (id) => {
    if (!window.confirm('Hapus balasan ini?')) return;
    try {
      await api.delete(`/admin/website-reviews/${id}/reply`);
      toast.success('Balasan dihapus');
      load();
    } catch {
      toast.error('Gagal menghapus balasan');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Hapus ulasan ini secara permanen?')) return;
    try {
      await api.delete(`/admin/website-reviews/${id}`);
      toast.success('Ulasan berhasil dihapus');
      load();
    } catch {
      toast.error('Gagal menghapus ulasan');
    }
  };

  const avatarBg = (name) =>
    `hsl(${(name.charCodeAt(0) * 37) % 360}, 55%, 45%)`;

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="with-sidebar main-content page-loading">
        <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="with-sidebar main-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 42, height: 42, background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
               <MessageSquare size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0 }}>Ulasan Website</h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{reviews.length} ulasan masuk dari pengguna umum</p>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" style={{opacity:0.2}}>
               <MessageSquare size={64} />
            </div>
            <h3>Belum ada ulasan</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reviews.map(r => (
              <div key={r.id} className="card">
                {/* Header */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                    background: avatarBg(r.nama),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '1rem'
                  }}>
                    {r.nama.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{r.nama}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{display:'flex', alignItems:'center', gap:'3px'}}>
                        <Phone size={12} />
                        {r.no_telp}
                      </span>
                      <span style={{display:'flex', alignItems:'center', gap:'3px'}}>
                        <Clock size={12} />
                        {timeAgo(r.created_at)}
                      </span>
                    </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{r.id}</span>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => handleDeleteReview(r.id)}
                      title="Hapus Ulasan"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Isi ulasan */}
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                  {r.keterangan}
                </p>

                {/* Balasan admin yang sudah ada */}
                {r.balasan_admin && (
                  <div style={{
                    marginLeft: '1rem',
                    paddingLeft: '1rem',
                    borderLeft: '3px solid var(--primary)',
                    background: 'rgba(99,102,241,0.06)',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    padding: '0.6rem 1rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          background: 'var(--primary)', color: '#fff',
                          fontSize: '0.68rem', fontWeight: 700, padding: '0.12rem 0.45rem',
                          borderRadius: 'var(--radius-full)'
                        }}>Admin</span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {r.admin_name} · {timeAgo(r.balasan_at)}
                        </span>
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => handleDeleteReply(r.id)}
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{r.balasan_admin}</p>
                  </div>
                )}

                {/* Form balas */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input
                    id={`reply-input-${r.id}`}
                    className="form-control"
                    placeholder={r.balasan_admin ? 'Edit balasan...' : 'Tulis balasan admin...'}
                    value={replyMap[r.id] || ''}
                    onChange={e => setReplyMap(m => ({ ...m, [r.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleReply(r.id)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={sending === r.id}
                    onClick={() => handleReply(r.id)}
                    style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {sending === r.id ? '...' : (r.balasan_admin ? <Edit size={14} /> : <Send size={14} />)}
                    {sending === r.id ? '' : (r.balasan_admin ? 'Edit' : 'Balas')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
