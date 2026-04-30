'use client';
import { useEffect, useState } from 'react';
import { Trophy, User, Users, HeartHandshake } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const MEDALS = ['🥇', '🥈', '🥉'];

const TABS = [
  { key: 'single', label: 'Singles',        icon: User,           color: '#60A5FA' },
  { key: 'double', label: 'Doubles',        icon: Users,          color: '#C9A84C' },
  { key: 'mixed',  label: 'Mixed Doubles',  icon: HeartHandshake, color: '#F472B6' },
];

export default function LeaderboardPage() {
  const [tab, setTab]         = useState('single');
  const [data, setData]       = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/leaderboard?type=all`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const board = data[tab] || [];
  const activeTab = TABS.find(t => t.key === tab);

  return (
    <div className="w-full space-y-6 animate-fade-in">

      {/* Header */}
      <div className="page-header">
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#4A4A5E' }}>Rankings</p>
        <h1 className="text-[26px] font-bold mb-1 flex items-center gap-2.5" style={{ color: '#F4F4F6' }}>
          <Trophy size={24} style={{ color: '#C9A84C' }} />
          Leaderboard
        </h1>
        <p className="text-[13px]" style={{ color: '#6B8FAD' }}>
          Rankings across all match categories.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(6,11,24,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(({ key, label, icon: Icon, color }) => {
          const active = tab === key;
          return (
            <button key={key} onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-[13px] transition-all duration-200"
              style={active
                ? { background: color + '18', color, border: `1px solid ${color}30` }
                : { color: '#4A4A5E', border: '1px solid transparent' }
              }>
              <Icon size={14} strokeWidth={active ? 2.5 : 2} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
        </div>
      ) : board.length === 0 ? (
        <div className="rounded-xl p-14 text-center" style={{ background: '#16161E', border: '1px solid #1E1E2A' }}>
          <Trophy size={32} className="mx-auto mb-3" style={{ color: '#2A2A3A' }} />
          <p className="text-[14px] font-semibold mb-1" style={{ color: '#4A4A5E' }}>
            No rankings yet for {activeTab?.label}
          </p>
          <p className="text-[12px]" style={{ color: '#2A2A3A' }}>
            Complete some {activeTab?.label.toLowerCase()} matches to see rankings here
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: '#16161E', border: '1px solid #1E1E2A' }}>

          {/* Table head */}
          <div className="grid gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-wider"
            style={{
              gridTemplateColumns: tab === 'single' ? '40px 1fr 80px 60px 60px 80px' : '40px 1fr 80px 60px 60px 80px',
              background: 'rgba(6,11,24,0.5)',
              borderBottom: '1px solid #1E1E2A',
              color: '#3A3A52',
            }}>
            <div className="text-center">#</div>
            <div>{tab === 'single' ? 'Player' : 'Team'}</div>
            <div className="text-center">Played</div>
            <div className="text-center" style={{ color: '#4ADE80' }}>W</div>
            <div className="text-center" style={{ color: '#F87171' }}>L</div>
            <div className="text-right">Win %</div>
          </div>

          {board.map((entry, i) => {
            const wr      = parseFloat(entry.winRate);
            const isTop   = i < 3;
            const wrColor = wr >= 70 ? '#4ADE80' : wr >= 40 ? '#C9A84C' : '#F87171';
            const accentColor = activeTab?.color || '#C9A84C';

            return (
              <div key={entry._id}
                className="grid gap-2 px-5 py-4 items-center transition-colors"
                style={{
                  gridTemplateColumns: '40px 1fr 80px 60px 60px 80px',
                  borderBottom: '1px solid #1E1E2A',
                  background: isTop ? `${accentColor}06` : 'transparent',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = isTop ? `${accentColor}06` : 'transparent'}>

                {/* Rank */}
                <div className="text-center">
                  {isTop
                    ? <span className="text-[16px]">{MEDALS[i]}</span>
                    : <span className="text-[12px] font-bold tabular-nums" style={{ color: '#3A3A52' }}>#{i + 1}</span>}
                </div>

                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0"
                    style={{
                      background: isTop ? `${accentColor}20` : 'rgba(255,255,255,0.05)',
                      color: isTop ? accentColor : '#3A3A52',
                      border: isTop ? `1px solid ${accentColor}30` : '1px solid #1E1E2A',
                    }}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: '#F4F4F6' }}>{entry.name}</p>
                    {tab === 'single' && (
                      <p className="text-[10px]" style={{ color: '#3A3A52' }}>
                        {entry.gender === 'male' ? '♂ Male' : '♀ Female'}
                      </p>
                    )}
                    {tab !== 'single' && entry.players && (
                      <p className="text-[10px] truncate" style={{ color: '#3A3A52' }}>
                        {entry.players.map(p => `${p.name} (${p.gender === 'male' ? '♂' : '♀'})`).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Played */}
                <div className="text-center text-[13px] tabular-nums" style={{ color: '#6B8FAD' }}>
                  {entry.matchesPlayed}
                </div>

                {/* Wins */}
                <div className="text-center text-[13px] font-bold tabular-nums" style={{ color: '#4ADE80' }}>
                  {entry.wins}
                </div>

                {/* Losses */}
                <div className="text-center text-[13px] tabular-nums" style={{ color: '#F87171' }}>
                  {entry.losses}
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
      <div className="flex items-center gap-6 text-[11px]" style={{ color: '#3A3A52' }}>
        <span className="flex items-center gap-1.5"><span style={{ color: '#4ADE80' }}>●</span> Win rate ≥ 70%</span>
        <span className="flex items-center gap-1.5"><span style={{ color: '#C9A84C' }}>●</span> Win rate 40–69%</span>
        <span className="flex items-center gap-1.5"><span style={{ color: '#F87171' }}>●</span> Win rate &lt; 40%</span>
      </div>
    </div>
  );
}
