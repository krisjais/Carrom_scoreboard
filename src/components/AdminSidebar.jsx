'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LayoutDashboard, Users, Swords, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin',         label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & stats' },
  { href: '/admin/players', label: 'Players',   icon: Users,           desc: 'Manage participants' },
  { href: '/admin/matches', label: 'Matches',   icon: Swords,          desc: 'Generate & manage' },
];

const W = 300;

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  function handleLogout() {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  }

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
            <p className="text-[17px] font-black uppercase tracking-wide leading-tight" style={{ color: '#E8C96A' }}>Admin</p>
            <p className="text-[13px] font-black uppercase tracking-wide leading-tight" style={{ color: '#C9A84C' }}>Panel</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: '#2E4A6A' }}>NIT Championship</p>
          </div>
        </div>

        {/* Admin badge */}
        <div className="px-5 py-3">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)' }}>
            <ShieldCheck size={14} style={{ color: '#C9A84C' }} />
            <p className="text-[12px] font-semibold" style={{ color: '#E8C96A' }}>Administrator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-4" style={{ color: '#1E3A5A' }}>Admin Menu</p>
          {navItems.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl no-underline transition-all relative"
                style={{
                  background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: active ? '#E8C96A' : '#2E4A6A',
                  border: active ? '1px solid rgba(201,168,76,0.22)' : '1px solid transparent',
                  fontWeight: active ? 600 : 500,
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = '#7A9CC0'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2E4A6A'; } }}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r" style={{ width: '3px', height: '55%', background: 'linear-gradient(180deg, #C9A84C, #E8C96A)' }} />}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: active ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)', border: active ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} style={{ color: active ? '#E8C96A' : '#2E4A6A' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] leading-tight">{label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: active ? 'rgba(232,201,106,0.45)' : '#1E3A5A' }}>{desc}</p>
                </div>
                {active && <ChevronRight size={14} style={{ color: 'rgba(201,168,76,0.45)' }} />}
              </Link>
            );
          })}
        </nav>

        <div className="mx-5" style={{ height: '1px', background: 'rgba(201,168,76,0.08)' }} />

        {/* Back to site */}
        <div className="px-4 py-3">
          <Link href="/carrom" className="flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-all"
            style={{ color: '#2E4A6A', fontSize: '13px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = '#7A9CC0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2E4A6A'; }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <LayoutDashboard size={14} style={{ color: '#2E4A6A' }} />
            </div>
            <div>
              <p className="text-[13px]">Back to Site</p>
              <p className="text-[10px]" style={{ color: '#1E3A5A' }}>User dashboard</p>
            </div>
          </Link>
        </div>

        {/* Logout */}
        <div className="px-4 pb-5">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
            style={{ color: '#2E4A6A', fontSize: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#F87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2E4A6A'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <LogOut size={14} style={{ color: '#2E4A6A' }} />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-1 px-1"
        style={{ background: '#0A1525', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg no-underline"
              style={{ color: active ? '#E8C96A' : '#2E4A6A', fontSize: '9px', fontWeight: active ? 600 : 400 }}>
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
        <Link href="/carrom" className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg no-underline"
          style={{ color: '#2E4A6A', fontSize: '9px' }}>
          <LayoutDashboard size={18} strokeWidth={1.8} />
          <span>Site</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg"
          style={{ color: '#2E4A6A', fontSize: '9px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <LogOut size={18} strokeWidth={1.8} />
          <span>Out</span>
        </button>
      </nav>
    </>
  );
}
