'use client';
import { useEffect, useState } from 'react';
import { Trophy, User, Users, HeartHandshake, RefreshCw } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const MEDALS = ['🥇', '🥈', '🥉'];

const TABS = [
  { key: 'single', label: 'Singles',       icon: User,           color: '#60A5FA' },
  { key: 'double', label: 'Doubles',       icon: Users,          color: '#C9A84C' },
  { key: 'mixed',  label: 'Mixed Doubles', icon: HeartHandshake, color: '#F472B6' },
];

export default function LeaderboardPage() {
  const [tab, setTab]         = useState('single');
  const [data, setData]       = useState({ single: [], double: [], mixed: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/leaderboard?type=all`);
      if (!res.ok) throw new Error('Failed to load');
      const json = await res.json();
      setData({
        single: json.singles || [],
        double: json.doubles || [],
        mixed:  json.mixed   || [],
      });
    } catch (e) {
      setError('Could not load leaderboard. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const board      = data[tab] || [];
  const activeTab  = TABS.find(t => t.key === tab);
  const accentColor = activeTab?.color || '#C9A84C';

  return (
    <div className="w-full space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#4A4A5E' }}>Rankings</p>
          <h1 className="text-[26px] font-bold mb-1 flex items-center gap-2.5" style={{ color: '#F4F4F6' }}>
            <Trophy size={24} style={{ color: '#C9A84C' }} />
            Leaderboard
          </h1>
          <p className="text-[13px]" style={{ color: '#6B8FAD' }}>
            All players ranked by wins, win rate, and total points.
          </p>
        </div>
        <button onClick={load}
          className="p-2.5 rounded-xl transition-all mt-1"
          style={{ color: '#4A4A5E', background: 'rgba(255,255,255,0.03)', border: '1px solid #1E1E2A' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4A4A5E'; e.currentTarget.style.borderColor = '#1E1E2A'; }}>
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(6,11,24,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(({ key, label, icon: Icon, color }) => {
          const active = tab === key;
          const count  = (data[key] || []).length;
          return (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-[13px] transition-all duration-200"
              style={active
                ? { background: color + '18', color, border: `1px solid ${color}30` }
                : { color: '#4A4A5E', border: '1px solid transparent' }}>
              <Icon size={14} strokeWidth={active ? 2.5 : 2} />
              {label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: active ? color + '25' : 'rgba(255,255,255,0.05)', color: active ? color : '#3A3A52' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 text-[13px]"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : board.length === 0 ? (
        <div className="rounded-xl p-14 text-center" style={{ background: '#16161E', border: '1px solid #1E1E2A' }}>
          <Trophy size={36} className="mx-auto mb-4" style={{ color: '#2A2A3A' }} />
          <p className="text-[15px] font-bold mb-2" style={{ color: '#4A4A5E' }}>
            No {activeTab?.label} players yet
          </p>
          <p className="text-[12px]" style={{ color: '#2A2A3A' }}>
            {tab === 'single'
              ? 'Add players and generate singles matches to see rankings'
              : `Create ${activeTab?.label.toLowerCase()} teams to see rankings here`}
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: '#16161E', border: '1px solid #1E1E2A' }}>

          {/* Table head */}
          <div className="grid px-5 py-3 text-[10px] font-bold uppercase tracking-wider"
            style={{
              gridTemplateColumns: '44px 1fr 70px 55px 55px 70px 70px',
              background: 'rgba(6,11,24,0.5)',
              borderBottom: '1px solid #1E1E2A',
              color: '#3A3A52',
            }}>
            <div className="text-center">Rank</div>
            <div>{tab === 'single' ? 'Player' : 'Team'}</div>
            <div className="text-center">Played</div>
            <div className="text-center" style={{ color: '#4ADE80' }}>Wins</div>
            <div className="text-center" style={{ color: '#F87171' }}>Loss</div>
            <div className="text-center" style={{ color: '#C9A84C' }}>Points</div>
            <div className="text-right">Win %</div>
          </div>

          {board.map((entry, i) => {
            const wr      = parseFloat(entry.winRate);
            const isTop   = i < 3;
            const wrColor = wr >= 70 ? '#4ADE80' : wr >= 40 ? '#C9A84C' : wr > 0 ? '#F87171' : '#3A3A52';

            return (
              <div key={entry._id}
                className="grid px-5 py-3.5 items-center transition-colors"
                style={{
                  gridTemplateColumns: '44px 1fr 70px 55px 55px 70px 70px',
                  borderBottom: '1px solid #1E1E2A',
                  background: isTop ? `${accentColor}06` : 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = isTop ? `${accentColor}06` : 'transparent'}>

                {/* Rank */}
                <div className="text-center">
                  {isTop
                    ? <span className="text-[18px] leading-none">{MEDALS[i]}</span>
                    : <span className="text-[12px] font-bold" style={{ color: '#3A3A52' }}>#{i + 1}</span>}
                </div>

                {/* Name + avatar */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-black flex-shrink-0"
                    style={{
                      background: isTop ? `${accentColor}20` : 'rgba(255,255,255,0.05)',
                      color: isTop ? accentColor : '#4A4A5E',
                      border: isTop ? `1px solid ${accentColor}30` : '1px solid #1E1E2A',
                    }}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: '#F4F4F6' }}>
                      {entry.name}
                    </p>
                    {tab === 'single' && (
                      <p className="text-[10px]" style={{ color: '#3A3A52' }}>
                        {entry.gender === 'male' ? '♂ Male' : '♀ Female'}
                      </p>
                    )}
                    {tab !== 'single' && entry.players && (
                      <p className="text-[10px] truncate" style={{ color: '#3A3A52' }}>
                        {entry.players.map(p => p.name).join(' & ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Played */}
                <div className="text-center text-[13px] tabular-nums" style={{ color: '#6B8FAD' }}>
                  {entry.matchesPlayed}
                </div>

                {/* Wins */}
                <div className="text-center text-[14px] font-bold tabular-nums" style={{ color: '#4ADE80' }}>
                  {entry.wins}
                </div>

                {/* Losses */}
                <div className="text-center text-[13px] tabular-nums" style={{ color: '#F87171' }}>
                  {entry.losses}
                </div>

                {/* Points */}
                <div className="text-center text-[13px] font-bold tabular-nums" style={{ color: '#C9A84C' }}>
                  {entry.totalPoints}
                </div>

                {/* Win rate */}
                <div className="text-right">
                  <span className="text-[13px] font-black tabular-nums" style={{ color: wrColor }}>
                    {entry.winRate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      {!loading && board.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 text-[11px]" style={{ color: '#3A3A52' }}>
          <span>Sorted by: Wins → Win Rate → Points</span>
          <span className="flex items-center gap-1"><span style={{ color: '#4ADE80' }}>●</span> ≥70% win rate</span>
          <span className="flex items-center gap-1"><span style={{ color: '#C9A84C' }}>●</span> 40–69%</span>
          <span className="flex items-center gap-1"><span style={{ color: '#F87171' }}>●</span> &lt;40%</span>
        </div>
      )}
    </div>
  );
}
