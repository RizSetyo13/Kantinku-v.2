import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../api/axios';
import { toast } from '../../components/Toast';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const [bRes, tRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet/transactions')
      ]);
      setBalance(bRes.data.balance);
      setTransactions(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    // Bersihkan titik jika ada (format ribuan Indonesia)
    const cleanAmount = amount.toString().replace(/\./g, '');
    if (!cleanAmount || cleanAmount <= 0) return;
    try {
      const res = await api.post('/wallet/topup', { amount: parseInt(cleanAmount) });
      setBalance(res.data.balance);
      setAmount('');
      toast.success('Top up berhasil!');
      fetchWallet();
    } catch (err) {
      toast.error('Gagal top up');
    }
  };

  if (loading) return <div className="page-loading"><div className="loading-spinner"></div></div>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: '800px' }}>
        <div className="page-header">
          <h1>Kantin<em>Pay</em> Wallet</h1>
          <p>Kelola saldo dan riwayat transaksi pembayaran Anda.</p>
        </div>

        <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.5fr', alignItems: 'start' }}>
          {/* Topup Card */}
          <div className="card">
            <div className="stat-label">Saldo Saat Ini</div>
            <div className="stat-value" style={{ color: 'var(--success)', marginBottom: '1.5rem' }}>
              Rp {balance.toLocaleString()}
            </div>
            
            <form onSubmit={handleTopup}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Pilih Nominal Cepat</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {[50000, 100000, 200000, 300000, 400000, 500000].map(val => (
                    <button 
                      key={val}
                      type="button"
                      className={`btn ${amount == val ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.5rem 0.25rem', fontSize: '0.8rem' }}
                      onClick={() => setAmount(val.toString())}
                    >
                      Rp {val.toLocaleString('id')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nominal Lainnya</label>
                <div className="input-icon-wrap">
                  <span className="icon" style={{ fontSize: '0.8rem', fontWeight: 800 }}>Rp</span>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Contoh: 1000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <small className="form-hint" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Isi manual untuk nominal di atas Rp 500.000
                </small>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={!amount} style={{ marginTop: '0.5rem' }}>
                Top Up Sekarang
              </button>
            </form>
            <p className="form-hint" style={{ marginTop: '1rem', textAlign: 'center' }}>
              Metode pembayaran: Demo / Simulasi
            </p>
          </div>

          {/* Transactions List */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>Riwayat Transaksi</h3>
            {transactions.length === 0 ? (
              <div className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
                Belum ada riwayat transaksi.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {transactions.map(tx => (
                  <div key={tx.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--bg-card2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {tx.tipe === 'topup' ? '➕ Top Up' : '🛒 Pembayaran'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(tx.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ 
                      textAlign: 'right',
                      fontWeight: 800,
                      color: tx.tipe === 'topup' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {tx.tipe === 'topup' ? '+' : '-'} Rp {parseFloat(tx.jumlah).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
