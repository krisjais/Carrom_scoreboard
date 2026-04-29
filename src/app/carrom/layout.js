'use client';
import Sidebar from "@/components/Sidebar";

export default function CarromLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex' }}>
      <Sidebar />
      {/* Spacer = 300px sidebar width, hidden on mobile */}
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
