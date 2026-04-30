'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const prevPath  = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPath.current) {
      // New route — complete the bar
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      prevPath.current = pathname;
    }
  }, [pathname]);

  // Start progress on link click
  useEffect(() => {
    function handleClick(e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href === pathname) return;

      setVisible(true);
      setProgress(15);

      // Simulate progress
      let p = 15;
      timerRef.current = setInterval(() => {
        p += Math.random() * 12;
        if (p >= 85) { clearInterval(timerRef.current); p = 85; }
        setProgress(p);
      }, 200);
    }

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      clearInterval(timerRef.current);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '2px',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #C9A84C, #FFD97D)',
        zIndex: 9999,
        transition: progress === 100 ? 'width 0.2s ease, opacity 0.3s ease' : 'width 0.4s ease',
        opacity: progress === 100 ? 0 : 1,
        boxShadow: '0 0 8px rgba(201,168,76,0.6)',
      }}
    />
  );
}
