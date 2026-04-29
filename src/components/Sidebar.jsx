'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, User, Users, HeartHandshake,
  Trophy, Settings, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/carrom',             label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/carrom/single',      label: 'Singles',     icon: User },
  { href: '/carrom/double',      label: 'Doubles',     icon: Users },
  { href: '/carrom/mixed',       label: 'Mixed',       icon: HeartHandshake },
  { href: '/carrom/leaderboard', label: 'Leaderboard', icon: Trophy },
];

const SIDEBAR_W = 300;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40"
        style={{ width: SIDEBAR_W + 'px', minWidth: SIDEBAR_W + 'px', background: '#111118', borderRight: '1px solid #1E1E2A' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-4 px-6 py-6" style={{ borderBottom: '1px solid #1E1E2A' }}>
          <div className="relative flex-shrink-0" style={{ width: '64px', height: '64px' }}>
            <Image src="/logo.png" alt="NIT Carrom" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div className="min-w-0">
            <p className="text-[18px] font-black leading-tight tracking-wide uppercase" style={{ color: '#F4F4F6' }}>Carrom</p>
            <p className="text-[12px] font-semibold mt-0.5 uppercase tracking-wider" style={{ color: '#4A4A5E' }}>NIT Championship</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <p className="text-[11px] font-semibold uppercase tracking-widest px-3 mb-4" style={{ color: '#2A2A3A' }}>
            Menu
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl no-underline transition-all duration-150 relative"
                style={{
                  background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: active ? '#818CF8' : '#6B6B85',
                  border: active ? '1px solid rgba(99,102,241,0.15)' : '1px solid transparent',
                  fontWeight: active ? 600 : 500,
                  fontSize: '15px',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#C4C4D4';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6B6B85';
                  }
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r"
                    style={{ width: '3px', height: '55%', background: '#6366F1' }}
                  />
                )}
                <Icon size={19} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={15} style={{ color: '#6366F1', opacity: 0.6 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-5" style={{ borderTop: '1px solid #1E1E2A' }}>
          <Link
            href="/admin"
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl no-underline transition-all"
            style={{ color: '#3A3A52', fontSize: '14px', fontWeight: 500 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#6B6B85'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3A3A52'; }}
          >
            <Settings size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span>Admin Panel</span>
          </Link>
          <p className="text-[11px] px-4 mt-3" style={{ color: '#2A2A3A' }}>v1.0 · College Tournament</p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-2 px-1"
        style={{ background: '#111118', borderTop: '1px solid #1E1E2A' }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg no-underline transition-colors"
              style={{ color: active ? '#818CF8' : '#3A3A52', fontSize: '10px', fontWeight: active ? 600 : 500 }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
