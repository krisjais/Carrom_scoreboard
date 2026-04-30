'use client';
import { useEffect } from 'react';
import { prefetchAll } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function ping() {
  fetch(`${API}/health`, { method: 'GET', cache: 'no-store' }).catch(() => {});
}

export default function BackendWakeup() {
  useEffect(() => {
    // 1. Ping immediately to wake Render
    ping();

    // 2. Prefetch all data right away — don't wait
    prefetchAll();

    // 3. Prefetch again after 2s (in case backend was cold)
    const t1 = setTimeout(() => prefetchAll(), 2000);

    // 4. Keep Render warm — ping every 8 minutes
    const keepAlive = setInterval(ping, 8 * 60 * 1000);

    return () => {
      clearTimeout(t1);
      clearInterval(keepAlive);
    };
  }, []);

  return null;
}
