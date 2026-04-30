'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, User, Users, HeartHandshake, Trophy, Settings, ChevronRight } from 'lucide-react';
import { prefetch, prefetchAll } from '@/lib/api';
import { useEffect } from 'react';

const navItems = [
  { href: '/carrom',             label: 'Dashboard',   icon: LayoutDashboard, prefetchKey: null },
  { href: '/carrom/single',      label: 'Singles',     icon: User,            prefetchKey: 'single' },
  { href: '/carrom/double',      label: 'Doubles',     icon: Users,           prefetchKey: 'double' },
  { href: '/carrom/mixed',       label: 'Mixed',       icon: HeartHandshake,  prefetchKey: 'mixed' },
  { href: '/carrom/leaderboard', label: 'Leaderboard', icon: Trophy,          prefetchKey: 'leaderboard' },
];

const W = 300;

export default function Sidebar() {
  const pathname = usePathname();

  // Prefetch all data in background after mount
  useEffect(() => {
    const t = setTimeout(() => prefetchAll(), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40"
        style={{ width: W + 'px', minWidth: W + 'px', background: '#0A1525', borderRight: '1px solid rgba(201,168,76,0.12)' }}>

        {/* Brand */}
        <div className="flex items-center gap-4 px-6 py-6" style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="relative flex-shrink-0" style={{ width: '52px', height: '52px' }}>
            <Image src="/logo.png" alt="NIT Carrom" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div>
            <p className="text-[17px] font-black uppercase tracking-wide leading-tight" style={{ color: '#E8C96A' }}>Carrom</p>
            <p className="text-[11px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: '#2E4A6A' }}>NIT Championship</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-4" style={{ color: '#1E3A5A' }}>Menu</p>
          {navItems.map(({ href, label, icon: Icon, prefetchKey }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`nav-link ${active ? 'active' : ''}`}
                onMouseEnter={() => { if (prefetchKey) prefetch(prefetchKey); }}>
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r" style={{ width: '3px', height: '55%', background: 'linear-gradient(180deg, #C9A84C, #E8C96A)' }} />}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: active ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)', border: active ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
                  <Icon size={15} strokeWidth={active ? 2.5 : 2} style={{ color: active ? '#E8C96A' : '#2E4A6A' }} />
                </div>
                <span className="flex-1 text-[14px]">{label}</span>
                {active && <ChevronRight size={14} style={{ color: 'rgba(201,168,76,0.5)' }} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline transition-all"
            style={{ color: '#2E4A6A', fontSize: '13px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = '#7A9CC0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2E4A6A'; }}>
            <Settings size={15} />
            <span>Admin Panel</span>
          </Link>
          <p className="text-[10px] px-3 mt-2" style={{ color: '#1E3A5A' }}>v1.0 · College Tournament</p>
        </div>
      </aside>

      {/* Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2 px-1"
        style={{ background: '#0A1525', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
        {navItems.slice(0, 4).map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg no-underline"
              style={{ color: active ? '#E8C96A' : '#6B8FAD', fontSize: '9px', fontWeight: active ? 600 : 400 }}>
              <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
        <Link href="/admin" className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg no-underline"
          style={{ color: pathname.startsWith('/admin') ? '#E8C96A' : '#6B8FAD', fontSize: '9px' }}>
          <Settings size={19} strokeWidth={1.8} />
          <span>Admin</span>
        </Link>
      </nav>
    </>
  );
}
