import * as THREE from 'three';
import { canvasTexture } from './typography.mjs';
export const LIGHTING={background:0x03080d,ambient:0xa3c6cf,key:0xd4eced,rim:0xb3e698,particleCount:144};
function seeded(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export function createEnvironment(scene,projects,seed){
 scene.background=new THREE.Color(LIGHTING.background);scene.fog=new THREE.FogExp2(LIGHTING.background,.007);
 scene.add(new THREE.AmbientLight(LIGHTING.ambient,1.5));
 const key=new THREE.DirectionalLight(LIGHTING.key,4);key.position.set(-8,24,30);scene.add(key);
 const rim=new THREE.DirectionalLight(LIGHTING.rim,3);rim.position.set(15,-5,12);scene.add(rim);
 // Cheap, reusable equirectangular studio strips: reflective frame edges without a reflection pass.
 const env=canvasTexture(512,256,(ctx,w,h)=>{ctx.fillStyle='#18232b';ctx.fillRect(0,0,w,h);ctx.fillStyle='#b8d9b8';ctx.fillRect(70,30,12,190);ctx.fillStyle='#89bbc5';ctx.fillRect(330,90,95,13);ctx.fillStyle='#52697b';ctx.fillRect(440,0,12,h);});
 env.mapping=THREE.EquirectangularReflectionMapping;scene.environment=env;
 const random=seeded(seed);const positions=new Float32Array(LIGHTING.particleCount*3);
 for(let i=0;i<LIGHTING.particleCount;i++){positions[i*3]=(random()-.5)*82;positions[i*3+1]=(random()-.5)*44;positions[i*3+2]=(random()-.5)*70;}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const dot=canvasTexture(64,64,(ctx)=>{const g=ctx.createRadialGradient(32,32,1,32,32,30);g.addColorStop(0,'#c5e7c9');g.addColorStop(.2,'#88bfa377');g.addColorStop(1,'#12302400');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);});
 const particles=new THREE.Points(geometry,new THREE.PointsMaterial({size:.24,map:dot,transparent:true,opacity:.4,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(particles);
 const grid=new THREE.GridHelper(140,38,0x3b6758,0x172c32);grid.position.set(0,-13,-8);grid.material.transparent=true;grid.material.opacity=.20;scene.add(grid);
 const routePoints=projects.map(p=>new THREE.Vector3(p.position[0],p.position[1]-3.8,p.position[2]-3));
 const routeGeometry=new THREE.BufferGeometry().setFromPoints(routePoints);const route=new THREE.Line(routeGeometry,new THREE.LineBasicMaterial({color:0x8bba91,transparent:true,opacity:.14}));scene.add(route);
 projects.forEach(p=>{
  const haloMap=canvasTexture(256,256,(ctx)=>{const g=ctx.createRadialGradient(128,128,10,128,128,128);g.addColorStop(0,p.color+'20');g.addColorStop(1,p.color+'00');ctx.fillStyle=g;ctx.fillRect(0,0,256,256);});
  const halo=new THREE.Mesh(new THREE.PlaneGeometry(22,17),new THREE.MeshBasicMaterial({map:haloMap,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));halo.position.set(p.position[0],p.position[1],p.position[2]-2.5);scene.add(halo);
 });
 return {animate(time,duration){const phase=time/duration*Math.PI*2;particles.position.y=Math.sin(phase)*.16;particles.position.x=Math.cos(phase)*.10;},dispose(){geometry.dispose();env.dispose();dot.dispose();}};
}
