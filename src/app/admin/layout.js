'use client';
import { usePathname } from 'next/navigation';
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin  = pathname === '/admin/login';

  if (isLogin) return <>{children}</>;

  return (
    <div style={{ height: '100vh', background: '#080F1C', display: 'flex', overflow: 'hidden' }}>
      <AdminSidebar />
      {/* Spacer = sidebar width */}
      <div className="admin-spacer" style={{ flexShrink: 0, width: '300px', display: 'none' }} />
      {/* Main content — fills remaining height, scrolls internally */}
      <main style={{
        flex: 1,
        minWidth: 0,
        height: '100vh',
        overflowY: 'auto',
        padding: '32px 40px 40px',
      }}>
        {children}
      </main>

      <style>{`
        @media (min-width: 1024px) { .admin-spacer { display: block !important; } }
        @media (max-width: 1023px) { main { padding: 20px 16px 100px !important; } }
      `}</style>
    </div>
  );
}
