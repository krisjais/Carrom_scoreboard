'use client';
import { useEffect, useRef } from 'react';

const PIECES = [
  // Black coins
  { x: 0.3, y: 0.25, vx: 2.1, vy: 1.4,  r: 14, color: '#222', border: '#444',  glow: null },
  { x: 0.7, y: 0.3,  vx: -1.8, vy: 2.0, r: 14, color: '#222', border: '#444',  glow: null },
  { x: 0.2, y: 0.6,  vx: 2.5, vy: -1.2, r: 14, color: '#222', border: '#444',  glow: null },
  { x: 0.8, y: 0.7,  vx: -2.2, vy: -1.6,r: 14, color: '#222', border: '#444',  glow: null },
  { x: 0.5, y: 0.8,  vx: 1.6, vy: -2.3, r: 14, color: '#222', border: '#444',  glow: null },
  // White coins
  { x: 0.6, y: 0.2,  vx: -1.5, vy: 1.8, r: 14, color: '#D8D0C0', border: '#B8B0A0', glow: null },
  { x: 0.15, y: 0.4, vx: 2.3, vy: 1.1,  r: 14, color: '#D8D0C0', border: '#B8B0A0', glow: null },
  { x: 0.85, y: 0.5, vx: -1.9, vy: -2.1,r: 14, color: '#D8D0C0', border: '#B8B0A0', glow: null },
  { x: 0.4, y: 0.75, vx: 1.4, vy: -1.7, r: 14, color: '#D8D0C0', border: '#B8B0A0', glow: null },
  // Red queen
  { x: 0.5, y: 0.45, vx: 1.2, vy: 1.5,  r: 15, color: '#CC2222', border: '#FF4444', glow: 'rgba(239,68,68,0.6)' },
  // Striker (gold, bigger)
  { x: 0.35, y: 0.55, vx: -2.8, vy: 1.9, r: 20, color: '#C9A84C', border: '#FFD97D', glow: 'rgba(201,168,76,0.7)', isStriker: true },
];

export default function CarromBoard() {
  const canvasRef = useRef(null);
  const piecesRef = useRef(PIECES.map(p => ({ ...p })));
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Re-init positions on resize
      piecesRef.current.forEach((p, i) => {
        const orig = PIECES[i];
        p.x = orig.x * canvas.width;
        p.y = orig.y * canvas.height;
      });
    }

    resize();
    window.addEventListener('resize', resize);

    // Init absolute positions
    piecesRef.current.forEach((p, i) => {
      p.x = PIECES[i].x * canvas.width;
      p.y = PIECES[i].y * canvas.height;
    });

    function drawPiece(p) {
      ctx.save();

      // Glow for special pieces
      if (p.glow) {
        ctx.shadowColor = p.glow;
        ctx.shadowBlur  = p.isStriker ? 20 : 14;
      }

      // Shadow
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;
      if (!p.glow) {
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur  = 8;
      }

      // Main circle
      const grad = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.1, p.x, p.y, p.r);
      if (p.isStriker) {
        grad.addColorStop(0, '#FFE090');
        grad.addColorStop(0.5, '#C9A84C');
        grad.addColorStop(1, '#7A5A10');
      } else if (p.color === '#CC2222') {
        grad.addColorStop(0, '#FF8080');
        grad.addColorStop(0.5, '#CC2222');
        grad.addColorStop(1, '#880000');
      } else if (p.color === '#D8D0C0') {
        grad.addColorStop(0, '#F5EEE0');
        grad.addColorStop(0.5, '#D8D0C0');
        grad.addColorStop(1, '#A8A098');
      } else {
        grad.addColorStop(0, '#555');
        grad.addColorStop(0.5, '#222');
        grad.addColorStop(1, '#000');
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Border ring
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = p.border;
      ctx.lineWidth   = p.isStriker ? 2.5 : 1.5;
      ctx.stroke();

      // Inner ring detail
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = p.isStriker ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)';
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Highlight spot
      ctx.beginPath();
      ctx.arc(p.x - p.r * 0.28, p.y - p.r * 0.28, p.r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fill();

      ctx.restore();
    }

    function checkCollisions() {
      const pieces = piecesRef.current;
      for (let i = 0; i < pieces.length; i++) {
        for (let j = i + 1; j < pieces.length; j++) {
          const a = pieces[i];
          const b = pieces[j];
          const dx   = b.x - a.x;
          const dy   = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minD = a.r + b.r;

          if (dist < minD && dist > 0) {
            // Separate overlapping pieces
            const overlap = (minD - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;

            // Elastic collision
            const dvx = a.vx - b.vx;
            const dvy = a.vy - b.vy;
            const dot  = dvx * nx + dvy * ny;
            if (dot > 0) {
              const impulse = dot * 0.92; // slight energy loss
              a.vx -= impulse * nx;
              a.vy -= impulse * ny;
              b.vx += impulse * nx;
              b.vy += impulse * ny;
            }
          }
        }
      }
    }

    function animate() {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const pieces = piecesRef.current;

      // Update positions
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Friction
        p.vx *= 0.9995;
        p.vy *= 0.9995;

        // Clamp minimum speed so pieces never fully stop
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < 1.2) {
          const angle = Math.random() * Math.PI * 2;
          p.vx = Math.cos(angle) * 1.5;
          p.vy = Math.sin(angle) * 1.5;
        }

        // Wall bounce
        if (p.x - p.r < 0) {
          p.x  = p.r;
          p.vx = Math.abs(p.vx) * 0.95;
        }
        if (p.x + p.r > W) {
          p.x  = W - p.r;
          p.vx = -Math.abs(p.vx) * 0.95;
        }
        if (p.y - p.r < 0) {
          p.y  = p.r;
          p.vy = Math.abs(p.vy) * 0.95;
        }
        if (p.y + p.r > H) {
          p.y  = H - p.r;
          p.vy = -Math.abs(p.vy) * 0.95;
        }
      });

      checkCollisions();

      // Draw pieces (black first, then white, then red, then striker on top)
      const order = [
        ...pieces.filter(p => p.color === '#222'),
        ...pieces.filter(p => p.color === '#D8D0C0'),
        ...pieces.filter(p => p.color === '#CC2222'),
        ...pieces.filter(p => p.isStriker),
      ];
      order.forEach(drawPiece);

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.55,
      }}
    />
  );
}
