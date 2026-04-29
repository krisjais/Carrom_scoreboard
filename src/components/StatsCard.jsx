'use client';

export default function StatsCard({ icon, label, value, color = '#C9A84C', subtext }) {
  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden transition-all duration-200"
      style={{ background: '#0F1E35', border: '1px solid rgba(201,168,76,0.12)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.28)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.35)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Top corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />

      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#2E4A6A' }}>{label}</p>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
          <span style={{ color, display: 'flex' }}>{icon}</span>
        </div>
      </div>
      <p className="text-[34px] font-black leading-none mb-1" style={{ color: '#F0F4FF' }}>{value}</p>
      {subtext && <p className="text-[12px]" style={{ color: '#2E4A6A' }}>{subtext}</p>}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl"
        style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />
    </div>
  );
}
