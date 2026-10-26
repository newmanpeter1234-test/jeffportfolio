import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header, Footer, CommandPalette } from './components/Shell';
import { useExperience } from './hooks/useExperience';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Journey } from './pages/Journey';
import { Credentials } from './pages/Credentials';
import { Contact } from './pages/Contact';
import { Sources } from './pages/Sources';
import { Showreel } from './pages/Showreel';
import { NotFound } from './pages/NotFound';
import { getProject } from './data/content';

gsap.registerPlugin(ScrollTrigger);
const seo: Record<string,{title:string;description:string}>={
  '/':{title:'Jefrine Correya — SOC Analyst & Cybersecurity Professional',description:'EC-Council Certified SOC Analyst based in Doha, Qatar. Explore Jefrine Correya’s security tools, Splunk and Wazuh labs, AI-assisted SOC workflows, experience, and certifications.'},
  '/projects':{title:'Project Dossier — Jefrine Correya',description:'Explore 19 real projects and labs: ASTRA Monitor, SOC Threat Detection Assistant, SLMS, phishing detection, PassChecker, SIEM labs, and security research.'},
  '/journey':{title:'Journey & Experience — Jefrine Correya',description:'Jefrine’s Wahy Lab Solutions experience, CICSA training at RedTeam Hacker Academy, BCA education, and practical cybersecurity toolkit.'},
  '/credentials':{title:'Credentials & Learning — Jefrine Correya',description:'EC-Council CSA v1 and RedTeam CICSA earned qualifications. CompTIA Security+ currently pursuing.'},
  '/contact':{title:'Hire / Contact — Jefrine Correya',description:'Connect with Jefrine Correya for SOC opportunities, security projects, or a professional conversation.'},
  '/showreel':{title:'Cinematic Project Film — Jefrine Correya',description:'Eight real cybersecurity projects in an offline-rendered 3D film, with source-backed interfaces, documented labs, and honest boundaries.'},
  '/sources':{title:'Content Sources — Jefrine Correya',description:'Traceable sources, explicit project boundaries, and factual content provenance for this portfolio.'},
};
export function App(){
  const location=useLocation(); const main=useRef<HTMLElement>(null); const firstRoute=useRef(true);
  const {motion}=useExperience(); const [search,setSearch]=useState(false);
  const closeSearch=useCallback(()=>setSearch(false),[]);
  useEffect(()=>{const listener=(e:KeyboardEvent)=>{if(document.querySelector('[data-document-viewer]'))return;if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearch(v=>!v);}};window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);},[]);
  useLayoutEffect(()=>{
    if(!motion||!main.current)return;
    const ctx=gsap.context(()=>{
      if(location.pathname==='/'){
        gsap.from('.hero-word',{y:60,opacity:0,duration:.95,stagger:.12,ease:'power3.out',clearProps:'all'});
        gsap.from('.hero-reveal',{y:17,opacity:0,duration:.8,stagger:.055,delay:.16,ease:'power2.out',clearProps:'all'});
      }
      main.current!.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el=>{
        gsap.from(el,{y:24,opacity:0,duration:.7,ease:'power2.out',clearProps:'all',scrollTrigger:{trigger:el,start:'top 94%',once:true}});
      });
    },main);
    const refresh=window.setTimeout(()=>ScrollTrigger.refresh(),180);
    return()=>{clearTimeout(refresh);ctx.revert();};
  },[location.pathname,motion]);
  useEffect(()=>{
    const project=location.pathname.startsWith('/projects/')?getProject(location.pathname.split('/')[2]):undefined;
    const info=project?{title:`${project.title} — Jefrine Correya`,description:project.summary}:seo[location.pathname]||{title:'404 — Jefrine Correya',description:'This page is off the radar. Return to Jefrine’s portfolio.'};
    document.title=info.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content',info.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',info.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content',info.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',`https://www.jeffsec.in${location.pathname}`);
    if(!firstRoute.current)main.current?.focus({preventScroll:true});firstRoute.current=false;
    const frame=requestAnimationFrame(()=>{
      if(location.hash){const id=decodeURIComponent(location.hash.slice(1));document.getElementById(id)?.scrollIntoView({behavior:motion?'smooth':'auto'});}
      else window.scrollTo({top:0,behavior:'instant'});
    });
    return()=>cancelAnimationFrame(frame);
  },[location.pathname,location.hash]);
  return <><Header onSearch={()=>setSearch(true)}/><main ref={main} id="main" tabIndex={-1} key={location.pathname}><Routes><Route path="/" element={<Home/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/:slug" element={<ProjectDetail/>}/><Route path="/journey" element={<Journey/>}/><Route path="/credentials" element={<Credentials/>}/><Route path="/contact" element={<Contact/>}/><Route path="/sources" element={<Sources/>}/><Route path="/showreel" element={<Showreel/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer minimal={location.pathname==='/contact'}/><div className="source-link-row container"><Link to="/sources">Content sources & boundaries</Link><span>JEFFSEC / PERSONAL PORTFOLIO</span></div></main><CommandPalette open={search} close={closeSearch}/></>;
}
