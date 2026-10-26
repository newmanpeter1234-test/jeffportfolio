// Deterministic captures of actual project UI handlers/CSS, not invented results.
import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const wanted=(process.argv.find(x=>x.startsWith('--ids='))?.split('=')[1]||'astra,passchecker,url,scanner,soc').split(',');
const OUT='scripts/interface-motion/assets',TMP='.cache/interface-motion';await mkdir(OUT,{recursive:true});await mkdir(TMP,{recursive:true});
const fps=60,duration=2.4,frames=144,epoch=new Date('2026-10-22T12:49:48Z');
const browser=await chromium.launch({args:['--no-sandbox']});let ffmpeg;
const reports=[];
try{
 for(const id of wanted){
  const errors=[],requests=[],blocked=[];
  const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:id==='url'?3:1.5,reducedMotion:'no-preference',locale:'en-GB',timezoneId:'UTC'});
  page.on('pageerror',e=>errors.push(e.message));
  if(id==='astra')await page.addInitScript(()=>{const RealDate=Date;const stamp=RealDate.parse('2026-10-22T12:49:48Z');window.Date=class extends RealDate{constructor(...args){super(...(args.length?args:[stamp]));}static now(){return stamp;}};window.io=()=>({on(){},emit(){}});});
  await page.route('**/*',route=>{
   const r=route.request(),u=new URL(r.url());
   if(id==='astra'&&/socket\.io|socket.io-client|\/three@|chart\.js/.test(u.href))return route.fulfill({contentType:'text/javascript',body:'/* Capture-only: no monitoring/unused offscreen 3D. */'});
   if(r.method()!=='GET'&&!u.pathname.includes('_stcore')){requests.push(u.pathname);return route.abort();}
   if(!['localhost','127.0.0.1','cdn.jsdelivr.net','cdnjs.cloudflare.com','fonts.gstatic.com','fonts.googleapis.com'].includes(u.hostname)&&/^https?:/.test(u.protocol)){blocked.push(u.hostname);return route.abort();}
   return route.continue();
  });
  await page.goto(id==='soc'?'http://localhost:5053':`http://localhost:5052/${id}`,{waitUntil:'networkidle'});
  if(id==='astra'){
   await page.locator('#threatTable button').first().waitFor();
   await page.addStyleTag({content:'body{padding-bottom:800px!important}.navbar{position:fixed;top:0;left:0;right:0;z-index:1040;background:#030c10!important}#network{visibility:hidden}#td-confidence{visibility:hidden}tr:has(#td-confidence){display:none}#navbarNav>.d-flex{visibility:hidden}'});
   await page.locator('small').filter({hasText:'Model accuracy:'}).evaluateAll(nodes=>nodes.forEach(n=>n.style.visibility='hidden'));
   await page.evaluate(()=>scrollTo({top:document.getElementById('threats').offsetTop-150,behavior:'instant'}));
  }
  if(id==='soc'){
   await page.getByRole('heading',{name:'SOC Threat Detection Agent',exact:true}).waitFor();
   await page.addStyleTag({content:'.tip-card,[data-testid="stHeader"],[data-testid="stToolbar"]{display:none!important}[data-testid="stMainBlockContainer"]{padding-top:3rem!important}'});
  }
  if(id==='scanner')await page.locator('#scan').scrollIntoViewIfNeeded();
  await page.addStyleTag({content:'html{scroll-behavior:auto!important}*{caret-color:transparent!important}'});
  if(id==='passchecker'){await page.locator('#passwordInput').fill('Showcase-Example-2026!');await page.waitForTimeout(650);}
  await page.evaluate(()=>document.fonts.ready);
  const box=id==='url'?await page.locator('.bg-blur').boundingBox():id==='scanner'?await page.locator('#scan').boundingBox():null;
  if(box){box.x=Math.max(0,box.x);box.y=Math.max(0,box.y);}
  await page.clock.install({time:epoch});await page.clock.pauseAt(new Date(epoch.getTime()+1000));
  await page.evaluate(()=>{window.__uiTime=0;window.__uiAnimations=new Map();for(const a of document.getAnimations()){a.pause();window.__uiAnimations.set(a,0);}});
  const path=`${OUT}/${id}.mp4`;ffmpeg=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-an','-vf','scale=1600:-2:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p','-c:v','libx264','-preset','fast','-crf','16','-g','15','-bf','0','-profile:v','high','-level:v','4.2','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart','-threads','2',path],{stdio:['pipe','ignore','pipe']});
  let encoderLog='';ffmpeg.stderr.on('data',x=>encoderLog=(encoderLog+x).slice(-6000));ffmpeg.stdin.on('error',()=>{});
  const states=[];
  for(let frame=0;frame<frames;frame++){
   const t=frame/fps;
   await page.evaluate(({id,frame})=>{
    const input=(selector,value)=>{const el=document.querySelector(selector);const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')?.set;const setInput=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')?.set;if(el instanceof HTMLTextAreaElement)setter.call(el,value);else setInput.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));};
    if(id==='astra'){
     if(frame===20)document.querySelector('#threatTable button').click();
     if(frame===108)[...document.querySelectorAll('#threatDetailsModal button')].find(x=>x.textContent.includes('Close Investigation')).click();
    }
    if(id==='passchecker'){
     if(frame===14)input('#passwordInput','abc');
     if(frame===48)input('#passwordInput','Showcase-Example-2026!');
    }
    if(id==='url'){
     const value='https://example.invalid';if(frame===12)document.querySelector('#url').focus();
     if(frame>=18&&frame<18+value.length*2&&frame%2===0)input('#url',value.slice(0,(frame-18)/2+1));
     if(frame===98)document.querySelector('button[type="submit"]').focus();
     if(frame===118){input('#url','');document.activeElement.blur();}
    }
    if(id==='scanner'){
     if(frame===14){document.querySelector('#website-url').focus();input('#website-url','https://example.invalid');}
     if(frame===46){const radio=document.querySelector('#scan-comprehensive');radio.focus();radio.click();}
     if(frame===112){document.querySelector('#scan-quick').click();input('#website-url','');document.activeElement.blur();}
    }
    if(id==='soc'){
     const el=document.querySelector('textarea');
     if(frame===12)el.focus();
     if(frame===24)input('textarea','Documentation sample: connection from 192.0.2.10 on port 443');
     if(frame===112){input('textarea','');el.blur();}
    }
   },{id,frame});
   await page.clock.runFor(1000/fps);
   await page.evaluate(t=>{
    window.__uiTime=t;void document.body.offsetHeight;
    const live=document.getAnimations();
    for(const a of live)if(!window.__uiAnimations.has(a)){a.pause();window.__uiAnimations.set(a,t);}
    for(const[a,start]of window.__uiAnimations){try{a.currentTime=Math.max(0,(t-start)*1000);}catch{}}
   },t);
   const image=await page.screenshot({type:'jpeg',quality:99,animations:'allow',caret:'hide',...(box?{clip:box}:{})});
   if(!ffmpeg.stdin.write(image))await once(ffmpeg.stdin,'drain');
   if([0,36,72,120,143].includes(frame)){
    await writeFile(`${TMP}/${id}-${frame}.jpg`,image);
    states.push(await page.evaluate(({id,t})=>({time:t,input:document.querySelector(id==='url'?'#url':id==='scanner'?'#website-url':id==='soc'?'textarea':'#passwordInput')?.value||'',feedback:document.querySelector('#feedback')?.textContent||'',meterWidth:document.querySelector('#strengthFill')?getComputedStyle(document.querySelector('#strengthFill')).width:null,modalOpen:Boolean(document.querySelector('#threatDetailsModal.show')),mode:document.querySelector('input[name="scan-type"]:checked')?.value||null}),{id,t}));
   }
  }
  ffmpeg.stdin.end();const[status]=await once(ffmpeg,'close');if(status!==0)throw new Error(encoderLog);ffmpeg=null;
  if(errors.length||requests.length)throw new Error(id+' capture had errors/submissions: '+JSON.stringify({errors,requests}));
  reports.push({id,file:`${id}.mp4`,duration,fps,frames,errors,submissions:requests,blocked,actions:states,note:id==='passchecker'?'Synthetic sample only; genuine original local heuristic':id==='soc'?'Explicit documentation sample; no external lookup':id==='astra'?'Existing sample table / implemented modal / real dismissal':'Original form interaction only; no scan or API verdict'});
  console.log('CAPTURED',id,states);await page.close();
 }
}finally{if(ffmpeg&&!ffmpeg.stdin.destroyed)ffmpeg.stdin.end();await browser.close();}
let prior=[];try{prior=JSON.parse(await readFile(`${OUT}/manifest.json`,'utf8'));}catch{}
const merged=[...prior.filter(x=>!wanted.includes(x.id)),...reports];await writeFile(`${OUT}/manifest.json`,JSON.stringify(merged,null,2)+'\n');
