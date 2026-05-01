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
      <div className="admin-spacer" style={{ flexShrink: 0, width: '300px', display: 'none' }} />
      <main style={{ flex: 1, minWidth: 0, padding: '32px 40px 60px', overflowX: 'hidden' }}>
        {children}
      </main>
      <style>{`
        @media (min-width: 1024px) { .admin-spacer { display: block !important; } }
        @media (max-width: 1023px) { main { padding: 70px 16px 40px !important; } }
      `}</style>
    </div>
  );
}
