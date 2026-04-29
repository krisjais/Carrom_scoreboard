'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Users, Zap, ChevronRight, Shield, LayoutDashboard, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080F1C', color: '#F0F4FF', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav
        className="flex items-center justify-between px-6 py-4 lg:px-16"
        style={{ borderBottom: '1px solid rgba(201,168,76,0.1)', background: 'rgba(8,15,28,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative" style={{ width: '36px', height: '36px' }}>
            <Image src="/logo.png" alt="NIT Carrom" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div>
            <p className="text-[15px] font-black uppercase tracking-wide leading-tight" style={{ color: '#E8C96A' }}>Carrom</p>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: '#3D5A80' }}>NIT Championship</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Dashboard', 'Singles', 'Doubles', 'Leaderboard'].map(item => (
            <Link
              key={item}
              href={`/carrom${item === 'Dashboard' ? '' : '/' + item.toLowerCase()}`}
              className="text-[13px] font-medium no-underline transition-colors"
              style={{ color: '#5A7A9A' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E8C96A'}
              onMouseLeave={e => e.currentTarget.style.color = '#5A7A9A'}
            >
              {item}
            </Link>
          ))}
        </div>

        <Link
          href="/carrom"
          className="flex items-center gap-2 px-4 py-2 rounded-lg no-underline text-[13px] font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #A8832A, #C9A84C)', color: '#080F1C', boxShadow: '0 2px 12px rgba(201,168,76,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.5)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(201,168,76,0.3)'}
        >
          View Tournament <ChevronRight size={14} />
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        {/* Badge */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-[12px] font-semibold uppercase tracking-wider"
          style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C' }}
        >
          <Star size={12} fill="#C9A84C" />
          NIT Carrom Championship 2025
        </div>

        {/* Logo */}
        <div className="relative mb-8" style={{ width: '160px', height: '160px' }}>
          <Image src="/logo.png" alt="NIT Carrom Championship" fill style={{ objectFit: 'contain' }} priority />
        </div>

        <h1 className="text-[40px] lg:text-[64px] font-black leading-tight mb-4 max-w-3xl" style={{ letterSpacing: '-0.02em' }}>
          The Ultimate{' '}
          <span style={{ background: 'linear-gradient(90deg, #C9A84C, #FFD97D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Carrom
          </span>{' '}
          Championship
        </h1>

        <p className="text-[16px] lg:text-[18px] max-w-xl mb-10 leading-relaxed" style={{ color: '#5A7A9A' }}>
          Live match tracking, real-time scores, and player rankings for the NIT College Carrom Tournament.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/carrom"
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl no-underline text-[15px] font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #A8832A, #C9A84C, #E8C96A)', color: '#080F1C', boxShadow: '0 4px 20px rgba(201,168,76,0.35)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 28px rgba(201,168,76,0.55)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.35)'}
          >
            <LayoutDashboard size={18} /> View Dashboard
          </Link>
          <Link
            href="/carrom/leaderboard"
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl no-underline text-[15px] font-semibold transition-all"
            style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#C9A84C' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}
          >
            <Trophy size={18} /> Leaderboard
          </Link>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section
        className="mx-4 lg:mx-16 rounded-2xl px-6 py-6 mb-16"
        style={{ background: '#0F1E35', border: '1px solid rgba(201,168,76,0.12)' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '3', label: 'Categories', sub: 'Singles · Doubles · Mixed' },
            { value: '∞', label: 'Players', sub: 'Open registration' },
            { value: 'Live', label: 'Scores', sub: 'Real-time updates' },
            { value: '#1', label: 'Rankings', sub: 'Win-rate based' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-[32px] font-black leading-none mb-1" style={{ color: '#E8C96A' }}>{s.value}</p>
              <p className="text-[13px] font-semibold" style={{ color: '#F0F4FF' }}>{s.label}</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#3D5A80' }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 lg:px-16 mb-20">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#C9A84C' }}>Features</p>
          <h2 className="text-[28px] lg:text-[36px] font-black" style={{ letterSpacing: '-0.01em' }}>
            Everything you need to{' '}
            <span style={{ background: 'linear-gradient(90deg, #C9A84C, #FFD97D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              run a tournament
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            {
              icon: <Zap size={22} />,
              color: '#EF4444',
              title: 'Live Match Tracking',
              desc: 'Set matches live, update scores in real time, and declare winners instantly from the admin panel.',
            },
            {
              icon: <Trophy size={22} />,
              color: '#C9A84C',
              title: 'Auto Leaderboard',
              desc: 'Player rankings update automatically after every match, sorted by win rate and total wins.',
            },
            {
              icon: <Users size={22} />,
              color: '#4A9EBF',
              title: '3 Match Categories',
              desc: 'Singles (gender-based), Doubles (open), and Mixed Doubles — all managed from one dashboard.',
            },
            {
              icon: <Shield size={22} />,
              color: '#818CF8',
              title: 'Secure Admin Panel',
              desc: 'Password-protected admin portal to manage players, generate brackets, and control match flow.',
            },
            {
              icon: <LayoutDashboard size={22} />,
              color: '#22C55E',
              title: 'Tournament Brackets',
              desc: 'Auto-generate Round 1 brackets and advance winners to the next round with one click.',
            },
            {
              icon: <Star size={22} />,
              color: '#F59E0B',
              title: 'Mobile Friendly',
              desc: 'Fully responsive design — view live scores and standings from any device, anywhere.',
            },
          ].map(f => (
            <div
              key={f.title}
              className="rounded-2xl p-6 transition-all duration-200"
              style={{ background: '#0F1E35', border: '1px solid rgba(201,168,76,0.1)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}14`, border: `1px solid ${f.color}25` }}
              >
                <span style={{ color: f.color }}>{f.icon}</span>
              </div>
              <h3 className="text-[15px] font-bold mb-2" style={{ color: '#F0F4FF' }}>{f.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: '#5A7A9A' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section
        className="mx-4 lg:mx-16 rounded-2xl p-8 lg:p-12 mb-20"
        style={{ background: 'linear-gradient(135deg, #0F1E35 0%, #0A1525 100%)', border: '1px solid rgba(201,168,76,0.15)' }}
      >
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: '#C9A84C' }}>Match Categories</p>
          <h2 className="text-[26px] font-black" style={{ color: '#F0F4FF' }}>Three ways to compete</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { href: '/carrom/single', label: 'Singles', emoji: '🎯', desc: 'Individual 1v1 matches, grouped by gender. Male and Female categories compete separately.', color: '#60A5FA' },
            { href: '/carrom/double', label: 'Doubles', emoji: '🤝', desc: 'Open category — any 2 players can form a team. No gender restrictions.', color: '#C9A84C' },
            { href: '/carrom/mixed', label: 'Mixed Doubles', emoji: '💑', desc: 'Teams must consist of exactly 1 Male and 1 Female player.', color: '#F472B6' },
          ].map(c => (
            <Link
              key={c.label}
              href={c.href}
              className="flex flex-col p-6 rounded-xl no-underline transition-all duration-200 group"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.color}20` }}
              onMouseEnter={e => { e.currentTarget.style.background = `${c.color}08`; e.currentTarget.style.borderColor = `${c.color}40`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = `${c.color}20`; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span className="text-[32px] mb-3">{c.emoji}</span>
              <p className="text-[17px] font-bold mb-2" style={{ color: c.color }}>{c.label}</p>
              <p className="text-[13px] leading-relaxed flex-1" style={{ color: '#5A7A9A' }}>{c.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-[12px] font-semibold" style={{ color: c.color }}>
                View matches <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center px-6 pb-20">
        <h2 className="text-[28px] lg:text-[36px] font-black mb-4" style={{ letterSpacing: '-0.01em' }}>
          Ready to see the{' '}
          <span style={{ background: 'linear-gradient(90deg, #C9A84C, #FFD97D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            action?
          </span>
        </h2>
        <p className="text-[15px] mb-8" style={{ color: '#5A7A9A' }}>
          Follow live matches, check standings, and see who's climbing the leaderboard.
        </p>
        <Link
          href="/carrom"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl no-underline text-[15px] font-bold transition-all"
          style={{ background: 'linear-gradient(135deg, #A8832A, #C9A84C, #E8C96A)', color: '#080F1C', boxShadow: '0 4px 24px rgba(201,168,76,0.4)' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 32px rgba(201,168,76,0.6)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,168,76,0.4)'}
        >
          Enter Tournament <ChevronRight size={18} />
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 lg:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}
      >
        <div className="flex items-center gap-3">
          <div className="relative" style={{ width: '28px', height: '28px' }}>
            <Image src="/logo.png" alt="NIT Carrom" fill style={{ objectFit: 'contain' }} />
          </div>
          <p className="text-[13px] font-semibold" style={{ color: '#3D5A80' }}>
            NIT Carrom Championship · v1.0
          </p>
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: 'Dashboard', href: '/carrom' },
            { label: 'Leaderboard', href: '/carrom/leaderboard' },
            { label: 'Admin', href: '/admin/login' },
          ].map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="text-[12px] no-underline transition-colors"
              style={{ color: '#3D5A80' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = '#3D5A80'}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <p className="text-[11px]" style={{ color: '#2A3A50' }}>
          Organized by NIT · College Tournament
        </p>
      </footer>
    </div>
  );
}
