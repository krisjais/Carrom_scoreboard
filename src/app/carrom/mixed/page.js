'use client';
import { useEffect, useState } from 'react';
import MatchCard from '@/components/MatchCard';
import { getMatches } from '@/lib/api';
import { HeartHandshake } from 'lucide-react';

export default function MixedMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches({ matchType: 'mixed' }).then(setMatches).catch(console.error).finally(() => setLoading(false));
  }, []);

  const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#4A4A5E' }}>Mixed Category</p>
        <h1 className="text-[26px] font-bold mb-1 flex items-center gap-2.5" style={{ color: '#F4F4F6' }}>
          <HeartHandshake size={22} style={{ color: '#F472B6' }} /> Mixed Doubles
        </h1>
        <p className="text-[13px]" style={{ color: '#8B8B9E' }}>1 Male + 1 Female per team.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: '#16161E', border: '1px solid #1F1F2E' }}>
          <HeartHandshake size={24} className="mx-auto mb-3" style={{ color: '#2A2A3A' }} />
          <p className="text-[13px] font-medium" style={{ color: '#4A4A5E' }}>No matches generated yet</p>
          <p className="text-[12px] mt-1" style={{ color: '#2A2A3A' }}>Go to Admin to generate matches</p>
        </div>
      ) : (
        <div className="space-y-8">
          {rounds.map(r => (
            <section key={r}>
              <div className="section-divider">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#8B8B9E' }}>
                  Round {r} · {matches.filter(m => m.round === r).length} matches
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {matches.filter(m => m.round === r).map(m => <MatchCard key={m._id} match={m} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
