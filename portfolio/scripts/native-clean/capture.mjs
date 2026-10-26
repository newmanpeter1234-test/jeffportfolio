// Original interfaces, now sampled at 2x/3x density. No invented content or API output.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const DIR='.cache/native-clean/captures';await mkdir(DIR,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox']});const log=[];
try{
 for(const id of ['astra','url','scanner','passchecker','soc']){
  const errors=[],blocked=[],submissions=[];
  const page=await browser.newPage({viewport:{width:1280,height:800},deviceScaleFactor:id==='url'?3:2,reducedMotion:'reduce',locale:'en-GB',timezoneId:'UTC'});
  page.on('pageerror',error=>errors.push(error.message));
  if(id==='astra')await page.addInitScript(()=>{
   const RealDate=Date;const stamp=Date.parse('2026-10-22T12:49:48Z');
   const FixedDate=class extends RealDate{constructor(...args){super(...(args.length?args:[stamp]));}static now(){return stamp;}};
   window.Date=FixedDate;window.io=()=>({on(){},emit(){}});
  });
  await page.route('**/*',route=>{
   const request=route.request(),url=new URL(request.url());
   if(id==='astra'&&/socket\.io|socket.io-client|\/three@|chart\.js/.test(url.href))return route.fulfill({contentType:'text/javascript',body:'/* Unused backend/3D/chart dependency omitted in capture only. */'});
   if(request.method()!=='GET'&&!url.pathname.includes('_stcore')){submissions.push(url.pathname);return route.abort();}
   if(!['localhost','127.0.0.1','cdn.jsdelivr.net','cdnjs.cloudflare.com','fonts.gstatic.com','fonts.googleapis.com'].includes(url.hostname)&&/^https?:/.test(url.protocol)){blocked.push(url.hostname);return route.abort();}
   return route.continue();
  });
  await page.goto(id==='soc'?'http://localhost:5053':`http://localhost:5052/${id}`,{waitUntil:'networkidle'});
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}html{scroll-behavior:auto!important}'});
  if(id==='astra'){
   await page.locator('#threatTable button').first().waitFor();
   await page.addStyleTag({content:'body{padding-bottom:800px!important}.navbar{position:fixed;top:0;left:0;right:0;z-index:1040;background:#030c10!important}#network{visibility:hidden}#td-confidence{visibility:hidden}tr:has(#td-confidence){display:none}#navbarNav>.d-flex{visibility:hidden}'});
   await page.locator('small').filter({hasText:'Model accuracy:'}).evaluateAll(nodes=>nodes.forEach(node=>node.style.visibility='hidden'));
   await page.evaluate(()=>scrollTo({top:document.getElementById('threats').offsetTop-150,behavior:'instant'}));
   await page.screenshot({path:`${DIR}/astra.png`});
   await page.locator('#threatTable button').first().click();await page.locator('#threatDetailsModal.show').waitFor();
   await page.locator('#threatDetailsModal .modal-content').screenshot({path:`${DIR}/astra-detail.png`});
  }else{
   if(id==='soc'){
    await page.getByRole('heading',{name:'SOC Threat Detection Agent',exact:true}).waitFor();
    await page.addStyleTag({content:'.tip-card,[data-testid="stHeader"],[data-testid="stToolbar"]{display:none!important}[data-testid="stMainBlockContainer"]{padding-top:3rem!important}'});
   }
   if(id==='scanner')await page.locator('#scan').scrollIntoViewIfNeeded();
   if(id==='passchecker'){await page.locator('#passwordInput').fill('Showcase-Example-2026!');await page.waitForTimeout(150);}
   await page.evaluate(()=>document.fonts.ready);
   const locator=id==='url'?page.locator('.bg-blur'):id==='scanner'?page.locator('#scan'):null;
   if(locator)await locator.screenshot({path:`${DIR}/${id}.png`});else await page.screenshot({path:`${DIR}/${id}.png`});
  }
  log.push({id,pixelRatio:id==='url'?3:2,errors,blocked,submissions});await page.close();
 }
}finally{await browser.close();}
await writeFile(DIR+'/capture-log.json',JSON.stringify(log,null,2)+'\n');console.log(JSON.stringify(log,null,2));
