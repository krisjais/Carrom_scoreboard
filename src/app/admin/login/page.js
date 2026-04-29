'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/api';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await adminLogin(password);
      if (res.success) { localStorage.setItem('adminToken', res.token); router.push('/admin'); }
    } catch (err) {
      setError(err.message || 'Invalid password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0A0A0F' }}>
      <div className="w-full max-w-[380px] animate-fade-in">

        {/* Logo + name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden relative mb-4"
            style={{ background: '#16161E', border: '1px solid #2A2A3A' }}>
            <Image src="/logo.png" alt="NIT Carrom" fill style={{ objectFit: 'contain', padding: '8px' }} priority />
          </div>
          <h1 className="text-[18px] font-bold" style={{ color: '#F4F4F6' }}>NIT Carrom</h1>
          <p className="text-[12px] mt-0.5" style={{ color: '#4A4A5E' }}>Championship · Admin Portal</p>
        </div>

        {/* Card */}
        <div className="rounded-xl p-6" style={{ background: '#16161E', border: '1px solid #1F1F2E' }}>
          <h2 className="text-[15px] font-semibold mb-1" style={{ color: '#F4F4F6' }}>Sign in</h2>
          <p className="text-[12px] mb-5" style={{ color: '#8B8B9E' }}>Enter your admin password to continue</p>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#4A4A5E' }} />
              <input
                type={show ? 'text' : 'password'}
                placeholder="Admin password"
                className="input-field pl-10 pr-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoFocus
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#4A4A5E' }}
                onMouseEnter={e => e.currentTarget.style.color = '#8B8B9E'}
                onMouseLeave={e => e.currentTarget.style.color = '#4A4A5E'}>
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {error && (
              <p className="text-[12px] py-2.5 px-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#F87171' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-[13px]">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] mt-5" style={{ color: '#2A2A3A' }}>
          Restricted access · Authorised personnel only
        </p>
      </div>
    </div>
  );
}
