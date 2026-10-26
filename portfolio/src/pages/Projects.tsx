import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ArrowUpRight, Github, ChevronDown, FolderGit2 } from 'lucide-react';
import { categories, profile, projects } from '../data/content';
import repositories from '../data/repository-index.json';
import { PageIntro, SectionLabel, TextLink } from '../components/UI';
import { ProjectCard } from '../components/ProjectCard';

export function Projects() {
  const [params,setParams]=useSearchParams();
  const [query,setQuery]=useState(()=>params.get('q')||'');
  const [category,setCategory]=useState(()=>params.get('category')||'All work');
  const [archive,setArchive]=useState(false);
  // Local controls update immediately; URL synchronisation must not reintroduce stale filters during fast typing.
  useEffect(()=>{
    const next=new URLSearchParams();
    if(query)next.set('q',query);
    if(category!=='All work')next.set('category',category);
    if(next.toString()!==params.toString())setParams(next,{replace:true,preventScrollReset:true});
  },[query,category,params,setParams]);
  const update = (key:string,value:string) => { if(key==='q')setQuery(value);else setCategory(value); };
  const reset = () => { setQuery('');setCategory('All work'); };
  const filtered=projects.filter(p=>(category==='All work'||p.category===category)&&`${p.title} ${p.summary} ${p.stack.join(' ')} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageIntro label="THE PROJECT DOSSIER" number="02" title={<>The work.<br/><span className="mint">The evidence.</span></>} description="Security tools, SOC workflows, web builds, and documented labs. A collection of the things I’ve built—and the things they taught me."/><section className="project-archive container"><div className="project-filter-bar" data-reveal><div className="project-filters" aria-label="Filter projects by category">{['All work',...categories].map(c=><button key={c} className={category===c?'active':''} onClick={()=>update('category',c)} aria-pressed={category===c}>{c}<span>{c==='All work'?projects.length:projects.filter(p=>p.category===c).length}</span></button>)}</div><div className="project-search"><Search size={17}/><input aria-label="Search projects" value={query} onChange={e=>update('q',e.target.value)} placeholder="Find a signal…"/>{query&&<button onClick={()=>update('q','')} aria-label="Clear project search"><X size={16}/></button>}</div></div><div className="archive-status"><span><span className="status-dot"/>SHOWING {String(filtered.length).padStart(2,'0')} / {projects.length} PROJECTS</span><span>OPEN SOURCE. OPEN TO EXPLORATION.</span></div><div className="archive-project-grid">{filtered.map(p=><ProjectCard key={p.slug} project={p} index={projects.indexOf(p)}/>)}</div>{!filtered.length&&<div className="no-results" role="status"><Search size={29}/><h2>No matching signal.</h2><p>Try a tool name like “Python”, a project like “Wazuh”, or clear the filters.</p><button className="button button-primary" onClick={reset}>Reset filters<ArrowUpRight size={17}/></button></div>}</section><section className="repository-section container" data-reveal><div className="repository-heading"><div><SectionLabel>BEYOND THE CASE STUDIES</SectionLabel><h2>Every public thread.</h2><p>Original versions, interface experiments, lab reports, and portfolio builds. The complete public repository index.</p></div><TextLink href={profile.github}>Explore GitHub <Github size={16}/></TextLink></div><button className={`repository-toggle ${archive?'expanded':''}`} onClick={()=>setArchive(v=>!v)} aria-expanded={archive} aria-controls="repository-index"><span><FolderGit2 size={19}/>Public repository index<span className="repo-count">{repositories.length}</span></span><span>{archive?'CLOSE INDEX':'OPEN INDEX'}<ChevronDown size={17}/></span></button>{archive&&<div id="repository-index" className="repository-index">{repositories.map((r,i)=><a key={r.name} href={r.html_url} target="_blank" rel="noopener noreferrer"><span className="repo-index">{String(i+1).padStart(2,'0')}</span><div><span>{r.name}</span>{r.description&&<p>{r.description}</p>}</div><span className="repo-language">{r.language||'Repository'}</span><ArrowUpRight size={15}/></a>)}</div>}<p className="repository-source-note">Repository inventory captured from the public GitHub profile on 14 October 2026. Case-study content is based on the original site, résumé, README files, and public implementations.</p></section></>;
}
