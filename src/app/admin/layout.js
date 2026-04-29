'use client';
import { usePathname } from 'next/navigation';
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin  = pathname === '/admin/login';

  if (isLogin) return <>{children}</>;

  return (
    <div style={{ minHeight: '100vh', background: '#080F1C', display: 'flex' }}>
      <AdminSidebar />
      {/* Spacer = 300px sidebar width */}
      <div className="admin-spacer" style={{ flexShrink: 0, width: '300px', display: 'none' }} />
      <main style={{ flex: 1, minWidth: 0, padding: '36px 48px 80px' }}>
        {children}
      </main>
      <style>{`
        @media (min-width: 1024px) { .admin-spacer { display: block !important; } }
        @media (max-width: 1023px) { main { padding: 24px 20px 100px !important; } }
      `}</style>
    </div>
  );
}
