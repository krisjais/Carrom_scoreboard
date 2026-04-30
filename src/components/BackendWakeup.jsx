'use client';
import { useEffect } from 'react';
import { prefetchAll } from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function ping() {
  fetch(`${API}/health`, { method: 'GET' }).catch(() => {});
}

export default function BackendWakeup() {
  useEffect(() => {
    // Immediate ping on load
    ping();

    // Prefetch all data 1s after load (backend should be awake by then)
    const prefetchTimer = setTimeout(() => prefetchAll(), 1000);

    // Keep Render warm — ping every 10 minutes
    const keepAlive = setInterval(ping, 10 * 60 * 1000);

    return () => {
      clearTimeout(prefetchTimer);
      clearInterval(keepAlive);
    };
  }, []);

  return null;
}
