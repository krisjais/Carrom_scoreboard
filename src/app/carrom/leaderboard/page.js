'use client';
import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/lib/api';
import { Trophy } from 'lucide-react';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [board, setBoard]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then(setBoard).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="page-header">
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#4A4A5E' }}>Rankings</p>
        <h1 className="text-[26px] font-bold mb-1 flex items-center gap-2.5" style={{ color: '#F4F4F6' }}>
          <Trophy size={22} style={{ color: '#F59E0B' }} />
          Leaderboard
        </h1>
        <p className="text-[13px]" style={{ color: '#8B8B9E' }}>Top players ranked by tournament performance.</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
        </div>
      ) : board.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: '#16161E', border: '1px solid #1F1F2E' }}>
          <Trophy size={28} className="mx-auto mb-3" style={{ color: '#2A2A3A' }} />
          <p className="text-[13px] font-medium" style={{ color: '#4A4A5E' }}>No rankings yet</p>
          <p className="text-[12px] mt-1" style={{ color: '#2A2A3A' }}>Complete some matches to see rankings</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ background: '#16161E', border: '1px solid #1F1F2E' }}>
          {/* Head */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: '#111118', borderBottom: '1px solid #1F1F2E', color: '#4A4A5E' }}>
            <div className="col-span-1">#</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-center">P</div>
            <div className="col-span-1 text-center" style={{ color: '#4ADE80' }}>W</div>
            <div className="col-span-1 text-center" style={{ color: '#F87171' }}>L</div>
            <div className="col-span-2 text-right">Win %</div>
          </div>

          {board.map((p, i) => {
            const wr = parseFloat(p.winRate);
            const isTop = i < 3;
            const wrColor = wr >= 70 ? '#4ADE80' : wr >= 40 ? '#818CF8' : '#F87171';

            return (
              <div key={p._id}
                className="grid grid-cols-12 gap-2 px-5 py-3.5 items-center transition-colors"
                style={{ borderBottom: '1px solid #1F1F2E', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="col-span-1">
                  {isTop
                    ? <span className="text-[15px]">{MEDALS[i]}</span>
                    : <span className="text-[12px] font-medium tabular-nums" style={{ color: '#4A4A5E' }}>#{i + 1}</span>}
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                    style={{ background: isTop ? 'rgba(99,102,241,0.15)' : '#1F1F2E', color: isTop ? '#818CF8' : '#4A4A5E' }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>{p.name}</p>
                    <p className="text-[10px]" style={{ color: '#4A4A5E' }}>{p.gender === 'male' ? '♂ Male' : '♀ Female'}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center text-[13px] tabular-nums" style={{ color: '#8B8B9E' }}>{p.matchesPlayed}</div>
                <div className="col-span-1 text-center text-[13px] font-semibold tabular-nums" style={{ color: '#4ADE80' }}>{p.wins}</div>
                <div className="col-span-1 text-center text-[13px] tabular-nums" style={{ color: '#F87171' }}>{p.losses}</div>
                <div className="col-span-2 text-right">
                  <span className="text-[13px] font-bold tabular-nums" style={{ color: wrColor }}>{p.winRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
