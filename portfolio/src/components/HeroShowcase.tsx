import { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { asset, useExperience } from '../hooks/useExperience';
import edit from '../data/liquid-glass.json';
import '../hero-showcase.css';
import '../showreel.css';
import '../liquid-glass.css';

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string; downlink?: number };
export type ShowcaseCollection = {
  video: string; poster: string; mobilePoster: string; duration: number;
  width: number; height: number; fps: number; description: string;
};
export const portfolioShowcase: ShowcaseCollection = edit;
function policy() {
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  return {
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    limited: Boolean(connection?.saveData || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || '') || (typeof connection?.downlink === 'number' && connection.downlink < 1.2)),
  };
}

export function HeroShowcase({ collection = portfolioShowcase }: { collection?: ShowcaseCollection }) {
  const { motion } = useExperience();
  const descriptionId = useId();
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [preferences, setPreferences] = useState(policy);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const offline = Boolean(window.__OFFLINE_PREVIEW__);
  // Mobile is eligible too; respect accessibility/data preferences and the browser's autoplay decision.
  const automatic = motion && !preferences.reduced && !preferences.limited;
  const permitted = !offline && !failed && (manual || automatic);
  const shouldPlay = permitted && visible && pageVisible && !paused && (!blocked || manual);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const update = () => { setPreferences(policy()); setManual(false); };
    reduce.addEventListener('change', update); connection?.addEventListener('change', update);
    return () => { reduce.removeEventListener('change', update); connection?.removeEventListener('change', update); };
  }, []);
  useEffect(() => { if (!motion) setManual(false); }, [motion]);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= .12), { threshold: [0, .12] });
    observer.observe(node);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    const media = video.current;
    if (!media) return;
    let cancelled = false;
    if (shouldPlay) {
      const timer = window.setTimeout(() => {
        if (cancelled) return;
        if (!media.getAttribute('src')) media.src = asset(collection.video);
        media.play()?.catch(() => {
          if (!cancelled && media.getAttribute('src')) { setBlocked(true); setPlaying(false); setReady(false); }
        });
      }, manual ? 0 : 250);
      return () => { cancelled = true; window.clearTimeout(timer); media.pause(); };
    }
    media.pause(); setPlaying(false);
    if (!permitted && media.getAttribute('src')) {
      media.removeAttribute('src'); media.load(); setReady(false);
    }
    return () => { cancelled = true; };
  }, [shouldPlay, permitted, manual, collection.video]);

  function toggle() {
    const media = video.current;
    if (!media || offline) return;
    if (playing) { setPaused(true); setPlaying(false); media.pause(); return; }
    setPaused(false); setManual(true); setBlocked(false); setFailed(false);
    if (failed || !media.getAttribute('src')) { media.src = asset(collection.video); if (failed) media.load(); }
    media.play()?.catch(error => { if (error?.name === 'AbortError') return; if (media.getAttribute('src')) { setBlocked(true); setManual(false); setReady(false); } });
  }
  return <figure ref={root} className="hero-showcase hero-showcase--glass" aria-label="Cinematic cybersecurity project preview" aria-describedby={descriptionId} data-state={failed ? 'fallback' : playing ? 'playing' : ready ? 'paused' : 'poster'}>
    <div className="showcase-window"><div className="showcase-stage">
      {!posterFailed ? <picture className="showcase-poster"><source media="(max-width:760px)" srcSet={asset(collection.mobilePoster)}/><img src={asset(collection.poster)} width={collection.width} height={collection.height} alt="Original cybersecurity dashboards with a restrained frosted-glass treatment" fetchPriority="high" decoding="async" onError={() => setPosterFailed(true)}/></picture> : <div className="showcase-image-fallback" aria-hidden="true"/>}
      <video ref={video} className={ready ? 'showcase-video is-ready' : 'showcase-video'} width={collection.width} height={collection.height} muted loop playsInline preload="none" aria-hidden="true" disablePictureInPicture
        onPlaying={event => { if (!shouldPlay || !event.currentTarget.getAttribute('src')) { event.currentTarget.pause(); return; } setPlaying(true); setReady(true); }} onPause={() => setPlaying(false)}
        onError={() => { if (video.current?.getAttribute('src')) { setFailed(true); setReady(false); setPlaying(false); } }}/>
      {!offline && <button type="button" className="showcase-playback glass-playback" onClick={toggle} aria-label={playing ? 'Pause project preview' : 'Play project preview'} title={playing ? 'Pause' : 'Play'}>{playing ? <Pause size={12}/> : <Play size={12}/>}</button>}
    </div></div>
    <figcaption id={descriptionId} className="sr-only">{collection.description}</figcaption>
    {failed && <span className="sr-only" role="status">Video unavailable. Static preview shown. Use the play control to retry.</span>}
  </figure>;
}
