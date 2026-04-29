'use client';
import { useEffect, useState } from 'react';
import {
  getPlayers, createPlayer, updatePlayer, deletePlayer,
  getMatches, generateMatches, updateMatchResult, clearMatches, advanceMatches
} from '@/lib/api';
import PlayerForm from '@/components/PlayerForm';
import MatchCard from '@/components/MatchCard';
import Modal from '@/components/Modal';
import {
  Dices, Trophy,
  Trash2, Users, Pencil, Swords, RefreshCw, UserPlus, ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tab, setTab]         = useState('players');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('single');
  const [editing, setEditing] = useState(null);
  const [modal, setModal]     = useState({
    isOpen: false, type: 'confirm', title: '', message: '', onConfirm: null
  });
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      router.push('/admin/login');
      return;
    }
    load();
  }, [filter, router]);

  function closeModal() {
    setModal(prev => ({ ...prev, isOpen: false }));
  }

  function showConfirm(title, message, onConfirm) {
    setModal({ isOpen: true, type: 'confirm', title, message, onConfirm });
  }

  function showAlert(title, message, type) {
    setModal({ isOpen: true, type: type || 'info', title, message, onConfirm: null });
  }

  async function load() {
    setLoading(true);
    try {
      const [p, m] = await Promise.all([
        getPlayers(),
        getMatches({ matchType: filter })
      ]);
      setPlayers(p);
      setMatches(m);
    } catch (e) {
      showAlert('Error', 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
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
    } catch (e) {
      showAlert('Error', e.message, 'error');
    }
  }

  function delPlayer(id) {
    showConfirm('Delete Player', 'Remove this player permanently?', async () => {
      try {
        await deletePlayer(id);
        load();
      } catch (e) {
        showAlert('Error', e.message, 'error');
      }
    });
  }

  function genMatches() {
    showConfirm('Generate Matches', 'Generate ' + filter + ' matches? Existing ones will be cleared.', async () => {
      try {
        const r = await generateMatches(filter);
        showAlert('Done', r.message, 'success');
        load();
      } catch (e) {
        showAlert('Error', e.message, 'error');
      }
    });
  }

  function clearAll() {
    showConfirm('Clear Matches', 'Clear all ' + filter + ' matches?', async () => {
      try {
        await clearMatches(filter);
        showAlert('Cleared', 'Matches cleared.', 'success');
        load();
      } catch (e) {
        showAlert('Error', e.message, 'error');
      }
    });
  }

  async function updateResult(id, data) {
    try {
      await updateMatchResult(id, data);
      load();
    } catch (e) {
      showAlert('Error', e.message, 'error');
    }
  }

  function advance() {
    const rounds = [...new Set(matches.map(m => m.round))];
    const latest = rounds.length ? Math.max(...rounds) : 1;
    showConfirm('Advance Winners', 'Advance Round ' + latest + ' winners to Round ' + (latest + 1) + '?', async () => {
      try {
        await advanceMatches(filter, latest);
        showAlert('Done', 'Winners advanced.', 'success');
        load();
      } catch (e) {
        showAlert('Error', e.message, 'error');
      }
    });
  }

  const maleCount   = players.filter(p => p.gender === 'male').length;
  const femaleCount = players.filter(p => p.gender === 'female').length;
  const liveCount   = matches.filter(m => m.status === 'live').length;
  const doneCount   = matches.filter(m => m.status === 'completed').length;

  const MATCH_TYPES = [
    { value: 'single', label: 'Singles',        desc: 'Gender-based 1v1' },
    { value: 'double', label: 'Doubles (Open)', desc: 'Any 2-player team' },
    { value: 'mixed',  label: 'Mixed Doubles',  desc: '1 Male + 1 Female' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck size={13} style={{ color: '#818CF8' }} />
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#4A4A5E' }}>
            Control Panel
          </p>
        </div>
        <h1 className="text-[24px] font-bold leading-tight" style={{ color: '#F4F4F6' }}>
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Players', value: players.length, color: '#6366F1', sub: maleCount + 'M · ' + femaleCount + 'F' },
          { label: 'Live Matches',  value: liveCount,      color: '#EF4444', sub: 'In progress' },
          { label: 'Completed',     value: doneCount,      color: '#22C55E', sub: 'Finished' },
          { label: 'Total Matches', value: matches.length, color: '#818CF8', sub: filter + ' type' },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl px-4 py-3.5"
            style={{ background: '#16161E', border: '1px solid #1E1E2A' }}
          >
            <p className="text-[28px] font-bold leading-none mb-1" style={{ color: '#F4F4F6' }}>{s.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4A4A5E' }}>{s.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: s.color, opacity: 0.7 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-lg w-fit"
        style={{ background: '#111118', border: '1px solid #1E1E2A' }}
      >
        {[
          { id: 'players', label: 'Players', icon: Users },
          { id: 'matches', label: 'Matches', icon: Swords },
        ].map(function(t) {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[13px] transition-all"
              style={active
                ? { background: '#6366F1', color: '#fff' }
                : { color: '#4A4A5E' }
              }
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Players Tab */}
      {tab === 'players' && (
        <div className="space-y-4">

          {/* Add / Edit form */}
          <div className="glass-card overflow-hidden">
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: '1px solid #1E1E2A', background: '#111118' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: editing ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)',
                  border: editing ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(99,102,241,0.2)',
                }}
              >
                {editing
                  ? <Pencil size={14} style={{ color: '#F59E0B' }} />
                  : <UserPlus size={14} style={{ color: '#818CF8' }} />
                }
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>
                  {editing ? 'Edit Player' : 'Add New Player'}
                </p>
                <p className="text-[11px]" style={{ color: '#4A4A5E' }}>
                  {editing ? 'Editing: ' + editing.name : 'Register a participant'}
                </p>
              </div>
            </div>
            <div className="p-5">
              <PlayerForm
                key={editing ? editing._id : 'new'}
                initialData={editing}
                onSubmit={handlePlayer}
                onCancel={editing ? () => setEditing(null) : null}
              />
            </div>
          </div>

          {/* Players list */}
          <div className="glass-card overflow-hidden">
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid #1E1E2A', background: '#111118' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  <Users size={14} style={{ color: '#818CF8' }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>All Players</p>
                  <p className="text-[11px]" style={{ color: '#4A4A5E' }}>Registered participants</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[12px] font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}
                >
                  {players.length}
                </span>
                <button
                  onClick={load}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: '#4A4A5E', background: 'rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#818CF8'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4A4A5E'; }}
                  title="Refresh"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

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
                  <div
                    key={p._id}
                    className="group flex items-center gap-4 px-5 py-3.5 transition-colors"
                    style={{ borderBottom: '1px solid #1E1E2A' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span
                      className="text-[11px] font-medium w-5 text-center flex-shrink-0 tabular-nums"
                      style={{ color: '#2A2A3A' }}
                    >
                      {idx + 1}
                    </span>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[13px] font-bold"
                      style={{
                        background: p.gender === 'male'
                          ? 'linear-gradient(135deg, #1d4ed8, #3B82F6)'
                          : 'linear-gradient(135deg, #9d174d, #ec4899)',
                        color: '#fff',
                      }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold truncate" style={{ color: '#F4F4F6' }}>
                        {p.name}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{
                        background: p.gender === 'male' ? 'rgba(59,130,246,0.1)' : 'rgba(236,72,153,0.1)',
                        color: p.gender === 'male' ? '#93c5fd' : '#f9a8d4',
                        border: '1px solid ' + (p.gender === 'male' ? 'rgba(59,130,246,0.2)' : 'rgba(236,72,153,0.2)'),
                      }}
                    >
                      {p.gender === 'male' ? '♂ Male' : '♀ Female'}
                    </span>
                    <div
                      className="flex items-center gap-1.5 flex-shrink-0"
                      style={{ opacity: 0, transition: 'opacity 0.15s' }}
                      ref={el => { if (el) el.closest('.group').addEventListener('mouseenter', () => { el.style.opacity = '1'; }); if (el) el.closest('.group').addEventListener('mouseleave', () => { el.style.opacity = '0'; }); }}
                    >
                      <button
                        onClick={() => { setEditing(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="p-2 rounded-lg"
                        style={{ color: '#818CF8', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => delPlayer(p._id)}
                        className="p-2 rounded-lg"
                        style={{ color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {tab === 'matches' && (
        <div className="space-y-4">

          {/* Config card */}
          <div className="glass-card p-5">
            <p
              className="text-[10px] uppercase tracking-widest font-semibold mb-4"
              style={{ color: '#4A4A5E' }}
            >
              Match Type
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {MATCH_TYPES.map(function(t) {
                const active = filter === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setFilter(t.value)}
                    className="text-left px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: active ? 'rgba(99,102,241,0.1)' : '#111118',
                      border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid #1E1E2A',
                    }}
                  >
                    <p
                      className="text-[13px] font-semibold mb-0.5"
                      style={{ color: active ? '#818CF8' : '#F4F4F6' }}
                    >
                      {t.label}
                    </p>
                    <p className="text-[11px]" style={{ color: '#4A4A5E' }}>{t.desc}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={genMatches}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5"
              >
                <Dices size={15} /> Generate Round 1
              </button>
              <button
                onClick={advance}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5"
              >
                <Trophy size={14} /> Advance Winners
              </button>
              <button
                onClick={clearAll}
                className="btn-danger flex items-center justify-center gap-2 py-2.5 px-5"
              >
                <Trash2 size={14} /> Clear All
              </button>
            </div>
          </div>

          {/* Match list */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}
            </div>
          ) : matches.length > 0 ? (
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: '#F4F4F6' }}>
                    {filter === 'single' ? 'Singles' : filter === 'double' ? 'Doubles' : 'Mixed'} Matches
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#4A4A5E' }}>
                    {matches.length} total · {liveCount} live · {doneCount} done
                  </p>
                </div>
                {liveCount > 0 && (
                  <span
                    className="badge badge-live flex items-center gap-1.5"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full pulse-badge"
                      style={{ background: '#F87171' }}
                    />
                    {liveCount} Live
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map(m => (
                  <MatchCard
                    key={m._id}
                    match={m}
                    showActions={true}
                    onUpdateResult={updateResult}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl py-14 text-center"
              style={{ background: '#16161E', border: '1px solid #1E1E2A' }}
            >
              <Dices size={28} className="mx-auto mb-3" style={{ color: '#2A2A3A' }} />
              <p className="text-[13px] font-medium" style={{ color: '#4A4A5E' }}>No matches generated</p>
              <p className="text-[11px] mt-1" style={{ color: '#2A2A3A' }}>
                Select a type above and click Generate Round 1
              </p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onClose={closeModal}
      />
    </div>
  );
}
