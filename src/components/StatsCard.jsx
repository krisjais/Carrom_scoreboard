'use client';

export default function StatsCard({ icon, label, value, color = '#6366F1', subtext }) {
  return (
    <div
      className="rounded-xl p-5 transition-colors"
      style={{ background: '#16161E', border: '1px solid #1F1F2E' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#2A2A3A'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1F1F2E'}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#4A4A5E' }}>{label}</p>
        <span style={{ color, opacity: 0.7 }}>{icon}</span>
      </div>
      <p className="text-[32px] font-bold leading-none mb-1" style={{ color: '#F4F4F6' }}>{value}</p>
      {subtext && <p className="text-[12px]" style={{ color: '#4A4A5E' }}>{subtext}</p>}
    </div>
  );
}
