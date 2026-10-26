// Active clean renderer. Historical labelled/card-based modes were retired during workspace cleanup.
import * as THREE from 'three';
import { FILM, projectLayout } from '../scene/config.mjs';
import { stateAt } from '../scene/timeline.mjs';
import { createEnvironment } from './environment.mjs';
import { createHUD } from './hud.mjs';
import { createCleanPanel } from '../../native-clean/panel.mjs';
const params=new URLSearchParams(location.search),mode='master';
if(params.has('capture'))document.body.classList.add('capture');
const width=innerWidth,height=innerHeight;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,width/height,.15,250);
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('scene'),antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(1);renderer.setSize(width,height,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
const projects=projectLayout(mode),environment=createEnvironment(scene,projects,FILM.seed),loader=new THREE.TextureLoader();
const panels=[];for(const project of projects){const panel=await createCleanPanel(project,loader,{anisotropy:Math.min(16,renderer.capabilities.getMaxAnisotropy())});panels.push(panel);scene.add(panel.group);}
const hud=await createHUD(width,height,renderer.domElement);
const timeline=document.getElementById('timeline'),label=document.getElementById('time-label');
function renderAt(time){
 const state=stateAt(mode,time);camera.position.fromArray(state.position);camera.lookAt(...state.target);camera.updateMatrixWorld();environment.animate(state.time,state.duration);panels.forEach(panel=>panel.animate(state));
 timeline.max=state.duration;timeline.value=state.time;label.textContent=state.time.toFixed(2)+' s';renderer.render(scene,camera);hud.draw();
 const active=panels.find(panel=>panel.project.id===state.project.id);
 return {time:state.time,mode,clean:true,nativeWidth:width,nativeHeight:height,editorialCards:0,project:state.project.id,projectTitle:state.project.title,opacity:state.opacity,cameraPosition:camera.position.toArray(),cameraTarget:state.target,cameraQuaternion:camera.quaternion.toArray(),cameraMatrix:camera.matrixWorld.toArray(),featuredBounds:active.bounds().map(point=>point.project(camera).toArray()),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,textures:renderer.info.memory.textures};
}
window.__film={mode,duration:FILM.masterDuration,clean:true,projects:projects.map(p=>p.id),audit:panels.map(p=>({id:p.project.id,...p.audit})),renderAt,exportFrame:format=>hud.export(format),dispose(){renderer.dispose();environment.dispose();},renderer:'Native PerspectiveCamera / original scene and clean interface displays'};
renderAt(0);window.__filmReady=true;
let running=false,origin=0,current=0;
document.getElementById('toggle').onclick=()=>{running=!running;origin=performance.now()-current*1000;document.getElementById('toggle').textContent=running?'Pause':'Play';};
timeline.addEventListener('input',()=>{current=Number(timeline.value);origin=performance.now()-current*1000;renderAt(current);});
function animate(now){if(running){current=((now-origin)/1000)%window.__film.duration;renderAt(current);}requestAnimationFrame(animate);}
if(!params.has('capture'))requestAnimationFrame(animate);
