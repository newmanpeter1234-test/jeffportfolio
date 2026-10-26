import {chromium}from'playwright';
import{mkdir,writeFile}from'node:fs/promises';
const DIR='.cache/native-clean/inspection';await mkdir(DIR,{recursive:true});
const browser=await chromium.launch({args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://localhost:5050/?mode=master&clean=1&capture=1');await page.waitForFunction(()=>window.__filmReady,undefined,{timeout:90000});
 const audit=await page.evaluate(()=>window.__film.audit);if(audit.length!==8||audit.some(x=>x.editorialCards||x.titlePlanes||x.numberPlanes))throw new Error('Unexpected editorial geometry');
 const states=[];
 for(const[id,t]of[['astra',5.2],['soc',8.9],['splunk',12.9],['url',16.9],['wazuh',20.9],['scanner',24.9],['passchecker',28.9],['wireshark',32.9]]){
  const start=Date.now();const result=await page.evaluate(t=>({state:window.__film.renderAt(t),png:window.__film.exportFrame('png')}),t);await writeFile(`${DIR}/${id}.png`,Buffer.from(result.png,'base64'));states.push({...result.state,milliseconds:Date.now()-start});
 }
 await writeFile(DIR+'/audit.json',JSON.stringify({audit,states,errors},null,2)+'\n');console.log(JSON.stringify({audit,errors,performance:states.map(s=>[s.project,s.milliseconds])},null,2));
}finally{await browser.close();}
