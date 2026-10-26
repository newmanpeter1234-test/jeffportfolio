import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

declare global {
  interface Window {
    __OFFLINE_PREVIEW__?: boolean;
    __PORTFOLIO_ASSETS__?: Record<string, string>;
  }
}
export const asset = (path: string) => window.__PORTFOLIO_ASSETS__?.[path] ?? path;
const ExperienceContext = createContext({ motion: true, toggleMotion: () => {}, notify: (_text: string) => {} });
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [motion, setMotion] = useState(() => {
    try { const stored = localStorage.getItem('jc-motion'); if (stored) return stored === 'on'; } catch { /* Storage is optional in the sandboxed file preview. */ }
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [toast, setToast] = useState('');
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off';
    try { localStorage.setItem('jc-motion', motion ? 'on' : 'off'); } catch { /* Optional storage. */ }
  }, [motion]);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(id);
  }, [toast]);
  return <ExperienceContext.Provider value={{ motion, toggleMotion: () => setMotion(v => !v), notify: setToast }}>
    {children}
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite"><span className="status-dot" />{toast}</div>
  </ExperienceContext.Provider>;
}
export const useExperience = () => useContext(ExperienceContext);

export function useDialog(open: boolean, onClose: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => {
      const target = ref.current?.querySelector<HTMLElement>('input') ?? ref.current?.querySelector<HTMLElement>('button,a,[tabindex="0"]');
      target?.focus();
    });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = ref.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]');
      if (!elements?.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', keydown);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', keydown); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, [open, onClose, ref]);
}
