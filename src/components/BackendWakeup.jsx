'use client';
import { useEffect } from 'react';

// Pings the backend health endpoint on app load to wake up Render's free tier
// This runs silently in the background — no UI shown
export default function BackendWakeup() {
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    fetch(`${API}/health`, { method: 'GET' }).catch(() => {
      // Silently ignore — just waking up the server
    });
  }, []);

  return null;
}
