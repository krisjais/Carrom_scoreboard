'use client';
import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const CONFIG = {
  confirm: { icon: AlertCircle,  color: '#818CF8' },
  error:   { icon: AlertCircle,  color: '#F87171' },
  success: { icon: CheckCircle2, color: '#4ADE80' },
  info:    { icon: Info,         color: '#60A5FA' },
};

export default function Modal({ isOpen, onClose, onConfirm, title, message, type = 'confirm' }) {
  // Lock body scroll when modal is open so it always appears centered on screen
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;
  const { icon: Icon, color } = CONFIG[type] || CONFIG.confirm;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-xl p-6 relative animate-fade-in"
        style={{ background: '#16161E', border: '1px solid #2A2A3A', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md transition-colors"
          style={{ color: '#4A4A5E' }}
          onMouseEnter={e => e.currentTarget.style.color = '#8B8B9E'}
          onMouseLeave={e => e.currentTarget.style.color = '#4A4A5E'}
        >
          <X size={15} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #2A2A3A' }}>
            <Icon size={20} style={{ color }} />
          </div>
          <h3 className="text-[15px] font-bold mb-1.5" style={{ color: '#F4F4F6' }}>{title}</h3>
          <p className="text-[13px] mb-5 leading-relaxed" style={{ color: '#8B8B9E' }}>{message}</p>
          <div className="flex gap-2 w-full">
            {type === 'confirm' ? (
              <>
                <button onClick={onClose} className="btn-secondary flex-1 py-2.5 text-[13px]">Cancel</button>
                <button onClick={() => { onConfirm?.(); onClose(); }} className="btn-primary flex-1 py-2.5 text-[13px]">Confirm</button>
              </>
            ) : (
              <button onClick={onClose} className="btn-primary w-full py-2.5 text-[13px]">Got it</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
