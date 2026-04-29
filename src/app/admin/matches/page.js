'use client';
import { useEffect, useState } from 'react';
import { getMatches, generateMatches, updateMatchResult, clearMatches, advanceMatches } from '@/lib/api';
import MatchCard from '@/components/MatchCard';
import Modal from '@/components/Modal';
import { Dices, Trophy, Trash2, Swords } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('single');
  const [modal, setModal]     = useState({ isOpen: false, type: 'confirm', title: '', message: '', onConfirm: null });
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) { router.push('/admin/login'); return; }
    load();
  }, [filter, router]);

  function closeModal() { setModal(prev => ({ ...prev, isOpen: false })); }
  function showConfirm(title, message, onConfirm) { setModal({ isOpen: true, type: 'confirm', title, message, onConfirm }); }
  function showAlert(title, message, type) { setModal({ isOpen: true, type: type || 'info', title, message, onConfirm: null }); }

  async function load() {
    setLoading(true);
    try { setMatches(await getMatches({ matchType: filter })); }
    catch { showAlert('Error', 'Failed to load matches', 'error'); }
    finally { setLoading(false); }
  }

  function genMatches() {
    showConfirm('Generate Matches', 'Generate ' + filter + ' matches? Existing ones will be cleared.', async () => {
      try { const r = await generateMatches(filter); showAlert('Done', r.message, 'success'); load(); }
      catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  function clearAll() {
    showConfirm('Clear Matches', 'Clear all ' + filter + ' matches?', async () => {
      try { await clearMatches(filter); showAlert('Cleared', 'Matches cleared.', 'success'); load(); }
      catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  async function updateResult(id, data) {
    try { await updateMatchResult(id, data); load(); }
    catch (e) { showAlert('Error', e.message, 'error'); }
  }

  function advance() {
    const rounds = [...new Set(matches.map(m => m.round))];
    const latest = rounds.length ? Math.max(...rounds) : 1;
    showConfirm('Advance Winners', 'Advance Round ' + latest + ' winners to Round ' + (latest + 1) + '?', async () => {
      try { await advanceMatches(filter, latest); showAlert('Done', 'Winners advanced.', 'success'); load(); }
      catch (e) { showAlert('Error', e.message, 'error'); }
    });
  }

  const liveCount = matches.filter(m => m.status === 'live').length;
  const doneCount = matches.filter(m => m.status === 'completed').length;

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

      {/* Config card */}
      <div className="glass-card p-5">
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color: '#4A4A5E' }}>Match Type</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
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
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={genMatches} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
            <Dices size={15} /> Generate Round 1
          </button>
          <button onClick={advance} className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5">
            <Trophy size={14} /> Advance Winners
          </button>
          <button onClick={clearAll} className="btn-danger flex items-center justify-center gap-2 py-2.5 px-5">
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
              <span className="badge badge-live flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full pulse-badge" style={{ background: '#F87171' }} />
                {liveCount} Live
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map(m => <MatchCard key={m._id} match={m} showActions={true} onUpdateResult={updateResult} />)}
          </div>
        </div>
      ) : (
        <div className="rounded-xl py-14 text-center" style={{ background: '#16161E', border: '1px solid #1E1E2A' }}>
          <Swords size={28} className="mx-auto mb-3" style={{ color: '#2A2A3A' }} />
          <p className="text-[13px] font-medium" style={{ color: '#4A4A5E' }}>No matches generated</p>
          <p className="text-[11px] mt-1" style={{ color: '#2A2A3A' }}>Select a type above and click Generate Round 1</p>
        </div>
      )}

      <Modal isOpen={modal.isOpen} type={modal.type} title={modal.title} message={modal.message} onConfirm={modal.onConfirm} onClose={closeModal} />
    </div>
  );
}
