// Direct native 1920×1080 / 60fps frames. No upscale, optical-flow interpolation, inpaint or repair video.
import {chromium}from'playwright';
import{readFile,mkdir,writeFile,rename,stat}from'node:fs/promises';
import{spawn}from'node:child_process';
import{once}from'node:events';
import{stateAt}from'../showreel/scene/timeline.mjs';
const timing=JSON.parse(await readFile('scripts/native-clean/timing.json','utf8'));
const DIR='.cache/native-clean';await mkdir(DIR,{recursive:true});
const target='public/media/cybersecurity-native-glass-1080p60.mp4';const partial=DIR+'/rendering.mp4';
const args=['--no-sandbox'];if(process.argv.includes('--software'))args.push('--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader');
const browser=await chromium.launch({args});let encoder;
try{
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:5050/?mode=master&clean=1&capture=1');await page.waitForFunction(()=>window.__filmReady,undefined,{timeout:90000});
 const audit=await page.evaluate(()=>({clean:window.__film.clean,panels:window.__film.audit,canvas:[document.getElementById('scene').width,document.getElementById('scene').height]}));
 if(!audit.clean||audit.canvas[0]!==1920||audit.canvas[1]!==1080||audit.panels.length!==8||audit.panels.some(p=>p.editorialCards||p.titlePlanes||p.numberPlanes))throw new Error('Native clean-scene audit failed');
 encoder=spawn('ffmpeg',['-y','-v','warning','-f','image2pipe','-vcodec','mjpeg','-framerate','60','-i','pipe:0','-an','-vf','scale=out_color_matrix=bt709:out_range=tv,format=yuv420p','-c:v','libx264','-preset','slow','-crf','17','-profile:v','high','-level:v','4.2','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart','-threads','2',partial],{stdio:['pipe','ignore','pipe']});
 let encoderLog='';encoder.stderr.on('data',d=>encoderLog=(encoderLog+d).slice(-12000));encoder.stdin.on('error',()=>{});
 const telemetry=[];const started=Date.now();let maxPositionError=0,maxTargetError=0;
 for(let frame=0;frame<1080;frame++){
  const tailTime=timing.sourceTimes[frame+36];const headFrame=frame-1044;const blend=headFrame>=0?headFrame/36:0;const headTime=headFrame>=0?timing.sourceTimes[headFrame]:null;
  const result=await page.evaluate(({tailTime,headTime,blend})=>{
   const film=window.__film;const state=film.renderAt(tailTime);const canvas=document.getElementById('composite');let image;
   if(headTime!==null){
    if(!window.__loopCanvas){window.__loopCanvas=document.createElement('canvas');window.__loopCanvas.width=1920;window.__loopCanvas.height=1080;}
    const output=window.__loopCanvas;const ctx=output.getContext('2d',{alpha:false});ctx.globalAlpha=1;ctx.drawImage(canvas,0,0);film.renderAt(headTime);ctx.globalAlpha=blend;ctx.drawImage(canvas,0,0);ctx.globalAlpha=1;image=output.toDataURL('image/jpeg',.99).split(',')[1];
   }else image=canvas.toDataURL('image/jpeg',.99).split(',')[1];
   return {state,image};
  },{tailTime,headTime,blend});
  const expected=stateAt('master',tailTime);const pErr=Math.max(...expected.position.map((x,i)=>Math.abs(x-result.state.cameraPosition[i])));const tErr=Math.max(...expected.target.map((x,i)=>Math.abs(x-result.state.cameraTarget[i])));maxPositionError=Math.max(maxPositionError,pErr);maxTargetError=Math.max(maxTargetError,tErr);
  if(pErr>1e-9||tErr>1e-9||errors.length)throw new Error('Camera/error verification failed: '+errors.join(';'));
  if(!encoder.stdin.write(Buffer.from(result.image,'base64')))await once(encoder.stdin,'drain');
  telemetry.push({frame,sourceTime:tailTime,project:result.state.project,cameraPosition:result.state.cameraPosition,cameraTarget:result.state.cameraTarget,editorialCards:result.state.editorialCards,drawCalls:result.state.drawCalls,triangles:result.state.triangles,blend});
  if(frame%120===0)console.log(JSON.stringify({stage:'native-render',frame,total:1080,project:result.state.project,elapsedSeconds:Math.round((Date.now()-started)/1000)}));
 }
 encoder.stdin.end();const[code]=await once(encoder,'close');if(code!==0)throw new Error(encoderLog);await rename(partial,target);
 await writeFile(DIR+'/telemetry.json',JSON.stringify(telemetry));
 const report={width:1920,height:1080,fps:60,frames:1080,duration:18,bytes:(await stat(target)).size,errors,audit,maxCameraPositionDeviation:maxPositionError,maxCameraTargetDeviation:maxTargetError,editorialCards:0,titlePlanes:0,numberPlanes:0,method:'Direct native scene frames; higher-density genuine interfaces; same original scene/camera configuration and approved timing. No CV repair, no spatial upscale, no motion interpolation; one final H.264 encode.',elapsedSeconds:(Date.now()-started)/1000};
 await writeFile(DIR+'/render-report.json',JSON.stringify(report,null,2)+'\n');console.log('NATIVE_RENDER_COMPLETE',JSON.stringify(report));
}finally{if(encoder&&!encoder.stdin.destroyed)encoder.stdin.end();await browser.close();}
