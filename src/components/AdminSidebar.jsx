'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Users, Swords, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin',          label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & stats' },
  { href: '/admin/players',  label: 'Players',   icon: Users,           desc: 'Manage participants' },
  { href: '/admin/matches',  label: 'Matches',   icon: Swords,          desc: 'Generate & manage' },
];

const SIDEBAR_W = 300;

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  function handleLogout() {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  }

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40"
        style={{ width: SIDEBAR_W + 'px', minWidth: SIDEBAR_W + 'px', background: '#0F1E38', borderRight: '1px solid #1B3A6B' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-4 px-6 py-6" style={{ borderBottom: '1px solid #1B3A6B' }}>
          <div className="relative flex-shrink-0" style={{ width: '64px', height: '64px' }}>
            <Image src="/logo.png" alt="NIT Carrom" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div className="min-w-0">
            <p className="text-[18px] font-black leading-tight tracking-wide uppercase" style={{ color: '#E8C96A' }}>Admin</p>
            <p className="text-[13px] font-black leading-tight tracking-wide uppercase" style={{ color: '#C9A84C' }}>Panel</p>
            <p className="text-[11px] font-semibold mt-1 uppercase tracking-wider" style={{ color: '#3D5A80' }}>NIT Championship</p>
          </div>
        </div>

        {/* Admin badge */}
        <div className="px-5 py-4">
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}
          >
            <ShieldCheck size={15} style={{ color: '#E8C96A' }} />
            <p className="text-[13px] font-semibold" style={{ color: '#E8C96A' }}>Administrator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="text-[11px] font-semibold uppercase tracking-widest px-4 mb-4" style={{ color: '#1B3A6B' }}>
            Admin Menu
          </p>
          {navItems.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl no-underline transition-all duration-150 relative"
                style={{
                  background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: active ? '#E8C96A' : '#3D5A80',
                  border: active ? '1px solid rgba(201,168,76,0.2)' : '1px solid transparent',
                  fontWeight: active ? 600 : 500,
                  fontSize: '15px',
                }}
                onMouseEnter={e => {
                  if (!active) { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = '#8BA4C0'; }
                }}
                onMouseLeave={e => {
                  if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3D5A80'; }
                }}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r"
                    style={{ width: '3px', height: '55%', background: '#C9A84C' }} />
                )}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: active ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                    border: active ? '1px solid rgba(201,168,76,0.25)' : '1px solid #1B3A6B',
                  }}
                >
                  <Icon size={17} strokeWidth={active ? 2.5 : 2} style={{ color: active ? '#E8C96A' : '#3D5A80' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] leading-tight font-medium">{label}</p>
                  <p className="text-[11px] mt-0.5 truncate" style={{ color: active ? 'rgba(232,201,106,0.5)' : '#3D5A80' }}>{desc}</p>
                </div>
                {active && <ChevronRight size={15} style={{ color: 'rgba(201,168,76,0.5)', flexShrink: 0 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5" style={{ height: '1px', background: '#1B3A6B' }} />

        <div className="px-4 py-3">
          <Link href="/carrom"
            className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl no-underline transition-all"
            style={{ color: '#3D5A80', fontSize: '14px', fontWeight: 500 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = '#8BA4C0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3D5A80'; }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1B3A6B' }}>
              <LayoutDashboard size={16} style={{ color: '#3D5A80' }} />
            </div>
            <div>
              <p className="text-[14px]">Back to Site</p>
              <p className="text-[11px]" style={{ color: '#1B3A6B' }}>User dashboard</p>
            </div>
          </Link>
        </div>

        <div className="px-4 pb-5">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all"
            style={{ color: '#3D5A80', fontSize: '14px', fontWeight: 500, background: 'transparent', border: '1px solid #1B3A6B', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = '#F87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3D5A80'; e.currentTarget.style.borderColor = '#1B3A6B'; }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1B3A6B' }}>
              <LogOut size={16} style={{ color: '#3D5A80' }} />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-1 px-1"
        style={{ background: '#0F1E38', borderTop: '1px solid #1B3A6B' }}
      >
        <Link
          href="/admin"
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg no-underline"
          style={{ color: pathname === '/admin' ? '#818CF8' : '#3A3A52', fontSize: '9px', fontWeight: pathname === '/admin' ? 600 : 400 }}
        >
          <LayoutDashboard size={18} strokeWidth={pathname === '/admin' ? 2.5 : 1.8} />
          <span>Dashboard</span>
        </Link>

        <Link href="/admin/players"
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg no-underline"
          style={{ color: pathname === '/admin/players' ? '#818CF8' : '#3A3A52', fontSize: '9px' }}>
          <Users size={18} strokeWidth={pathname === '/admin/players' ? 2.5 : 1.8} />
          <span>Players</span>
        </Link>

        <Link href="/admin/matches"
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg no-underline"
          style={{ color: pathname === '/admin/matches' ? '#818CF8' : '#3A3A52', fontSize: '9px' }}>
          <Swords size={18} strokeWidth={pathname === '/admin/matches' ? 2.5 : 1.8} />
          <span>Matches</span>
        </Link>

        <Link
          href="/carrom"
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg no-underline"
          style={{ color: '#3A3A52', fontSize: '9px' }}
        >
          <LayoutDashboard size={18} strokeWidth={1.8} />
          <span>User Site</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg"
          style={{ color: '#3A3A52', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Sign Out</span>
        </button>
      </nav>
    </>
  );
}
