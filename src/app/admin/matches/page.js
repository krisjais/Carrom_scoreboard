'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  getMatches, getPlayers, updateMatchResult, clearMatches, advanceMatches,
  getTeams, createTeam, deleteTeam, generateMatchesFromTeams, generateMatches,
  reshuffleTeams, resolveConflict
} from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import Modal from '@/components/Modal';
import { Trophy, Trash2, Swords, Users, UserPlus, X, Play, ArrowLeftRight, AlertTriangle, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ── Searchable player picker ──────────────────────────
function SearchablePlayerSelect({ players, value, onChange, placeholder }) {
  const [query, setQuery]       = useState('');
  const [open, setOpen]         = useState(false);
  const containerRef            = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const selected = players.find(p => p._id === value);
  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  // Calculate dropdown position relative to viewport
  function updateDropdownPos() {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }

  useEffect(() => {
    if (open) updateDropdownPos();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => updateDropdownPos();
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Input */}
      <div style={{ position: 'relative' }}>
        <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4A4A5E', pointerEvents: 'none' }} />
        <input
          type="text"
          className="input-field"
          style={{ paddingLeft: '34px', paddingRight: selected ? '60px' : '12px' }}
          placeholder={placeholder || 'Search player...'}
          value={open ? query : (selected ? selected.name : '')}
          onChange={e => { setQuery(e.target.value); setOpen(true); updateDropdownPos(); }}
          onFocus={() => { setOpen(true); setQuery(''); updateDropdownPos(); }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          autoComplete="off"
        />
        {selected && !open && (
          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: selected.gender === 'male' ? 'rgba(59,130,246,0.1)' : 'rgba(236,72,153,0.1)',
              color: selected.gender === 'male' ? '#93c5fd' : '#f9a8d4',
            }}>
            {selected.gender === 'male' ? '♂' : '♀'}
          </span>
        )}
        {selected && (
          <button type="button" onClick={() => { onChange(''); setQuery(''); }}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#4A4A5E', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
            onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
            onMouseLeave={e => e.currentTarget.style.color = '#4A4A5E'}>
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown — rendered via portal to escape overflow:hidden */}
      {open && typeof window !== 'undefined' && createPortal(
        <div style={{
          ...dropdownStyle,
          background: '#16161E',
          border: '1px solid #2A2A3A',
          borderRadius: '10px',
          maxHeight: '240px',
          overflowY: 'auto',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }}>
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-[12px]" style={{ color: '#4A4A5E' }}>No players found</div>
          ) : (
            filtered.map(p => (
              <button key={p._id} type="button"
                onMouseDown={() => { onChange(p._id); setQuery(''); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{ background: value === p._id ? 'rgba(99,102,241,0.1)' : 'transparent', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => { if (value !== p._id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (value !== p._id) e.currentTarget.style.background = 'transparent'; }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{
                    background: p.gender === 'male' ? 'linear-gradient(135deg, #1d4ed8, #3B82F6)' : 'linear-gradient(135deg, #9d174d, #ec4899)',
                    color: '#fff',
                  }}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <p className="text-[13px] font-semibold flex-1 truncate text-left" style={{ color: value === p._id ? '#818CF8' : '#F4F4F6' }}>
                  {p.name}
                </p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: p.gender === 'male' ? 'rgba(59,130,246,0.1)' : 'rgba(236,72,153,0.1)',
                    color: p.gender === 'male' ? '#93c5fd' : '#f9a8d4',
                  }}>
                  {p.gender === 'male' ? '♂' : '♀'}
                </span>
              </button>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

export default function MatchesPage() {
  const [matches, setMatches]         = useState([]);
  const [players, setPlayers]         = useState([]);
  const [teams, setTeams]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('single');
  const [playerA, setPlayerA]         = useState('');
  const [playerB, setPlayerB]         = useState('');
  const [modal, setModal]             = useState({ isOpen: false, type: 'confirm', title: '', message: '', onConfirm: null });
  // Reshuffle state
  const [reshuffleOpen, setReshuffleOpen] = useState(false);
  const [rTeamA, setRTeamA]           = useState('');
  const [rTeamB, setRTeamB]           = useState('');
  const [rPlayerA, setRPlayerA]       = useState('');
  const [rPlayerB, setRPlayerB]       = useState('');
  // Conflict resolution state
  const [conflict, setConflict]       = useState(null); // holds conflict data from API
  const [selectedReplacement, setSelectedReplacement] = useState('');
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
      try {
        const result = await advanceMatches(filter, latest);
        // Check if conflict was detected
        if (result.conflict) {
          setConflict({ ...result, round: latest });
          setSelectedReplacement('');
        } else {
          showAlert('Done', result.message, 'success');
          loadAll();
        }
      } catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  async function handleResolveConflict() {
    if (!selectedReplacement) { showAlert('Select', 'Please select a replacement player', 'error'); return; }
    try {
      const result = await resolveConflict(
        conflict.matchType,
        conflict.round,
        conflict.rank2Team.id,
        conflict.commonPlayers[0]._id,
        selectedReplacement
      );
      setConflict(null);
      setSelectedReplacement('');
      showAlert('Done', result.message, 'success');
      loadAll();
    } catch (e) { showAlert('Error', e.message, 'error'); }
  }

  const liveCount = matches.filter(m => m.status === 'live').length;
  const doneCount = matches.filter(m => m.status === 'completed').length;

  // A player CAN be in multiple teams — no pairedIds restriction
  // BUT players who have played 3 matches are ineligible (shown greyed out)
  // Only filter by gender for mixed doubles, and prevent same player in both slots
  const eligiblePlayers = players.filter(p => p.eligible !== false); // eligible = true or undefined
  const ineligiblePlayers = players.filter(p => p.eligible === false);

  const availableA = filter === 'mixed'
    ? eligiblePlayers.filter(p => p.gender === 'male')
    : eligiblePlayers;
  const availableB = filter === 'mixed'
    ? eligiblePlayers.filter(p => p.gender === 'female')
    : eligiblePlayers.filter(p => p._id !== playerA);

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
          <div className="glass-card" style={{ overflow: 'visible' }}>
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
              {/* Show ineligible count */}
              {ineligiblePlayers.length > 0 && (
                <div className="mb-4 px-3 py-2.5 rounded-lg flex items-center gap-2 text-[11px]"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#F87171' }}>
                  <span>⚠️</span>
                  {ineligiblePlayers.length} player{ineligiblePlayers.length > 1 ? 's' : ''} hidden — already played 3 matches ({ineligiblePlayers.map(p => p.name).join(', ')})
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: '#4A4A5E' }}>
                    {filter === 'mixed' ? 'Male Player' : 'Player 1'}
                  </label>
                  <SearchablePlayerSelect
                    players={availableA}
                    value={playerA}
                    onChange={setPlayerA}
                    placeholder={`Search ${filter === 'mixed' ? 'male' : ''} player...`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: '#4A4A5E' }}>
                    {filter === 'mixed' ? 'Female Player' : 'Player 2'}
                  </label>
                  <SearchablePlayerSelect
                    players={availableB}
                    value={playerB}
                    onChange={setPlayerB}
                    placeholder={`Search ${filter === 'mixed' ? 'female' : ''} player...`}
                  />
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
            <button onClick={() => setReshuffleOpen(!reshuffleOpen)}
              className="flex items-center gap-2 py-2.5 px-5 rounded-lg font-semibold text-[13px] transition-all"
              style={{
                background: reshuffleOpen ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                border: reshuffleOpen ? '1px solid rgba(245,158,11,0.3)' : '1px solid #1E1E2A',
                color: reshuffleOpen ? '#F59E0B' : '#4A4A5E',
              }}>
              <ArrowLeftRight size={14} /> Reshuffle Teams
            </button>
            <button onClick={clearAll} className="btn-danger flex items-center gap-2 py-2.5 px-5">
              <Trash2 size={14} /> Clear Matches
            </button>
          </div>

          {/* ── Reshuffle panel ── */}
          {reshuffleOpen && teams.length >= 2 && (
            <div className="glass-card overflow-hidden">
              <div className="px-5 py-4 flex items-center gap-3"
                style={{ borderBottom: '1px solid #1E1E2A', background: '#111118' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <ArrowLeftRight size={14} style={{ color: '#F59E0B' }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>Reshuffle / Swap Players</p>
                  <p className="text-[11px]" style={{ color: '#4A4A5E' }}>
                    Swap one player from Team A with one player from Team B
                  </p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Team A */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
                      Team A
                    </label>
                    <select value={rTeamA} onChange={e => { setRTeamA(e.target.value); setRPlayerA(''); }} className="input-field">
                      <option value="">Select team...</option>
                      {teams.map(t => (
                        <option key={t._id} value={t._id}>
                          {t.players?.map(p => p.name).join(' & ')}
                        </option>
                      ))}
                    </select>
                    {rTeamA && (
                      <div className="mt-2">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
                          Player to move out of Team A
                        </label>
                        <select value={rPlayerA} onChange={e => setRPlayerA(e.target.value)} className="input-field">
                          <option value="">Select player...</option>
                          {teams.find(t => t._id === rTeamA)?.players?.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Team B */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
                      Team B
                    </label>
                    <select value={rTeamB} onChange={e => { setRTeamB(e.target.value); setRPlayerB(''); }} className="input-field">
                      <option value="">Select team...</option>
                      {teams.filter(t => t._id !== rTeamA).map(t => (
                        <option key={t._id} value={t._id}>
                          {t.players?.map(p => p.name).join(' & ')}
                        </option>
                      ))}
                    </select>
                    {rTeamB && (
                      <div className="mt-2">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#4A4A5E' }}>
                          Player to move out of Team B
                        </label>
                        <select value={rPlayerB} onChange={e => setRPlayerB(e.target.value)} className="input-field">
                          <option value="">Select player...</option>
                          {teams.find(t => t._id === rTeamB)?.players?.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                {rTeamA && rTeamB && rPlayerA && rPlayerB && (() => {
                  const tA = teams.find(t => t._id === rTeamA);
                  const tB = teams.find(t => t._id === rTeamB);
                  const pA = tA?.players?.find(p => p._id === rPlayerA);
                  const pB = tB?.players?.find(p => p._id === rPlayerB);
                  const newA = tA?.players?.filter(p => p._id !== rPlayerA).map(p => p.name).concat(pB?.name).join(' & ');
                  const newB = tB?.players?.filter(p => p._id !== rPlayerB).map(p => p.name).concat(pA?.name).join(' & ');
                  return (
                    <div className="rounded-lg p-3 text-[12px]"
                      style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                      <p className="font-semibold mb-2" style={{ color: '#F59E0B' }}>After swap:</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span style={{ color: '#F4F4F6' }}>Team A → <strong>{newA}</strong></span>
                        <ArrowLeftRight size={12} style={{ color: '#F59E0B' }} />
                        <span style={{ color: '#F4F4F6' }}>Team B → <strong>{newB}</strong></span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  disabled={!rTeamA || !rTeamB || !rPlayerA || !rPlayerB}
                  onClick={async () => {
                    try {
                      const r = await reshuffleTeams(rTeamA, rTeamB, rPlayerA, rPlayerB);
                      showAlert('Done', r.message, 'success');
                      setRTeamA(''); setRTeamB(''); setRPlayerA(''); setRPlayerB('');
                      setReshuffleOpen(false);
                      loadAll();
                    } catch (e) { showAlert('Error', e.message, 'error'); }
                  }}
                  className="btn-primary flex items-center gap-2 py-2.5 px-6"
                  style={{ background: 'linear-gradient(135deg, #d97706, #F59E0B)' }}>
                  <ArrowLeftRight size={14} /> Confirm Swap
                </button>
              </div>
            </div>
          )}
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

      {/* ── Common Player Conflict Resolution Modal ── */}
      {conflict && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden animate-fade-in"
            style={{ background: '#16161E', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>

            {/* Header */}
            <div className="px-6 py-5 flex items-center gap-3"
              style={{ borderBottom: '1px solid #1E1E2A', background: 'rgba(245,158,11,0.06)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <p className="text-[15px] font-bold" style={{ color: '#F4F4F6' }}>Common Player Conflict</p>
                <p className="text-[11px]" style={{ color: '#F59E0B' }}>Requires resolution before advancing</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Explanation */}
              <div className="rounded-xl p-4 text-[12px] leading-relaxed"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', color: '#D4A017' }}>
                <strong style={{ color: '#F59E0B' }}>
                  {conflict.commonPlayers.map(p => p.name).join(', ')}
                </strong> is in both the <strong>1st place</strong> and <strong>2nd place</strong> teams.
                <br /><br />
                This player will stay with the <strong>1st place team</strong>. The 2nd place team needs a replacement player from the <strong>3rd place team</strong>.
              </div>

              {/* Teams display */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#4ADE80' }}>🥇 1st Place (keeps player)</p>
                  {conflict.rank1Team.players.map(p => (
                    <p key={p._id} className="text-[12px] font-semibold" style={{ color: '#F4F4F6' }}>
                      {p.name}
                      {conflict.commonPlayers.some(cp => cp._id === p._id) && (
                        <span className="ml-1 text-[10px]" style={{ color: '#4ADE80' }}>✓ stays</span>
                      )}
                    </p>
                  ))}
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#F87171' }}>🥈 2nd Place (needs replacement)</p>
                  {conflict.rank2Team.players.map(p => (
                    <p key={p._id} className="text-[12px] font-semibold" style={{ color: conflict.commonPlayers.some(cp => cp._id === p._id) ? '#F87171' : '#F4F4F6' }}>
                      {p.name}
                      {conflict.commonPlayers.some(cp => cp._id === p._id) && (
                        <span className="ml-1 text-[10px]" style={{ color: '#F87171' }}>✗ removed</span>
                      )}
                    </p>
                  ))}
                </div>
              </div>

              {/* Replacement picker */}
              {conflict.rank3Team ? (
                <div>
                  <p className="text-[12px] font-semibold mb-2" style={{ color: '#F4F4F6' }}>
                    Choose replacement from 🥉 3rd place team:
                  </p>
                  <div className="flex gap-2">
                    {conflict.rank3Team.players.map(p => (
                      <button key={p._id}
                        onClick={() => setSelectedReplacement(p._id)}
                        className="flex-1 py-3 rounded-xl text-[13px] font-bold transition-all"
                        style={{
                          background: selectedReplacement === p._id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                          border: selectedReplacement === p._id ? '1px solid rgba(99,102,241,0.4)' : '1px solid #1E1E2A',
                          color: selectedReplacement === p._id ? '#818CF8' : '#8B8B9E',
                        }}>
                        {p.name}
                        <p className="text-[10px] font-normal mt-0.5" style={{ color: selectedReplacement === p._id ? 'rgba(129,140,248,0.6)' : '#3A3A52' }}>
                          {p.gender === 'male' ? '♂ Male' : '♀ Female'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-3 text-[12px]" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
                  No 3rd place team available. Please manually reshuffle the 2nd place team before advancing.
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => { setConflict(null); setSelectedReplacement(''); }}
                  className="btn-secondary flex-1 py-2.5">
                  Cancel
                </button>
                {conflict.rank3Team && (
                  <button onClick={handleResolveConflict}
                    disabled={!selectedReplacement}
                    className="btn-primary flex-1 py-2.5"
                    style={{ opacity: selectedReplacement ? 1 : 0.4 }}>
                    Confirm & Advance
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
