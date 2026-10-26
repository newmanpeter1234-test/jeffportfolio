import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, Download, Film, FileText, Play, RotateCcw } from 'lucide-react';
import { asset } from '../hooks/useExperience';
import { PageIntro, SectionLabel } from '../components/UI';
import film from '../data/showreel.json';
import '../showreel.css';

const LIVE_FILM = 'https://jefrine-correya-portfolio.vercel.app/showreel';
function timestamp(value: number) { return `0:${String(Math.floor(value)).padStart(2, '0')}`; }
export function Showreel() {
  const video = useRef<HTMLVideoElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [notice, setNotice] = useState('');
  const offline = Boolean(window.__OFFLINE_PREVIEW__);
  useEffect(() => {
    const node = container.current, media = video.current;
    if (!node || !media) return;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) media.pause(); }, { threshold: 0 });
    observer.observe(node);
    const visibility = () => { if (document.hidden) media.pause(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); media.pause(); };
  }, []);
  function play() {
    const media = video.current;
    if (!media || offline) return;
    setRequested(true); setFailed(false); setNotice('');
    if (failed || !media.getAttribute('src')) { media.src = asset(film.master.video); if (failed) media.load(); }
    media.play().catch(error => {
      if (error?.name !== 'AbortError') setNotice(media.error ? 'The film could not load. Your connection or browser may be preventing playback.' : 'Playback could not start. Select Play again or download the MP4.');
    });
  }
  return <div className="showreel-page">
    <PageIntro label="THE CINEMATIC PROJECT FILM" number="FILM" title={<>Security,{' '}<br/><span className="mint">in perspective.</span></>} description="Eight real projects. One spatial journey through the work—from security tools to the evidence behind the lab."/>
    <section className="film-room container" aria-label="Watch the portfolio film">
      <div className="film-room-meta"><span><Film size={14}/>{film.master.duration} SECONDS / EIGHT PROJECTS</span><span>SILENT FILM / OFFLINE-RENDERED 3D</span></div>
      <div ref={container} className="film-player" data-state={failed ? 'failed' : ready ? 'ready' : 'poster'}>
        {(!ready || failed || offline) && (!posterFailed ? <img className="film-poster" src={asset(film.master.poster)} alt="Jefrine Correya’s real project interfaces in a spatial gallery" width="1280" height="720" onError={() => setPosterFailed(true)}/> : <div className="film-poster-fallback"><Film size={40}/><strong>The project film</strong><span>Eight real projects. Source-backed work.</span></div>)}
        {!offline && <video ref={video} className={ready && !failed ? 'master-video is-ready' : 'master-video'} muted playsInline controls={requested} preload="none" tabIndex={ready ? 0 : -1} aria-label={`${film.master.duration}-second cinematic cybersecurity portfolio film`} aria-describedby="film-scope"
          onPlaying={event => { const media = event.currentTarget; setReady(true); setFailed(false); setNotice(''); requestAnimationFrame(() => media.focus({ preventScroll: true })); }} onError={() => { if (video.current?.getAttribute('src')) { setFailed(true); setReady(false); setNotice('The film could not load. Your connection or browser may be preventing playback.'); } }}>
          <track kind="captions" src={requested ? asset('/media/cybersecurity-showreel.en.vtt') : undefined} srcLang="en" label="Scene descriptions (English)"/>
        </video>}
        {!offline && (!requested || failed || (notice && !ready)) && <button type="button" className="film-start" onClick={play}>{failed ? <RotateCcw size={24}/> : <Play size={25}/>}<span>{failed ? 'Try playback again' : `Play the ${film.master.duration}-second film`}<span>REAL INTERFACES. ACTUAL PROJECTS.</span></span></button>}
        {offline && <a href={LIVE_FILM} target="_blank" rel="noopener noreferrer" className="film-start"><Play size={24}/><span>Watch the live film<span>STATIC POSTER IN THE OFFLINE COPY</span></span><ArrowUpRight size={18}/></a>}
      </div>
      {notice && <p className="film-notice" role="status">{notice}</p>}
      <div className="film-room-bottom"><p id="film-scope">{film.disclosure} API-dependent tools are shown without fabricated lookups; password feedback uses a synthetic example. Published captures are not new security events.</p>{!offline && <a className="film-download" href={asset(film.master.video)} download="Jefrine-Correya-Cybersecurity-Showreel.mp4"><Download size={15}/>Download MP4</a>}</div>
    </section>
    <section className="film-evidence container" aria-labelledby="film-projects-title">
      <div className="film-evidence-heading"><div><SectionLabel>THE WORK BEHIND THE FRAMES</SectionLabel><h2 id="film-projects-title">Eight projects.<br/><span className="muted-heading">Every frame has a source.</span></h2></div><p>The camera is cinematic. The interfaces, code and laboratory evidence are real. Explore the original case studies and public implementations.</p></div>
      <ol className="film-projects">{film.projects.map((project, index) => <li key={project.id}><span className="film-project-index">{String(index + 1).padStart(2, '0')}</span><div><span className="film-project-category">{project.category} / {timestamp(project.start)}</span><h3><Link to={`/projects/${project.slug}`}>{project.title}<ArrowUpRight size={17}/></Link></h3><p>{project.feature}</p><span className="film-project-scope">{project.evidence}</span></div><a href={project.source} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} source`} className="film-source">Source<ArrowUpRight size={15}/></a></li>)}</ol>
      <details className="film-transcript"><summary><FileText size={16}/>Read the film transcript and scene descriptions</summary><div><p><strong>0:00–0:03 — Opening.</strong> Jefrine Correya. Security, with intent. The camera moves forward through a dark spatial environment toward the portfolio identity.</p>{film.projects.map(project => <p key={project.id}><strong>{timestamp(project.start)}–{timestamp(project.end)} — {project.title}.</strong> {project.feature} {project.note.join('. ')}. {project.evidence.toLowerCase()}.</p>)}<p><strong>0:35–0:41 — Signature.</strong> The camera pulls back to show all eight project displays. Jefrine Correya. Beyond the noise. Security, with intent. There is no audio track or live security feed.</p></div></details>
      <Link to="/projects" className="film-return"><ArrowLeft size={15}/>Explore all 19 projects and labs</Link>
    </section>
  </div>;
}
