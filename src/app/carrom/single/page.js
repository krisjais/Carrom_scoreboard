'use client';
import { useEffect, useState } from 'react';
import MatchCard from '@/components/MatchCard';
import { getMatches } from '@/lib/api';
import { User } from 'lucide-react';

export default function SingleMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches({ matchType: 'single' }).then(setMatches).catch(console.error).finally(() => setLoading(false));
  }, []);

  const male   = matches.filter(m => m.genderGroup === 'male');
  const female = matches.filter(m => m.genderGroup === 'female');

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="page-header">
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#4A4A5E' }}>Gender Category</p>
        <h1 className="text-[26px] font-bold mb-1 flex items-center gap-2.5" style={{ color: '#F4F4F6' }}>
          <User size={22} style={{ color: '#6366F1' }} /> Singles Matches
        </h1>
        <p className="text-[13px]" style={{ color: '#8B8B9E' }}>Players grouped and matched by gender.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}
        </div>
      ) : matches.length === 0 ? (
        <EmptyState icon={<User size={24} />} text="No matches generated yet" sub="Go to Admin to generate matches" />
      ) : (
        <div className="space-y-8">
          {male.length > 0 && (
            <section>
              <div className="section-divider">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#60A5FA' }}>♂ Male · {male.length} matches</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {male.map(m => <MatchCard key={m._id} match={m} />)}
              </div>
            </section>
          )}
          {female.length > 0 && (
            <section>
              <div className="section-divider">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#F472B6' }}>♀ Female · {female.length} matches</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {female.map(m => <MatchCard key={m._id} match={m} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, text, sub }) {
  return (
    <div className="rounded-xl p-12 text-center" style={{ background: '#16161E', border: '1px solid #1F1F2E' }}>
      <div className="mx-auto mb-3 flex justify-center" style={{ color: '#2A2A3A' }}>{icon}</div>
      <p className="text-[13px] font-medium" style={{ color: '#4A4A5E' }}>{text}</p>
      <p className="text-[12px] mt-1" style={{ color: '#2A2A3A' }}>{sub}</p>
    </div>
  );
}
