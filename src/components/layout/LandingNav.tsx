/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Logo } from '../brand/Logo';

interface LandingNavProps {
  onEnterDemo: (tab?: string) => void;
}

const LINKS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'tentang', label: 'Tentang' },
  { id: 'fitur', label: 'Fitur' },
  { id: 'untuk-siapa', label: 'Untuk Siapa' },
  { id: 'faq', label: 'FAQ' }
];

export const LandingNav: React.FC<LandingNavProps> = ({ onEnterDemo }) => {
  const [active, setActive] = useState('beranda');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Scroll-spy: highlight the section crossing the upper-middle of the viewport.
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' }
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'bg-white/85 border-b border-[#E3E8F8] shadow-[0_6px_24px_-12px_rgba(63,85,240,0.25)]' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-3 sm:gap-6">
        <a href="#beranda" onClick={go('beranda')} aria-label="Adaptiv — ke beranda" className="shrink-0">
          {/* Logo lebih kecil di ponsel supaya header muat di 360 px tanpa memotong konten */}
          <span className="sm:hidden"><Logo variant="horizontal" transparent size="sm" /></span>
          <span className="hidden sm:inline"><Logo variant="horizontal" transparent size="md" /></span>
        </a>

        <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id)}
              aria-current={active === l.id ? 'true' : undefined}
              className={`relative px-4 py-2 text-[13px] font-bold rounded-full transition-colors ${
                active === l.id ? 'text-[#2455F0]' : 'text-[#0F1B4A] hover:text-[#2455F0]'
              }`}
            >
              {l.label}
              {active === l.id && (
                <motion.span
                  layoutId="landing-nav-underline"
                  className="absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full bg-[#2455F0]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => onEnterDemo('sesi')}
            className="hidden sm:inline-flex px-5 py-2 rounded-full border border-[#2455F0]/60 text-[#2455F0] text-xs font-bold hover:bg-[#2455F0] hover:text-white transition-colors"
          >
            Masuk
          </button>
          <button
            onClick={() => onEnterDemo('sesi')}
            className="group inline-flex items-center gap-1.5 whitespace-nowrap px-3 sm:px-5 py-2.5 rounded-full bg-[#2455F0] hover:bg-[#1E3FC4] text-white text-xs font-bold shadow-md shadow-[#2455F0]/25 transition-colors"
          >
            Mulai Sekarang
            <ArrowRight className="hidden sm:block w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            aria-controls="landing-mobile-menu"
            className="lg:hidden p-2.5 -mr-1 rounded-full text-[#0F1B4A] hover:bg-[#E4EAFF] transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="landing-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-[#E3E8F8]"
          >
            <nav aria-label="Navigasi seluler" className="p-4 grid gap-1">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold ${
                    active === l.id ? 'bg-[#E4EAFF] text-[#2455F0]' : 'text-[#0F1B4A] hover:bg-[#F6F8FF]'
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  onEnterDemo('sesi');
                }}
                className="mt-2 px-4 py-3 rounded-xl border border-[#2455F0]/60 text-[#2455F0] text-sm font-bold sm:hidden"
              >
                Masuk
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
