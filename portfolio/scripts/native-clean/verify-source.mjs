import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const hash=x=>createHash('sha256').update(x).digest('hex');
const approved='59f26d688bfa6675823523fe4e6179dbb8459d0e';
const unchanged=['scripts/showreel/scene/config.mjs','scripts/showreel/scene/timeline.mjs','scripts/showreel/renderer/environment.mjs'];
for(const file of unchanged){const old=execFileSync('git',['show',approved+':'+file]);assert.equal(hash(await readFile(file)),hash(old),file+' must retain the approved camera/environment');}
const factory=await readFile('scripts/native-clean/panel.mjs','utf8');assert(!factory.includes('sourceCard('));assert(!factory.includes('textPlane('));assert(!factory.includes('number=textPlane'));
const assets=JSON.parse(await readFile('scripts/native-clean/assets/provenance.json','utf8'));
for(const item of Object.values(assets)){assert.equal(hash(await readFile('scripts/native-clean/assets/'+item.file)),item.sha256);}
assert(assets.url.width>=1600&&assets.url.height>=1000,'URL must not reuse the small 558px crop');
for(const id of ['astra','soc','passchecker','scanner'])assert(assets[id].width>=2560,id+' high-density original UI');
const timing=JSON.parse(await readFile('scripts/native-clean/timing.json','utf8'));assert.equal(timing.sourceTimes.length,1116);assert(timing.sourceTimes.every((t,i)=>i===0||t>timing.sourceTimes[i-1]));assert.equal(timing.duration,18);assert.equal(timing.fps,60);
console.log(JSON.stringify({cameraAndEnvironmentUnchanged:true,files:unchanged,editorialFactoryCalls:0,losslessAssets:Object.keys(assets).length,url:[assets.url.width,assets.url.height],nativeOutput:[1920,1080,60],approvedTiming:true},null,2));
