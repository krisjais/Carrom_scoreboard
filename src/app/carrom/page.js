'use client';
import { useEffect, useState } from 'react';
import StatsCard from '@/components/StatsCard';
import MatchCard from '@/components/MatchCard';
import { getPlayers, getMatches } from '@/lib/api';
import { Users, Zap, CheckCircle2, Radio, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats]     = useState({ players: 0, live: 0, completed: 0, total: 0 });
  const [recentLive, setLive] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [players, matches] = await Promise.all([getPlayers(), getMatches()]);
        const live = matches.filter(m => m.status === 'live');
        const done = matches.filter(m => m.status === 'completed');
        setStats({ players: players.length, live: live.length, completed: done.length, total: matches.length });
        setLive(live.slice(0, 3));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);
  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>

      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#3A3A52' }}>
          Overview
        </p>
        <h1 className="text-[28px] font-bold mb-1.5 leading-tight" style={{ color: '#F4F4F6' }}>
          Welcome to <span className="gradient-text">Carrom Manager</span>
        </h1>
        <p className="text-[14px]" style={{ color: '#6B6B85' }}>
          Live tournament tracking for your college event.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
          <div className="skeleton h-10 rounded-xl w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatsCard
              icon={<Users size={18} />}
              label="Total Players"
              value={stats.players}
              color="#6366F1"
              subtext="Registered"
            />
            <StatsCard
              icon={<Zap size={18} />}
              label="Live Now"
              value={stats.live}
              color="#EF4444"
              subtext={stats.live > 0 ? 'In progress' : 'None active'}
            />
            <StatsCard
              icon={<CheckCircle2 size={18} />}
              label="Completed"
              value={stats.completed}
              color="#22C55E"
              subtext={`of ${stats.total} matches`}
            />
          </div>

          {/* Live matches */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-[15px] font-semibold flex items-center gap-2"
                style={{ color: '#F4F4F6' }}
              >
                <Radio size={15} className="pulse-badge" style={{ color: '#EF4444' }} />
                Live Matches
              </h2>
              <Link
                href="/carrom/single"
                className="text-[12px] flex items-center gap-1 no-underline transition-colors"
                style={{ color: '#3A3A52' }}
                onMouseEnter={e => e.currentTarget.style.color = '#818CF8'}
                onMouseLeave={e => e.currentTarget.style.color = '#3A3A52'}
              >
                View all <ArrowRight size={11} />
              </Link>
            </div>

            {recentLive.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentLive.map(m => <MatchCard key={m._id} match={m} />)}
              </div>
            ) : (
              <div
                className="rounded-xl p-10 text-center"
                style={{ background: '#16161E', border: '1px solid #1E1E2A' }}
              >
                <Radio size={22} className="mx-auto mb-3" style={{ color: '#2A2A3A' }} />
                <p className="text-[13px] font-medium mb-1" style={{ color: '#4A4A5E' }}>
                  No live matches right now
                </p>
                <p className="text-[12px]" style={{ color: '#2A2A3A' }}>
                  Go to Admin to start matches
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
