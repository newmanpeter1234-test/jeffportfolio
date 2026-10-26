import { build } from 'esbuild';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const destination = process.argv[2] || path.resolve('artifacts/Jefrine-Correya-Portfolio.html');
const result = await build({
  entryPoints: ['src/main.tsx'], bundle: true, write: false,
  outfile: '/home/user/.cache/jefrine-standalone.js', format: 'iife', target: 'es2022',
  minify: true, define: { 'process.env.NODE_ENV': '"production"' },
  external: ['/fonts/*'], logLevel: 'warning',
});
const js = result.outputFiles.find(f => f.path.endsWith('.js')).text;
let css = result.outputFiles.find(f => f.path.endsWith('.css')).text;
const mime = { '.woff2': 'font/woff2', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };
async function dataURI(file) { return `data:${mime[path.extname(file)] || 'application/octet-stream'};base64,${(await readFile(file)).toString('base64')}`; }
for (const file of await readdir('public/fonts')) {
  if (!file.endsWith('.woff2')) continue;
  css = css.replaceAll(`/fonts/${file}`, await dataURI(`public/fonts/${file}`));
}
const assets = {};
for (const folder of ['images', 'documents']) for (const file of await readdir(`public/${folder}`)) assets[`/${folder}/${file}`] = await dataURI(`public/${folder}/${file}`);
let html = await readFile('index.html', 'utf8');
html = html.replace(/\s*<link rel="preload"[^>]+>/g, '');
html = html.replace('href="/favicon.svg"', `href="${await dataURI('public/favicon.svg')}"`);
html = html.replace('</head>', () => `<style>${css}</style></head>`);
const init = `window.__OFFLINE_PREVIEW__=true;window.__PORTFOLIO_ASSETS__=${JSON.stringify(assets)};`;
const anchors = `document.addEventListener('click',function(event){var target=event.target.closest&&event.target.closest('a[href^="#"]');if(target){event.preventDefault();var el=document.getElementById(target.getAttribute('href').slice(1));if(el){el.scrollIntoView({behavior:document.documentElement.dataset.motion==='off'?'auto':'smooth'});if(el.id==='main')el.focus({preventScroll:true});}}});`;
html = html.replace('<script type="module" src="/src/main.tsx"></script>', () => `<script>${init}${js.replace(/<\/script/gi, '<\\/script')}${anchors}</script>`);
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, html);
console.log(`Standalone portfolio written to ${destination} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB). No network is required for the website experience.`);
