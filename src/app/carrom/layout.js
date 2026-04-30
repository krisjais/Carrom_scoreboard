'use client';
import Sidebar from "@/components/Sidebar";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { prefetchAll } from '@/lib/api';

export default function CarromLayout({ children }) {
  const pathname = usePathname();

  // Re-prefetch on every route change so next page is always warm
  useEffect(() => {
    prefetchAll();
  }, [pathname]);

  return (
    <div style={{ minHeight: '100vh', background: '#080F1C', display: 'flex' }}>
      <Sidebar />
      <div className="sidebar-spacer" style={{ flexShrink: 0, width: '300px', display: 'none' }} />
      <main style={{ flex: 1, minWidth: 0, padding: '36px 48px 80px' }}>
        {children}
      </main>
      <style>{`
        @media (min-width: 1024px) { .sidebar-spacer { display: block !important; } }
        @media (max-width: 1023px) { main { padding: 24px 20px 100px !important; } }
      `}</style>
    </div>
  );
}
