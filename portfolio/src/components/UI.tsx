import { ArrowUpRight, ArrowDown, Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { profile } from '../data/content';
import { DocumentButton } from './DocumentViewer';
import { useExperience } from '../hooks/useExperience';

export function SectionLabel({ number, children, light = false }: { number?: string; children: ReactNode; light?: boolean }) {
  return <div className={`section-label ${light ? 'light-label' : ''}`}><span className="crosshair" aria-hidden="true">+</span>{number && <span className="label-number">{number}</span>}<span>{children}</span></div>;
}
export function ButtonLink({ children, to, href, kind = 'primary', className = '' }: { children: ReactNode; to?: string; href?: string; kind?: 'primary' | 'secondary' | 'text'; className?: string }) {
  const cls = `button button-${kind} ${className}`;
  const content = <><span>{children}</span><ArrowUpRight size={18} /></>;
  if (to) return <Link to={to} className={cls} data-cursor="GO">{content}</Link>;
  const external = href?.startsWith('http');
  return <a className={cls} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} data-cursor="GO">{content}</a>;
}
export function ResumeLink({ kind = 'secondary', className = '' }: { kind?: 'primary' | 'secondary' | 'text'; className?: string }) {
  return <DocumentButton documentId="resume" kind={kind} className={className}>View my résumé</DocumentButton>;
}
export function TextLink({ children, to, href }: { children: ReactNode; to?: string; href?: string }) {
  const inner = <><span>{children}</span><ArrowUpRight size={17} /></>;
  if (to) return <Link className="text-link" to={to} data-cursor="GO">{inner}</Link>;
  return <a className="text-link" href={href} target="_blank" rel="noopener noreferrer" data-cursor="GO">{inner}</a>;
}
export function CopyEmail({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const { notify } = useExperience();
  async function copy() {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(profile.email);
      else {
        const area = document.createElement('textarea'); area.value = profile.email; area.style.position = 'fixed'; area.style.opacity = '0'; document.body.appendChild(area); area.select();
        const success = document.execCommand('copy'); area.remove(); if (!success) throw new Error('Clipboard unavailable');
      }
      setCopied(true); notify('Email address copied. Let’s start a conversation.'); window.setTimeout(() => setCopied(false), 2500);
    } catch { notify(`Email me at ${profile.email}`); }
  }
  return <button className={`copy-email ${compact ? 'compact' : ''}`} onClick={copy} aria-label={copied ? 'Email copied' : 'Copy email address'}>{copied ? <Check size={16} /> : <Copy size={16} />}{!compact && <span>{copied ? 'Copied' : 'Copy email'}</span>}</button>;
}
export function ScrollCue() {
  return <a className="scroll-cue" href="#selected-work" onClick={e => { e.preventDefault(); document.getElementById('selected-work')?.scrollIntoView({ behavior: document.documentElement.dataset.motion === 'off' ? 'auto' : 'smooth' }); }}><span className="scroll-line" /><span>SCROLL TO INVESTIGATE</span><ArrowDown size={13} /></a>;
}
export function Tag({ children }: { children: ReactNode }) { return <span className="tag">{children}</span>; }
export function PageIntro({ label, title, description, number }: { label: string; title: ReactNode; description: string; number: string }) {
  return <header className="page-intro container"><SectionLabel number={number}>{label}</SectionLabel><h1 className="page-title" data-reveal>{title}</h1><p className="page-description" data-reveal>{description}</p></header>;
}
