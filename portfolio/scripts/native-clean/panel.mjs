// The original display geometry, with no editorial overlay cards or raster repair layers.
import * as THREE from 'three';
import { smooth } from '../showreel/scene/timeline.mjs';
function roundedRect(w,h,r){const x=-w/2,y=-h/2,s=new THREE.Shape();s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
const outline=roundedRect(9.96,6.65,.15);
const holePoints=roundedRect(9.62,6.30,.10).getPoints(8).reverse().map(p=>new THREE.Vector2(p.x,p.y+.02));const hole=new THREE.Path(holePoints);hole.closePath();outline.holes.push(hole);
const FRAME=new THREE.ExtrudeGeometry(outline,{depth:.18,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:2,curveSegments:5,steps:1});
const EDGE=new THREE.EdgesGeometry(new THREE.BoxGeometry(9.97,6.66,.21));
function imageFace(texture,width,maxHeight){const ratio=texture.image.width/texture.image.height;let h=width/ratio,w=width;if(h>maxHeight){h=maxHeight;w=h*ratio;}return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,transparent:true,toneMapped:false}));}
function chromeTexture(){const c=document.createElement('canvas');c.width=1600;c.height=70;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,70);g.addColorStop(0,'#263137');g.addColorStop(1,'#141e24');x.fillStyle=g;x.fillRect(0,0,1600,70);x.fillStyle='#a9b8bb';for(let i=0;i<3;i++){x.beginPath();x.arc(31+i*19,35,5,0,Math.PI*2);x.fill();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
export async function createCleanPanel(project,loader,{anisotropy=8}={}){
 const group=new THREE.Group();group.position.fromArray(project.position);group.rotation.y=project.yaw;group.userData.kind='project-display';group.userData.project=project.id;
 const material=new THREE.MeshPhysicalMaterial({color:0x19252c,metalness:.24,roughness:.25,clearcoat:1,clearcoatRoughness:.15,envMapIntensity:.65,transparent:true,opacity:.96});
 const frame=new THREE.Mesh(FRAME,material);frame.position.z=-.22;frame.userData.kind='original-window-frame';group.add(frame);
 const backing=new THREE.Mesh(new THREE.PlaneGeometry(9.65,6.03),new THREE.MeshBasicMaterial({color:0x070e13,transparent:true}));backing.position.set(0,-.14,.02);group.add(backing);
 const texture=await loader.loadAsync('/native-evidence/'+project.id+'.webp');texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=anisotropy;
 const screen=imageFace(texture,9.6,6);screen.position.set(0,-.14,.035);screen.userData.kind='original-interface';group.add(screen);
 const chrome=new THREE.Mesh(new THREE.PlaneGeometry(9.6,.42),new THREE.MeshBasicMaterial({map:chromeTexture(),transparent:true,toneMapped:false}));chrome.position.set(0,3.08,.05);chrome.userData.kind='unlettered-chrome';group.add(chrome);
 const edge=new THREE.LineSegments(EDGE,new THREE.LineBasicMaterial({color:0xc0d1d5,transparent:true,opacity:.18}));edge.position.z=-.10;group.add(edge);
 // The real glass reflection is on the frame, not a full-screen blur/overdraw layer.
 let floating=null;
 if(project.id==='astra'){
  const detail=await loader.loadAsync('/native-evidence/astra-detail.webp');detail.colorSpace=THREE.SRGBColorSpace;detail.anisotropy=anisotropy;
  floating=imageFace(detail,6.1,4.5);floating.position.set(.35,-.15,1.15);floating.userData.kind='actual-investigation-modal';group.add(floating);
 }
 const alphas=new Map();group.traverse(o=>{if(o.material)alphas.set(o.material,o.material.opacity);});
 return {project,group,screen,frame,floating,animate(state){
  const active=state.project.id===project.id&&state.opacity>0;
  const brightness=state.intro>.05?.08:state.outro>.1?.78:.16+.84*(state.project.id===project.id?state.opacity:0);
  alphas.forEach((alpha,mat)=>{mat.opacity=alpha*brightness;});
  if(floating){const amount=active?smooth((state.local-.6)/.55)*(1-smooth((state.local-3.15)/.45)):0;floating.visible=amount>.005;floating.material.opacity=amount;floating.position.z=1.15+.35*amount;floating.rotation.y=(1-amount)*-.10;}
 },bounds(){return [[-4.8,-3.15,.04],[4.8,-3.15,.04],[4.8,3.3,.04],[-4.8,3.3,.04]].map(v=>group.localToWorld(new THREE.Vector3(...v)));},audit:{editorialCards:0,titlePlanes:0,numberPlanes:0,actualModal:project.id==='astra'?1:0,textureWidth:texture.image.width,textureHeight:texture.image.height}};
}
