import { FILM, projectLayout } from './config.mjs';
export const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));
export const smooth=value=>{const x=clamp(value);return x*x*x*(x*(x*6-15)+10);};
export const lerp=(a,b,t)=>a+(b-a)*t;
export const mix=(a,b,t)=>a.map((x,i)=>lerp(x,b[i],t));
export function localToWorld(project,point){
 const [x,y,z]=point,c=Math.cos(project.yaw),s=Math.sin(project.yaw);
 return [project.position[0]+x*c+z*s,project.position[1]+y,project.position[2]-x*s+z*c];
}
export function cameraKeys(mode){
 const projects=projectLayout(mode);const keys=[];
 if(mode==='master'){
  keys.push({time:0,position:[0,1,39],target:[0,.2,7]},{time:2.5,position:[0,.6,27],target:[0,0,9]});
  projects.forEach((p,i)=>{
   const start=3.25+i*4;
   (p.id==='url'?[0,1.6,2.85,3.45]:[.55,1.15,2.85,3.45]).forEach((offset,j)=>keys.push({station:p.id,time:start+offset,position:localToWorld(p,p.poses[j]),target:localToWorld(p,[0,-.55,0])}));
  });
  keys.push({time:38.2,position:[0,1,48],target:[0,-1,-6]},{time:41,position:[0,1.1,51],target:[0,-1,-6]});
 }else{
  projects.forEach((p,i)=>{
   const poses=i===0?[[3,1.1,13.4],[.35,.1,11],[-.35,.25,11.2],[-2,1.4,14]]:i===1?[[.7,-3.1,14],[-.25,-.15,11.5],[.35,.35,11.8],[1.2,2.7,14.5]]:[[-3.5,.8,13.6],[-.35,-.1,11.2],[.35,.1,11.5],[2,1.4,14]];
   [0,.65,2.25,2.8].forEach((offset,j)=>keys.push({station:p.id,time:i*3.6+offset,position:localToWorld(p,poses[j]),target:localToWorld(p,[0,-.55,0])}));
  });
  keys.push({...keys[0],time:FILM.heroDuration});
 }
 return keys;
}
export function sampleKeys(keys,time){
 if(time<=keys[0].time)return {...keys[0]};
 const end=keys.at(-1);if(time>=end.time)return {...end};
 const index=keys.findIndex(k=>k.time>time);const a=keys[index-1],b=keys[index];
 const u=smooth((time-a.time)/(b.time-a.time));
 const target=mix(a.target,b.target,u);
 let position=mix(a.position,b.position,u);
 if(a.station&&a.station===b.station){
  // A real orbital segment, not a chord through the screen. Preserve eased radial distance.
  const va=a.position.map((x,i)=>x-a.target[i]),vb=b.position.map((x,i)=>x-b.target[i]);
  const ra=Math.hypot(...va),rb=Math.hypot(...vb),na=va.map(x=>x/ra),nb=vb.map(x=>x/rb);
  const angle=Math.acos(clamp(na.reduce((sum,x,i)=>sum+x*nb[i],0),-1,1));
  const direction=angle<.0001?mix(na,nb,u):na.map((x,i)=>(x*Math.sin((1-u)*angle)+nb[i]*Math.sin(u*angle))/Math.sin(angle));
  const radius=lerp(ra,rb,u);position=target.map((x,i)=>x+direction[i]*radius);
 }
 return {position,target,interval:index-1};
}
export function stateAt(mode,time){
 const duration=mode==='hero'?FILM.heroDuration:FILM.masterDuration;
 const t=clamp(time,0,duration);const projects=projectLayout(mode);
 const current=mode==='hero'?Math.min(2,Math.floor(t/3.6)):Math.min(7,Math.max(0,Math.floor((t-3.25)/4)));
 const local=t-(mode==='hero'?current*3.6:3.25+current*4);
 const inProjects=mode==='hero'||(t>=3.25&&t<35.25);
 const opacity=inProjects?smooth((local-.20)/.35)*(1-smooth((local-(mode==='hero'?2.95:3.35))/.45)):0;
 const intro=mode==='master'?smooth(t/.65)*(1-smooth((t-2.1)/1.2)):0;
 const outro=mode==='master'?smooth((t-36.6)/1.1):0;
 return {time:t,duration,current,project:projects[current],local,opacity,intro,outro,...sampleKeys(cameraKeys(mode),t)};
}
