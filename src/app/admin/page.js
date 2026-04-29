'use client';
import { useEffect, useState } from 'react';
import { getPlayers, getMatches } from '@/lib/api';
import { Users, Zap, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ players: 0, male: 0, female: 0, live: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) { router.push('/admin/login'); return; }
    async function load() {
      try {
        const [players, matches] = await Promise.all([getPlayers(), getMatches()]);
        setStats({
          players: players.length,
          male: players.filter(p => p.gender === 'male').length,
          female: players.filter(p => p.gender === 'female').length,
          live: matches.filter(m => m.status === 'live').length,
          completed: matches.filter(m => m.status === 'completed').length,
          total: matches.length,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  const STAT_CARDS = [
    { label: 'Total Players', value: stats.players, sub: stats.male + 'M · ' + stats.female + 'F', color: '#6366F1', icon: <Users size={18} /> },
    { label: 'Live Matches',  value: stats.live,    sub: 'In progress',                             color: '#EF4444', icon: <Zap size={18} /> },
    { label: 'Completed',     value: stats.completed, sub: 'Finished',                              color: '#22C55E', icon: <CheckCircle2 size={18} /> },
    { label: 'Total Matches', value: stats.total,   sub: 'All categories',                          color: '#818CF8', icon: <Trophy size={18} /> },
  ];

  const QUICK_LINKS = [
    { href: '/admin/players', label: 'Manage Players', desc: 'Add, edit or remove participants', color: '#6366F1', icon: <Users size={20} /> },
    { href: '/admin/matches', label: 'Manage Matches', desc: 'Generate brackets and update scores', color: '#22C55E', icon: <Zap size={20} /> },
    { href: '/carrom/leaderboard', label: 'Leaderboard', desc: 'View player rankings', color: '#F59E0B', icon: <Trophy size={20} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-1" style={{ color: '#4A4A5E' }}>Control Panel</p>
        <h1 className="text-[26px] font-bold" style={{ color: '#F4F4F6' }}>
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-[13px] mt-1" style={{ color: '#6B6B85' }}>Tournament overview and quick actions</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STAT_CARDS.map(s => (
            <div key={s.label} className="rounded-xl p-4 transition-colors"
              style={{ background: '#16161E', border: '1px solid #1E1E2A' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2A2A3A'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1E1E2A'}>
              <div className="flex items-start justify-between mb-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#4A4A5E' }}>{s.label}</p>
                <span style={{ color: s.color, opacity: 0.7 }}>{s.icon}</span>
              </div>
              <p className="text-[30px] font-bold leading-none" style={{ color: '#F4F4F6' }}>{s.value}</p>
              <p className="text-[11px] mt-1" style={{ color: s.color, opacity: 0.6 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#4A4A5E' }}>Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUICK_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="flex items-center gap-4 p-4 rounded-xl no-underline transition-all group"
              style={{ background: '#16161E', border: '1px solid #1E1E2A' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2A2A3A'; e.currentTarget.style.background = '#1A1A24'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E1E2A'; e.currentTarget.style.background = '#16161E'; }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: link.color + '15', border: '1px solid ' + link.color + '25' }}>
                <span style={{ color: link.color }}>{link.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold" style={{ color: '#F4F4F6' }}>{link.label}</p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: '#4A4A5E' }}>{link.desc}</p>
              </div>
              <ArrowRight size={14} style={{ color: '#2A2A3A', flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
