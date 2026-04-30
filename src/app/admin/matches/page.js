'use client';
import { useEffect, useState } from 'react';
import {
  getMatches, getPlayers, updateMatchResult, clearMatches, advanceMatches,
  getTeams, createTeam, deleteTeam, generateMatchesFromTeams, generateMatches
} from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import Modal from '@/components/Modal';
import { Trophy, Trash2, Swords, Users, UserPlus, X, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MatchesPage() {
  const [matches, setMatches]   = useState([]);
  const [players, setPlayers]   = useState([]);
  const [teams, setTeams]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('single');
  const [playerA, setPlayerA]   = useState('');
  const [playerB, setPlayerB]   = useState('');
  const [modal, setModal]       = useState({ isOpen: false, type: 'confirm', title: '', message: '', onConfirm: null });
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) { router.push('/admin/login'); return; }
    loadAll();
  }, [filter, router]);

  function closeModal() { setModal(prev => ({ ...prev, isOpen: false })); }
  function showConfirm(title, message, onConfirm) { setModal({ isOpen: true, type: 'confirm', title, message, onConfirm }); }
  function showAlert(title, message, type) { setModal({ isOpen: true, type: type || 'info', title, message, onConfirm: null }); }

  async function loadAll() {
    setLoading(true);
    try {
      const [m, p, t] = await Promise.all([
        getMatches({ matchType: filter }),
        getPlayers(),
        filter !== 'single' ? getTeams(filter) : Promise.resolve([]),
      ]);
      setMatches(m);
      setPlayers(p);
      setTeams(t);
    } catch { showAlert('Error', 'Failed to load data', 'error'); }
    finally { setLoading(false); }
  }

  // ── Singles: auto-generate ──
  function genSingles() {
    showConfirm('Generate Singles', 'Generate singles matches? Existing ones will be cleared.', async () => {
      try { await generateMatches('single'); showAlert('Done', 'Singles matches generated', 'success'); loadAll(); }
      catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  // ── Doubles/Mixed: generate from manually created teams ──
  function genFromTeams() {
    if (teams.length < 2) { showAlert('Not enough teams', 'Add at least 2 teams before generating matches.', 'error'); return; }
    showConfirm('Generate Matches', `Generate ${filter} matches from ${teams.length} teams?`, async () => {
      try { const r = await generateMatchesFromTeams(filter); showAlert('Done', r.message, 'success'); loadAll(); }
      catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  // ── Add team ──
  async function handleAddTeam(e) {
    e.preventDefault();
    if (!playerA || !playerB || playerA === playerB) {
      showAlert('Invalid', 'Select two different players', 'error'); return;
    }
    try {
      await createTeam([playerA, playerB], filter);
      setPlayerA(''); setPlayerB('');
      loadAll();
    } catch (e) { showAlert('Error', e.message, 'error'); }
  }

  // ── Remove team ──
  function handleDeleteTeam(id) {
    showConfirm('Remove Team', 'Remove this team?', async () => {
      try { await deleteTeam(id); loadAll(); }
      catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  function clearAll() {
    showConfirm('Clear Matches', `Clear all ${filter} matches?`, async () => {
      try { await clearMatches(filter); showAlert('Cleared', 'Matches cleared.', 'success'); loadAll(); }
      catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  async function updateResult(id, data) {
    try { await updateMatchResult(id, data); loadAll(); }
    catch (e) { showAlert('Error', e.message, 'error'); }
  }

  function advance() {
    const rounds = [...new Set(matches.map(m => m.round))];
    const latest = rounds.length ? Math.max(...rounds) : 1;
    showConfirm('Advance Winners', `Advance Round ${latest} winners to Round ${latest + 1}?`, async () => {
      try { await advanceMatches(filter, latest); showAlert('Done', 'Winners advanced.', 'success'); loadAll(); }
      catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  const liveCount = matches.filter(m => m.status === 'live').length;
  const doneCount = matches.filter(m => m.status === 'completed').length;

  // Players already in a team for this category
  const pairedIds = new Set(teams.flatMap(t => t.players?.map(p => p._id || p) || []));

  // Filter available players for doubles/mixed
  const availablePlayers = players.filter(p => !pairedIds.has(p._id));
  const availableA = filter === 'mixed'
    ? availablePlayers.filter(p => p.gender === 'male')
    : availablePlayers;
  const availableB = filter === 'mixed'
    ? availablePlayers.filter(p => p.gender === 'female')
    : availablePlayers.filter(p => p._id !== playerA);

  const TYPES = [
    { value: 'single', label: 'Singles',        desc: 'Gender-based 1v1' },
    { value: 'double', label: 'Doubles (Open)', desc: 'Any 2-player team' },
    { value: 'mixed',  label: 'Mixed Doubles',  desc: '1 Male + 1 Female' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#4A4A5E' }}>Admin</p>
        <h1 className="text-[24px] font-bold" style={{ color: '#F4F4F6' }}>
          Matches <span className="gradient-text">Management</span>
        </h1>
      </div>

      {/* Match type selector */}
      <div className="glass-card p-5">
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color: '#4A4A5E' }}>Match Type</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TYPES.map(t => {
            const active = filter === t.value;
            return (
              <button key={t.value} onClick={() => setFilter(t.value)}
                className="text-left px-4 py-3 rounded-xl transition-all"
                style={{ background: active ? 'rgba(99,102,241,0.1)' : '#111118', border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid #1E1E2A' }}>
                <p className="text-[13px] font-semibold mb-0.5" style={{ color: active ? '#818CF8' : '#F4F4F6' }}>{t.label}</p>
                <p className="text-[11px]" style={{ color: '#4A4A5E' }}>{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SINGLES: just generate ── */}
      {filter === 'single' && (
        <div className="glass-card p-5">
          <p className="text-[13px] font-semibold mb-1" style={{ color: '#F4F4F6' }}>Singles Matches</p>
          <p className="text-[12px] mb-4" style={{ color: '#4A4A5E' }}>
            Auto-generates 1v1 brackets grouped by gender (Male & Female separately).
          </p>
          <div className="flex gap-3">
            <button onClick={genSingles} className="btn-primary flex items-center gap-2 py-2.5 px-5">
              <Play size={14} /> Generate Round 1
            </button>
            <button onClick={advance} className="btn-secondary flex items-center gap-2 py-2.5 px-5">
              <Trophy size={14} /> Advance Winners
            </button>
            <button onClick={clearAll} className="btn-danger flex items-center gap-2 py-2.5 px-5">
              <Trash2 size={14} /> Clear All
            </button>
          </div>
        </div>
      )}

      {/* ── DOUBLES / MIXED: manual team builder ── */}
      {filter !== 'single' && (
        <>
          {/* Add team form */}
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: '1px solid #1E1E2A', background: '#111118' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <UserPlus size={14} style={{ color: '#818CF8' }} />
              </div>
              <div>
                <p className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>
                  Add {filter === 'mixed' ? 'Mixed' : 'Doubles'} Team
                </p>
                <p className="text-[11px]" style={{ color: '#4A4A5E' }}>
                  {filter === 'mixed' ? 'Select 1 Male + 1 Female player' : 'Select any 2 players'}
                </p>
              </div>
            </div>
            <form onSubmit={handleAddTeam} className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: '#4A4A5E' }}>
                    {filter === 'mixed' ? 'Male Player' : 'Player 1'}
                  </label>
                  <select value={playerA} onChange={e => setPlayerA(e.target.value)} className="input-field" required>
                    <option value="">Select player...</option>
                    {availableA.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.gender})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: '#4A4A5E' }}>
                    {filter === 'mixed' ? 'Female Player' : 'Player 2'}
                  </label>
                  <select value={playerB} onChange={e => setPlayerB(e.target.value)} className="input-field" required>
                    <option value="">Select player...</option>
                    {availableB.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.gender})</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2 py-2.5 px-6">
                <Users size={15} /> Add Team
              </button>
            </form>
          </div>

          {/* Teams list */}
          {teams.length > 0 && (
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid #1E1E2A', background: '#111118' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <Users size={14} style={{ color: '#818CF8' }} />
                  </div>
                  <p className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>
                    {filter === 'mixed' ? 'Mixed' : 'Doubles'} Teams
                  </p>
                </div>
                <span className="text-[12px] font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
                  {teams.length}
                </span>
              </div>
              <div>
                {teams.map((team, idx) => (
                  <div key={team._id}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                    style={{ borderBottom: '1px solid #1E1E2A' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span className="text-[11px] font-medium w-5 text-center flex-shrink-0"
                      style={{ color: '#2A2A3A' }}>{idx + 1}</span>
                    <div className="flex-1 flex items-center gap-3">
                      {team.players?.map((p, i) => (
                        <span key={p._id || i}>
                          <span className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>{p.name}</span>
                          <span className="text-[10px] ml-1" style={{ color: p.gender === 'male' ? '#93c5fd' : '#f9a8d4' }}>
                            {p.gender === 'male' ? '♂' : '♀'}
                          </span>
                          {i === 0 && <span className="mx-2 text-[11px]" style={{ color: '#2A2A3A' }}>&</span>}
                        </span>
                      ))}
                    </div>
                    <button onClick={() => handleDeleteTeam(team._id)}
                      className="p-2 rounded-lg transition-all flex-shrink-0"
                      style={{ color: '#F87171', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate + actions */}
          <div className="flex flex-wrap gap-3">
            <button onClick={genFromTeams} className="btn-primary flex items-center gap-2 py-2.5 px-5"
              disabled={teams.length < 2}>
              <Play size={14} /> Generate Round 1 ({teams.length} teams)
            </button>
            <button onClick={advance} className="btn-secondary flex items-center gap-2 py-2.5 px-5">
              <Trophy size={14} /> Advance Winners
            </button>
            <button onClick={clearAll} className="btn-danger flex items-center gap-2 py-2.5 px-5">
              <Trash2 size={14} /> Clear Matches
            </button>
          </div>
        </>
      )}

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
              <span className="badge badge-live flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full pulse-badge" style={{ background: '#F87171' }} />
                {liveCount} Live
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map(m => (
              <MatchCard key={m._id} match={m} showActions={true} onUpdateResult={updateResult} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl py-14 text-center" style={{ background: '#16161E', border: '1px solid #1E1E2A' }}>
          <Swords size={28} className="mx-auto mb-3" style={{ color: '#2A2A3A' }} />
          <p className="text-[13px] font-medium" style={{ color: '#4A4A5E' }}>No matches yet</p>
          <p className="text-[11px] mt-1" style={{ color: '#2A2A3A' }}>
            {filter === 'single' ? 'Click Generate Round 1' : 'Add teams above then click Generate Round 1'}
          </p>
        </div>
      )}

      <Modal isOpen={modal.isOpen} type={modal.type} title={modal.title} message={modal.message}
        onConfirm={modal.onConfirm} onClose={closeModal} />
    </div>
  );
}
