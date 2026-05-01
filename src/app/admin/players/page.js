'use client';
import { useEffect, useState } from 'react';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '@/lib/api';
import PlayerForm from '@/components/PlayerForm';
import Modal from '@/components/Modal';
import { Users, Pencil, Trash2, UserPlus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [modal, setModal]     = useState({ isOpen: false, type: 'confirm', title: '', message: '', onConfirm: null });
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) { router.push('/admin/login'); return; }
    load();
  }, [router]);

  function closeModal() { setModal(prev => ({ ...prev, isOpen: false })); }
  function showConfirm(title, message, onConfirm) { setModal({ isOpen: true, type: 'confirm', title, message, onConfirm }); }
  function showAlert(title, message, type) { setModal({ isOpen: true, type: type || 'info', title, message, onConfirm: null }); }

  async function load() {
    setLoading(true);
    try { setPlayers(await getPlayers()); }
    catch { showAlert('Error', 'Failed to load players', 'error'); }
    finally { setLoading(false); }
  }

  async function handlePlayer(data) {
    try {
      if (editing) {
        await updatePlayer(editing._id, data);
        showAlert('Updated', 'Player updated successfully', 'success');
        setEditing(null);
      } else {
        await createPlayer(data);
      }
      load();
    } catch (e) { showAlert('Error', e.message, 'error'); }
  }

  function delPlayer(id) {
    showConfirm('Delete Player', 'Remove this player permanently?', async () => {
      try { await deletePlayer(id); load(); }
      catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  const maleCount   = players.filter(p => p.gender === 'male').length;
  const femaleCount = players.filter(p => p.gender === 'female').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {/* Header */}
      <div>
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#4A4A5E' }}>Admin</p>
        <h1 className="text-[24px] font-bold" style={{ color: '#F4F4F6' }}>
          Players <span className="gradient-text">Management</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',  value: players.length, color: '#818CF8' },
          { label: 'Male',   value: maleCount,      color: '#60A5FA' },
          { label: 'Female', value: femaleCount,     color: '#F472B6' },
        ].map(s => (
          <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: '#16161E', border: '1px solid #1E1E2A' }}>
            <p className="text-[26px] font-bold leading-none" style={{ color: '#F4F4F6' }}>{s.value}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider mt-1" style={{ color: s.color, opacity: 0.8 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #1E1E2A', background: '#111118' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: editing ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)', border: editing ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(99,102,241,0.2)' }}>
            {editing ? <Pencil size={14} style={{ color: '#F59E0B' }} /> : <UserPlus size={14} style={{ color: '#818CF8' }} />}
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>{editing ? 'Edit Player' : 'Add New Player'}</p>
            <p className="text-[11px]" style={{ color: '#4A4A5E' }}>{editing ? 'Editing: ' + editing.name : 'Register a participant'}</p>
          </div>
        </div>
        <div className="p-5">
          <PlayerForm key={editing ? editing._id : 'new'} initialData={editing} onSubmit={handlePlayer} onCancel={editing ? () => setEditing(null) : null} />
        </div>
      </div>

      {/* Players list */}
      <div className="glass-card overflow-hidden" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1E1E2A', background: '#111118', flexShrink: 0 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Users size={14} style={{ color: '#818CF8' }} />
            </div>
            <p className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>All Players</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
              {players.length}
            </span>
            <button onClick={load} className="p-2 rounded-lg transition-all"
              style={{ color: '#4A4A5E', background: 'rgba(255,255,255,0.03)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#818CF8'}
              onMouseLeave={e => e.currentTarget.style.color = '#4A4A5E'}>
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Scrollable player list — fills remaining space */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {loading ? (
            <div className="p-5 space-y-2">
              {[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}
            </div>
          ) : players.length === 0 ? (
            <div className="py-14 text-center">
              <Users size={28} className="mx-auto mb-3" style={{ color: '#2A2A3A' }} />
              <p className="text-[13px] font-medium" style={{ color: '#4A4A5E' }}>No players yet</p>
              <p className="text-[11px] mt-1" style={{ color: '#2A2A3A' }}>Add your first player using the form above</p>
            </div>
          ) : (
            <div>
              {players.map((p, idx) => (
                <div key={p._id} className="group flex items-center gap-4 px-5 py-3.5 transition-colors"
                  style={{ borderBottom: '1px solid #1E1E2A' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span className="text-[11px] font-medium w-5 text-center flex-shrink-0 tabular-nums" style={{ color: '#2A2A3A' }}>{idx + 1}</span>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
                    style={{
                      background: p.gender === 'male' ? 'linear-gradient(135deg, #1d4ed8, #3B82F6)' : 'linear-gradient(135deg, #9d174d, #ec4899)',
                      color: '#fff',
                    }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: '#F4F4F6' }}>{p.name}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: p.gender === 'male' ? 'rgba(59,130,246,0.1)' : 'rgba(236,72,153,0.1)',
                      color: p.gender === 'male' ? '#93c5fd' : '#f9a8d4',
                      border: `1px solid ${p.gender === 'male' ? 'rgba(59,130,246,0.2)' : 'rgba(236,72,153,0.2)'}`,
                    }}>
                    {p.gender === 'male' ? '♂ Male' : '♀ Female'}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditing(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="p-2 rounded-lg transition-all"
                      style={{ color: '#818CF8', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => delPlayer(p._id)}
                      className="p-2 rounded-lg transition-all"
                      style={{ color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modal.isOpen} type={modal.type} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={closeModal} />
    </div>
  );
}
