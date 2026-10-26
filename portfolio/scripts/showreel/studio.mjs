// Local offline-rendering studio. This server/bundle never enters dist/.
import {build} from 'esbuild';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('.');const compiled=path.join(root,'.cache/showreel/studio');await mkdir(compiled,{recursive:true});
await build({entryPoints:['scripts/showreel/renderer/main.mjs'],bundle:true,format:'esm',target:'es2022',outfile:path.join(compiled,'studio.js'),minify:false});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json'};
const routes=[['/native-evidence/',path.join(root,'scripts/native-clean/assets')],['/fonts/',path.join(root,'public/fonts')]];
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');let file;
  if(url.pathname==='/')file=path.join(root,'scripts/showreel/renderer/index.html');
  else if(url.pathname==='/studio.js')file=path.join(compiled,'studio.js');
  else if(url.pathname==='/favicon.svg')file=path.join(root,'public/favicon.svg');
  else for(const[prefix,dir]of routes)if(url.pathname.startsWith(prefix)){
   const relative=decodeURIComponent(url.pathname.slice(prefix.length));file=path.resolve(dir,relative);if(!file.startsWith(dir+path.sep))throw new Error('Invalid path');break;
  }
  if(!file){res.writeHead(404);res.end('Not found');return;}
  const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.SHOWREEL_PORT||5050),'0.0.0.0',()=>console.log('Offline showreel studio ready on 0.0.0.0:'+server.address().port));
