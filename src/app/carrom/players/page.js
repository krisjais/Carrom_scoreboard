'use client';
import { useEffect, useState } from 'react';
import { Users, RefreshCw, AlertCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CAT_LABELS = {
  single: { label: 'Singles', color: '#60A5FA', short: 'S' },
  double: { label: 'Doubles', color: '#C9A84C', short: 'D' },
  mixed:  { label: 'Mixed',   color: '#F472B6', short: 'M' },
};

export default function PlayersStatsPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all'); // all | eligible | ineligible

  async function load() {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/leaderboard/players`);
      const data = await res.json();
      setPlayers(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = players.filter(p => {
    if (filter === 'eligible')   return !p.playedAll3;
    if (filter === 'ineligible') return p.playedAll3;
    return true;
  });

  const ineligibleCount = players.filter(p => p.playedAll3).length;

  return (
    <div className="w-full space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#4A4A5E' }}>
            All Players
          </p>
          <h1 className="text-[26px] font-bold mb-1 flex items-center gap-2.5" style={{ color: '#F4F4F6' }}>
            <Users size={24} style={{ color: '#C9A84C' }} />
            Player Stats
          </h1>
          <p className="text-[13px]" style={{ color: '#6B8FAD' }}>
            Categories played, wins, and eligibility status.
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

      {/* Ineligible warning */}
      {ineligibleCount > 0 && (
        <div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle size={16} style={{ color: '#F87171', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p className="text-[13px] font-semibold" style={{ color: '#F87171' }}>
              {ineligibleCount} player{ineligibleCount > 1 ? 's' : ''} ineligible
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(248,113,113,0.6)' }}>
              These players have participated in all 3 categories (Singles, Doubles, Mixed) and cannot join new matches.
            </p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all',        label: 'All Players',  count: players.length },
          { key: 'eligible',   label: 'Eligible',     count: players.filter(p => !p.playedAll3).length },
          { key: 'ineligible', label: 'Ineligible',   count: ineligibleCount },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
            style={filter === f.key
              ? { background: 'rgba(201,168,76,0.12)', color: '#E8C96A', border: '1px solid rgba(201,168,76,0.3)' }
              : { background: 'rgba(255,255,255,0.03)', color: '#4A4A5E', border: '1px solid #1E1E2A' }}>
            {f.label}
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: filter === f.key ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', color: filter === f.key ? '#E8C96A' : '#3A3A52' }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Player cards */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl p-10 text-center" style={{ background: '#16161E', border: '1px solid #1E1E2A' }}>
          <Users size={28} className="mx-auto mb-3" style={{ color: '#2A2A3A' }} />
          <p className="text-[13px] font-medium" style={{ color: '#4A4A5E' }}>No players found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, idx) => (
            <div key={p._id}
              className="rounded-xl p-4 transition-colors"
              style={{
                background: '#16161E',
                border: p.playedAll3 ? '1px solid rgba(239,68,68,0.2)' : '1px solid #1E1E2A',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = '#16161E'}>

              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-black flex-shrink-0"
                  style={{
                    background: p.gender === 'male'
                      ? 'linear-gradient(135deg, #1d4ed8, #3B82F6)'
                      : 'linear-gradient(135deg, #9d174d, #ec4899)',
                    color: '#fff',
                  }}>
                  {p.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[14px] font-bold" style={{ color: '#F4F4F6' }}>{p.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: p.gender === 'male' ? 'rgba(59,130,246,0.1)' : 'rgba(236,72,153,0.1)',
                        color: p.gender === 'male' ? '#93c5fd' : '#f9a8d4',
                        border: `1px solid ${p.gender === 'male' ? 'rgba(59,130,246,0.2)' : 'rgba(236,72,153,0.2)'}`,
                      }}>
                      {p.gender === 'male' ? '♂ Male' : '♀ Female'}
                    </span>
                    {p.playedAll3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <AlertCircle size={9} /> Ineligible
                      </span>
                    )}
                  </div>

                  {/* Category badges */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {['single', 'double', 'mixed'].map(cat => {
                      const played = p.categories?.includes(cat);
                      const cfg    = CAT_LABELS[cat];
                      const stats  = p[cat];
                      return (
                        <div key={cat}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                          style={{
                            background: played ? `${cfg.color}12` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${played ? cfg.color + '25' : '#1E1E2A'}`,
                            color: played ? cfg.color : '#2A2A3A',
                          }}>
                          <span>{cfg.label}</span>
                          {played && stats && (
                            <span className="text-[10px] opacity-70">
                              {stats.wins}W · {stats.points}pts
                            </span>
                          )}
                          {!played && <span className="text-[10px]">—</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Overall stats */}
                <div className="flex items-center gap-4 flex-shrink-0 text-center">
                  <div>
                    <p className="text-[18px] font-black leading-none" style={{ color: '#4ADE80' }}>{p.totalWins}</p>
                    <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: '#3A3A52' }}>Wins</p>
                  </div>
                  <div>
                    <p className="text-[18px] font-black leading-none" style={{ color: '#C9A84C' }}>{p.totalPoints}</p>
                    <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: '#3A3A52' }}>Points</p>
                  </div>
                  <div>
                    <p className="text-[18px] font-black leading-none"
                      style={{ color: parseFloat(p.winRate) >= 50 ? '#4ADE80' : '#F87171' }}>
                      {p.winRate}%
                    </p>
                    <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: '#3A3A52' }}>Win%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[11px]" style={{ color: '#3A3A52' }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: '#60A5FA' }} /> Singles
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: '#C9A84C' }} /> Doubles
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: '#F472B6' }} /> Mixed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: '#F87171' }} /> Ineligible = played all 3
        </span>
      </div>
    </div>
  );
}
