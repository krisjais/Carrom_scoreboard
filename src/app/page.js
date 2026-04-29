'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Users, Zap, ChevronRight, Shield, LayoutDashboard, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#060C18', color: '#F0F4FF', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* ── Floating carrom pieces animation styles ── */}
      <style>{`
        @keyframes floatA {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          33%  { transform: translateY(-28px) rotate(120deg); opacity: 1; }
          66%  { transform: translateY(-12px) rotate(240deg); opacity: 0.8; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.7; }
        }
        @keyframes floatB {
          0%   { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.6; }
          50%  { transform: translateY(-36px) rotate(180deg) scale(1.1); opacity: 0.9; }
          100% { transform: translateY(0px) rotate(360deg) scale(1); opacity: 0.6; }
        }
        @keyframes floatC {
          0%   { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.5; }
          25%  { transform: translateY(-20px) translateX(10px) rotate(90deg); opacity: 0.8; }
          75%  { transform: translateY(-30px) translateX(-8px) rotate(270deg); opacity: 0.7; }
          100% { transform: translateY(0px) translateX(0px) rotate(360deg); opacity: 0.5; }
        }
        @keyframes floatD {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          40%  { transform: translateY(-22px) rotate(144deg); opacity: 0.75; }
          100% { transform: translateY(0px) rotate(360deg); opacity: 0.4; }
        }
        @keyframes drift {
          0%   { transform: translateX(0px) translateY(0px) rotate(0deg); }
          25%  { transform: translateX(15px) translateY(-20px) rotate(90deg); }
          50%  { transform: translateX(0px) translateY(-35px) rotate(180deg); }
          75%  { transform: translateX(-15px) translateY(-20px) rotate(270deg); }
          100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
        }
      `}</style>

      {/* ── Global background layers ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {/* Deep radial glow — top center gold */}
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '900px', height: '600px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        {/* Left blue glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '-10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(74,158,191,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Right purple glow */}
        <div style={{
          position: 'absolute', top: '30%', right: '-10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        {/* Bottom gold glow */}
        <div style={{
          position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,12,24,0.8) 100%)',
        }} />
      </div>

      {/* ── Navbar ── */}
      <nav
        className="flex items-center justify-between px-6 py-4 lg:px-16 relative"
        style={{
          borderBottom: '1px solid rgba(201,168,76,0.1)',
          background: 'rgba(6,12,24,0.8)',
          backdropFilter: 'blur(20px)',
          position: 'sticky', top: 0, zIndex: 50,
        }}
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
          {[
            { label: 'Dashboard', href: '/carrom' },
            { label: 'Singles', href: '/carrom/single' },
            { label: 'Doubles', href: '/carrom/double' },
            { label: 'Leaderboard', href: '/carrom/leaderboard' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="text-[13px] font-medium no-underline transition-colors"
              style={{ color: '#5A7A9A' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E8C96A'}
              onMouseLeave={e => e.currentTarget.style.color = '#5A7A9A'}>
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/carrom"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg no-underline text-[13px] font-bold transition-all"
          style={{ background: 'linear-gradient(135deg, #A8832A, #C9A84C)', color: '#060C18', boxShadow: '0 2px 16px rgba(201,168,76,0.3)' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,168,76,0.55)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(201,168,76,0.3)'}>
          View Tournament <ChevronRight size={14} />
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-20 lg:pt-28 lg:pb-28" style={{ zIndex: 1 }}>

        {/* ── Floating carrom pieces ── */}
        {/* Black coin — top left */}
        <div style={{ position: 'absolute', top: '12%', left: '8%', animation: 'floatA 6s ease-in-out infinite', zIndex: 0 }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #4A4A4A, #111)', border: '2px solid #333', boxShadow: '0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' }} />
        </div>
        {/* White coin — top right */}
        <div style={{ position: 'absolute', top: '8%', right: '10%', animation: 'floatB 7s ease-in-out infinite 1s', zIndex: 0 }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #E8E0D0, #B8B0A0)', border: '2px solid #C8C0B0', boxShadow: '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)' }} />
        </div>
        {/* Striker — center left (larger, gold-rimmed) */}
        <div style={{ position: 'absolute', top: '35%', left: '5%', animation: 'floatC 8s ease-in-out infinite 0.5s', zIndex: 0 }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #F5E6C8, #C9A84C 40%, #8B6914)', border: '3px solid #E8C96A', boxShadow: '0 6px 24px rgba(201,168,76,0.4), inset 0 2px 0 rgba(255,255,255,0.3)' }}>
            {/* Striker inner ring */}
            <div style={{ position: 'absolute', inset: '6px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
          </div>
        </div>
        {/* Black coin — right side */}
        <div style={{ position: 'absolute', top: '45%', right: '6%', animation: 'floatD 5.5s ease-in-out infinite 2s', zIndex: 0 }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #3A3A3A, #0A0A0A)', border: '2px solid #2A2A2A', boxShadow: '0 4px 12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)' }} />
        </div>
        {/* Red queen — center right */}
        <div style={{ position: 'absolute', top: '20%', right: '14%', animation: 'drift 9s ease-in-out infinite 1.5s', zIndex: 0 }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #FF6B6B, #CC2222)', border: '2px solid #FF4444', boxShadow: '0 4px 16px rgba(239,68,68,0.5), inset 0 1px 0 rgba(255,255,255,0.2)' }} />
        </div>
        {/* White coin — bottom left */}
        <div style={{ position: 'absolute', bottom: '20%', left: '10%', animation: 'floatB 7.5s ease-in-out infinite 3s', zIndex: 0 }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #F0E8D8, #C0B8A8)', border: '2px solid #D0C8B8', boxShadow: '0 3px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.35)' }} />
        </div>
        {/* Black coin — bottom right */}
        <div style={{ position: 'absolute', bottom: '25%', right: '8%', animation: 'floatA 6.5s ease-in-out infinite 0.8s', zIndex: 0 }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #444, #111)', border: '2px solid #333', boxShadow: '0 3px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)' }} />
        </div>
        {/* Small striker — far left */}
        <div style={{ position: 'absolute', bottom: '35%', left: '3%', animation: 'drift 10s ease-in-out infinite 4s', zIndex: 0 }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #EED9A0, #B8922A 40%, #7A5A10)', border: '2px solid #C9A84C', boxShadow: '0 4px 18px rgba(201,168,76,0.3), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
            <div style={{ position: 'absolute', inset: '5px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' }} />
          </div>
        </div>

        {/* Decorative ring behind logo */}
        <div style={{
          position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)',
          width: '320px', height: '320px',
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.1)',
          boxShadow: '0 0 80px rgba(201,168,76,0.08)',
        }} />
        <div style={{
          position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)',
          width: '420px', height: '420px',
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.05)',
        }} />

        {/* Badge */}
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-[11px] font-bold uppercase tracking-widest relative"
          style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}
        >
          <Star size={11} fill="#C9A84C" />
          NIT Carrom Championship 2025
        </div>

        {/* Logo with glow */}
        <div className="relative mb-8" style={{ width: '180px', height: '180px' }}>
          <div style={{
            position: 'absolute', inset: '-20px',
            background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
            borderRadius: '50%',
          }} />
          <Image src="/logo.png" alt="NIT Carrom Championship" fill style={{ objectFit: 'contain', position: 'relative', zIndex: 1 }} priority />
        </div>

        <h1 className="text-[42px] lg:text-[68px] font-black leading-tight mb-5 max-w-3xl" style={{ letterSpacing: '-0.02em' }}>
          The Ultimate{' '}
          <span style={{
            background: 'linear-gradient(90deg, #C9A84C 0%, #FFD97D 50%, #C9A84C 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Carrom
          </span>
          <br />Championship
        </h1>

        <p className="text-[16px] lg:text-[18px] max-w-lg mb-10 leading-relaxed" style={{ color: '#5A7A9A' }}>
          Live match tracking, real-time scores, and player rankings for the NIT College Carrom Tournament.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/carrom"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl no-underline text-[15px] font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #A8832A, #C9A84C, #E8C96A)', color: '#060C18', boxShadow: '0 4px 24px rgba(201,168,76,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 32px rgba(201,168,76,0.65)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,168,76,0.4)'}>
            <LayoutDashboard size={18} /> View Dashboard
          </Link>
          <Link href="/carrom/leaderboard"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl no-underline text-[15px] font-semibold transition-all"
            style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C', backdropFilter: 'blur(10px)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'; }}>
            <Trophy size={18} /> Leaderboard
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2" style={{ color: '#2A3A50' }}>
          <p className="text-[11px] uppercase tracking-widest">Scroll to explore</p>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(180deg, rgba(201,168,76,0.4), transparent)' }} />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="relative px-4 lg:px-16 mb-20" style={{ zIndex: 1 }}>
        <div
          className="rounded-2xl px-8 py-7"
          style={{
            background: 'rgba(15,30,53,0.7)',
            border: '1px solid rgba(201,168,76,0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.1)',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
            {[
              { value: '3', label: 'Categories', sub: 'Singles · Doubles · Mixed' },
              { value: '∞', label: 'Players', sub: 'Open registration' },
              { value: 'Live', label: 'Scores', sub: 'Real-time updates' },
              { value: '#1', label: 'Rankings', sub: 'Win-rate based' },
            ].map((s, i) => (
              <div key={s.label} className={i > 0 ? 'pl-6' : ''}>
                <p className="text-[36px] font-black leading-none mb-1" style={{
                  background: 'linear-gradient(135deg, #C9A84C, #FFD97D)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{s.value}</p>
                <p className="text-[13px] font-semibold" style={{ color: '#F0F4FF' }}>{s.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: '#3D5A80' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative px-6 lg:px-16 mb-24" style={{ zIndex: 1 }}>
        <div className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-widest font-bold mb-3" style={{ color: '#C9A84C' }}>Features</p>
          <h2 className="text-[30px] lg:text-[40px] font-black" style={{ letterSpacing: '-0.01em' }}>
            Everything you need to{' '}
            <span style={{
              background: 'linear-gradient(90deg, #C9A84C, #FFD97D)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>run a tournament</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            { icon: <Zap size={22} />, color: '#EF4444', title: 'Live Match Tracking', desc: 'Set matches live, update scores in real time, and declare winners instantly from the admin panel.' },
            { icon: <Trophy size={22} />, color: '#C9A84C', title: 'Auto Leaderboard', desc: 'Player rankings update automatically after every match, sorted by win rate and total wins.' },
            { icon: <Users size={22} />, color: '#4A9EBF', title: '3 Match Categories', desc: 'Singles (gender-based), Doubles (open), and Mixed Doubles — all managed from one dashboard.' },
            { icon: <Shield size={22} />, color: '#818CF8', title: 'Secure Admin Panel', desc: 'Password-protected admin portal to manage players, generate brackets, and control match flow.' },
            { icon: <LayoutDashboard size={22} />, color: '#22C55E', title: 'Tournament Brackets', desc: 'Auto-generate Round 1 brackets and advance winners to the next round with one click.' },
            { icon: <Star size={22} />, color: '#F59E0B', title: 'Mobile Friendly', desc: 'Fully responsive design — view live scores and standings from any device, anywhere.' },
          ].map(f => (
            <div key={f.title}
              className="rounded-2xl p-6 transition-all duration-200 group"
              style={{
                background: 'rgba(15,30,53,0.6)',
                border: '1px solid rgba(201,168,76,0.08)',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${f.color}30`;
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${f.color}15`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}14`, border: `1px solid ${f.color}25` }}>
                <span style={{ color: f.color }}>{f.icon}</span>
              </div>
              <h3 className="text-[15px] font-bold mb-2" style={{ color: '#F0F4FF' }}>{f.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: '#5A7A9A' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="relative px-4 lg:px-16 mb-24" style={{ zIndex: 1 }}>
        <div
          className="rounded-3xl p-8 lg:p-14"
          style={{
            background: 'rgba(15,30,53,0.5)',
            border: '1px solid rgba(201,168,76,0.15)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'inset 0 1px 0 rgba(201,168,76,0.1)',
          }}
        >
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-widest font-bold mb-3" style={{ color: '#C9A84C' }}>Match Categories</p>
            <h2 className="text-[28px] font-black" style={{ color: '#F0F4FF' }}>Three ways to compete</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { href: '/carrom/single', label: 'Singles', emoji: '🎯', desc: 'Individual 1v1 matches, grouped by gender. Male and Female categories compete separately.', color: '#60A5FA' },
              { href: '/carrom/double', label: 'Doubles', emoji: '🤝', desc: 'Open category — any 2 players can form a team. No gender restrictions.', color: '#C9A84C' },
              { href: '/carrom/mixed', label: 'Mixed Doubles', emoji: '💑', desc: 'Teams must consist of exactly 1 Male and 1 Female player.', color: '#F472B6' },
            ].map(c => (
              <Link key={c.label} href={c.href}
                className="flex flex-col p-6 rounded-2xl no-underline transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.color}18` }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${c.color}08`;
                  e.currentTarget.style.borderColor = `${c.color}40`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = `${c.color}18`;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                <span className="text-[36px] mb-4">{c.emoji}</span>
                <p className="text-[18px] font-bold mb-2" style={{ color: c.color }}>{c.label}</p>
                <p className="text-[13px] leading-relaxed flex-1" style={{ color: '#5A7A9A' }}>{c.desc}</p>
                <div className="flex items-center gap-1 mt-5 text-[12px] font-semibold" style={{ color: c.color }}>
                  View matches <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative text-center px-6 pb-24" style={{ zIndex: 1 }}>
        <div
          className="max-w-2xl mx-auto rounded-3xl px-8 py-14"
          style={{
            background: 'rgba(15,30,53,0.6)',
            border: '1px solid rgba(201,168,76,0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 80px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)',
          }}
        >
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <Image src="/logo.png" alt="NIT Carrom" fill style={{ objectFit: 'contain' }} />
          </div>
          <h2 className="text-[30px] lg:text-[38px] font-black mb-4" style={{ letterSpacing: '-0.01em' }}>
            Ready to see the{' '}
            <span style={{
              background: 'linear-gradient(90deg, #C9A84C, #FFD97D)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>action?</span>
          </h2>
          <p className="text-[15px] mb-8" style={{ color: '#5A7A9A' }}>
            Follow live matches, check standings, and see who's climbing the leaderboard.
          </p>
          <Link href="/carrom"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl no-underline text-[15px] font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #A8832A, #C9A84C, #E8C96A)', color: '#060C18', boxShadow: '0 4px 24px rgba(201,168,76,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 36px rgba(201,168,76,0.65)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,168,76,0.4)'}>
            Enter Tournament <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative px-6 lg:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(201,168,76,0.08)', zIndex: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative" style={{ width: '26px', height: '26px' }}>
            <Image src="/logo.png" alt="NIT Carrom" fill style={{ objectFit: 'contain' }} />
          </div>
          <p className="text-[12px] font-semibold" style={{ color: '#3D5A80' }}>NIT Carrom Championship · v1.0</p>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: 'Dashboard', href: '/carrom' },
            { label: 'Leaderboard', href: '/carrom/leaderboard' },
            { label: 'Admin', href: '/admin/login' },
          ].map(l => (
            <Link key={l.label} href={l.href}
              className="text-[12px] no-underline transition-colors"
              style={{ color: '#3D5A80' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = '#3D5A80'}>
              {l.label}
            </Link>
          ))}
        </div>
        <p className="text-[11px]" style={{ color: '#1E3A5A' }}>Organized by NIT · College Tournament</p>
      </footer>
    </div>
  );
}
