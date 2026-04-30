'use client';
import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

// matchType: 'single' = 10 min, 'double'/'mixed' = 15 min
const DURATIONS = {
  single: 10 * 60,  // 600 seconds
  double: 15 * 60,  // 900 seconds
  mixed:  15 * 60,
};

export default function MatchTimer({ matchType, startedAt, status }) {
  const [secondsLeft, setSecondsLeft] = useState(null);

  useEffect(() => {
    if (status !== 'live' || !startedAt) return;

    const total    = DURATIONS[matchType] || 600;
    const started  = new Date(startedAt).getTime();

    function tick() {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      const left    = Math.max(0, total - elapsed);
      setSecondsLeft(left);
    }

    tick(); // immediate
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [matchType, startedAt, status]);

  if (status !== 'live' || secondsLeft === null) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const pct  = secondsLeft / (DURATIONS[matchType] || 600);

  // Color: green → amber → red
  const color = pct > 0.5 ? '#4ADE80' : pct > 0.2 ? '#F59E0B' : '#F87171';
  const isUrgent = pct <= 0.2;
  const isOver   = secondsLeft === 0;

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{
        background: `${color}10`,
        border: `1px solid ${color}30`,
      }}
    >
      <Timer
        size={14}
        style={{ color, flexShrink: 0 }}
        className={isUrgent && !isOver ? 'pulse-badge' : ''}
      />

      {isOver ? (
        <span className="text-[12px] font-black" style={{ color: '#F87171' }}>
          TIME UP
        </span>
      ) : (
        <span
          className="text-[13px] font-black tabular-nums"
          style={{ color, letterSpacing: '0.05em' }}
        >
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      )}

      {/* Progress bar */}
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)', minWidth: '40px' }}
      >
        <div
          style={{
            width: `${pct * 100}%`,
            height: '100%',
            background: color,
            borderRadius: '999px',
            transition: 'width 1s linear',
          }}
        />
      </div>
    </div>
  );
}
