import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowUp, Github, Linkedin, Menu, X, Search, Command, Pause, Play, ShieldCheck, CornerDownLeft } from 'lucide-react';
import { projects, profile } from '../data/content';
import { useDialog, useExperience } from '../hooks/useExperience';
import { ButtonLink, CopyEmail, SectionLabel } from './UI';

const navigation = [ { label: 'Overview', path: '/', index: '01' }, { label: 'Projects', path: '/projects', index: '02' }, { label: 'Journey', path: '/journey', index: '03' }, { label: 'Credentials', path: '/credentials', index: '04' } ];
export function Mark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark ${small ? 'small' : ''}`} aria-hidden="true"><svg viewBox="0 0 48 52"><path d="M24 2 45 11v16c0 10-13 18-21 23C16 45 3 37 3 27V11Z" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M14 13h4M30 13h4M9 27h3M36 27h3M22 42h4" fill="none" stroke="currentColor" opacity=".4" /></svg><span>JC<span className="mint">.</span></span></span>;
}
export function Header({ onSearch }: { onSearch: () => void }) {
  const [menu, setMenu] = useState(false);
  const close = useCallback(() => setMenu(false), []);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { motion, toggleMotion } = useExperience();
  useDialog(menu, close, ref);
  useEffect(() => setMenu(false), [location.pathname]);
  useEffect(() => {
    const update = () => { const max = document.documentElement.scrollHeight - innerHeight; document.documentElement.style.setProperty('--scroll-progress', `${max > 0 ? Math.min(scrollY / max, 1) : 0}`); };
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [location.pathname]);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="reading-progress" aria-hidden="true" />
    <header className="site-header"><div className="header-inner container">
      <Link to="/" className="brand" aria-label="Jefrine Correya, home"><Mark /><span className="brand-name">JEFRINE<br />CORREYA</span><span className="brand-slash">/</span><span className="brand-domain">SECURITY<br />OPERATIONS</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span className="nav-index">{item.index}</span><span>{item.label}</span></NavLink>)}</nav>
      <div className="header-actions"><button className="search-trigger" onClick={onSearch} aria-label="Search portfolio, Control K"><Search size={16} /><span>⌘ K</span></button><Link to="/contact" className="header-cta"><span>Contact</span><ArrowUpRight size={16} /></Link><button className="menu-trigger" aria-expanded={menu} aria-controls="mobile-menu" aria-label="Open navigation" onClick={() => setMenu(true)}><Menu size={22} /></button></div>
    </div></header>
    {menu && <div className="mobile-menu-overlay" ref={ref} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation"><div className="mobile-menu-top"><Link to="/" className="brand" onClick={close}><Mark /><span className="brand-name">JEFRINE<br />CORREYA</span></Link><button onClick={close} className="icon-button" aria-label="Close navigation"><X /></button></div><nav aria-label="Mobile navigation">{navigation.map(item => <Link key={item.path} to={item.path} onClick={close}><span>{item.index}</span>{item.label}<ArrowUpRight /></Link>)}<Link to="/contact" onClick={close}><span>05</span>Contact<ArrowUpRight /></Link></nav><div className="mobile-menu-bottom"><span className="mono">DOHA · QATAR</span><button className="motion-toggle" onClick={toggleMotion}>{motion ? <Pause size={12} /> : <Play size={12} />}Motion {motion ? 'on' : 'off'}</button></div></div>}
  </>;
}
export function Footer({ minimal = false }: { minimal?: boolean }) {
  const { motion, toggleMotion } = useExperience();
  return <footer className="site-footer" id="contact">
    {!minimal && <div className="contact-band container" data-reveal><div className="contact-band-top"><SectionLabel number="05">ESTABLISH A CONNECTION</SectionLabel><span className="mono muted">GOOD SECURITY IS A TEAM EFFORT.</span></div><div className="contact-band-main"><h2>Let’s make<br /><span className="mint">the next move.</span><span className="contact-dot">↗</span></h2><div className="contact-band-copy"><p>Looking for an analyst who understands the logs—and the bigger picture?</p><ButtonLink to="/contact">Let’s work together</ButtonLink><div className="email-row"><a href={`mailto:${profile.email}`}>{profile.email}</a><CopyEmail compact /></div></div></div></div>}
    <div className="footer-bottom container"><div className="footer-identity"><Link to="/" className="brand"><Mark small /><span>Jefrine Correya<span className="footer-identity-role">SOC ANALYST · DOHA, QATAR</span></span></Link></div><div className="footer-socials"><a href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={15} /><span>GitHub</span><ArrowUpRight size={12} /></a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={15} /><span>LinkedIn</span><ArrowUpRight size={12} /></a></div><button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: motion ? 'smooth' : 'auto' })}>Back to top<ArrowUp size={14} /></button></div>
    <div className="footer-meta container"><span>© {new Date().getFullYear()} Jefrine Correya</span><span className="privacy-note"><ShieldCheck size={12} />No trackers. No live scans. Just a portfolio.</span><button className="motion-toggle" onClick={toggleMotion} aria-pressed={!motion} aria-label={motion ? 'Turn off animations' : 'Turn on animations'}>{motion ? <Pause size={11} /> : <Play size={11} />}MOTION: {motion ? 'ON' : 'OFF'}</button></div>
  </footer>;
}

export function CommandPalette({ open, close }: { open: boolean; close: () => void }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useDialog(open, close, ref);
  useEffect(() => { if (open) { setQuery(''); setIndex(0); } }, [open]);
  const entries = [...navigation.map(n => ({ title: n.label, detail: 'PAGE', path: n.path })), { title: 'Contact / Hire Jefrine', detail: 'PAGE', path: '/contact' }, ...projects.map(p => ({ title: p.title, detail: p.category, path: `/projects/${p.slug}` }))];
  const results = entries.filter(e => `${e.title} ${e.detail}`.toLowerCase().includes(query.toLowerCase())).slice(0, 7);
  useEffect(() => setIndex(0), [query]);
  if (!open) return null;
  const select = (path: string) => { close(); navigate(path); };
  return <div className="dialog-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}><div className="command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title" ref={ref}>
    <div className="command-heading"><span id="command-title"><Command size={15} />PORTFOLIO QUICK ACCESS</span><button className="icon-button" onClick={close} aria-label="Close search"><X size={18} /></button></div>
    <div className="command-input"><Search size={21} /><input aria-label="Search pages and projects" value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a project, skill, or page…" onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setIndex(i => Math.min(i + 1, results.length - 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); setIndex(i => Math.max(i - 1, 0)); } if (e.key === 'Enter' && results[index]) select(results[index].path); }} /></div>
    <div className="command-results" aria-live="polite">{results.length ? results.map((r, i) => <button key={r.path} onClick={() => select(r.path)} onMouseEnter={() => setIndex(i)} className={i === index ? 'selected' : ''}><span><span className="command-result-title">{r.title}</span><span className="command-result-detail">{r.detail}</span></span>{i === index ? <CornerDownLeft size={17} /> : <ArrowUpRight size={17} />}</button>) : <p className="empty-search">No matching signal. Try “Splunk”, “SOC”, or “Journey”.</p>}</div><div className="command-footer"><span>↑ ↓ TO NAVIGATE</span><span>↵ TO OPEN</span><span>ESC TO CLOSE</span></div>
  </div></div>;
}
