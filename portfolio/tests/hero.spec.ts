import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const media = '/media/cybersecurity-native-glass-1080p60.mp4';
const playing = (page: import('@playwright/test').Page) => expect.poll(() => page.locator('.showcase-video').evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true);
const paused = (page: import('@playwright/test').Page) => expect.poll(() => page.locator('.showcase-video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
async function posterReady(page: import('@playwright/test').Page) { await page.locator('.showcase-poster img').evaluate((img: HTMLImageElement) => img.decode()); }
test.beforeEach(async ({ page }) => { const errors: string[] = []; page.on('pageerror', e => errors.push(e.message)); (page as unknown as { heroErrors: string[] }).heroErrors = errors; });
test.afterEach(async ({ page }) => expect((page as unknown as { heroErrors: string[] }).heroErrors).toEqual([]));

test('clean hero is poster-first for reduced motion, has only one corner control and no labels or links', async ({ page }) => {
 const requests: string[] = []; page.on('request', r => requests.push(r.url()));
 await page.goto('/'); await posterReady(page);
 await expect(page.locator('.hero-showcase')).toHaveAttribute('data-state', 'poster');
 await expect(page.locator('.showcase-video')).not.toHaveAttribute('src');
 await expect(page.locator('.hero canvas')).toHaveCount(0);
 await expect(page.locator('.hero-showcase button')).toHaveCount(1);
 await expect(page.locator('.hero-showcase a,.showcase-steps,.showcase-caption,.showcase-kicker,.showcase-open-hint')).toHaveCount(0);
 await expect(page.locator('.hero-showcase figcaption')).toContainText('not live telemetry');
 await expect(page.locator('.hero-showcase figcaption')).toHaveCSS('position','absolute');
 await page.waitForTimeout(600);
 expect(requests.filter(u => u.includes(media) || /vendor-webgl|three\.module|\/scripts\/footage-glass\//.test(u))).toEqual([]);
});

test('keyboard play loads the real 18-second 1080p film; user pause persists', async ({ page }) => {
 await page.goto('/'); const play=page.getByRole('button',{name:'Play project preview',exact:true}); await play.focus(); await page.keyboard.press('Space'); await playing(page);
 const meta=await page.locator('.showcase-video').evaluate((v:HTMLVideoElement)=>({muted:v.muted,inline:v.playsInline,loop:v.loop,duration:v.duration,width:v.videoWidth,height:v.videoHeight,preload:v.preload}));
 expect(meta).toEqual({muted:true,inline:true,loop:true,duration:18,width:1920,height:1080,preload:'none'});
 await expect(page.getByRole('button',{name:'Pause project preview'})).toBeFocused(); await page.keyboard.press('Space'); await paused(page);
 const before=await page.locator('.showcase-video').evaluate((v:HTMLVideoElement)=>v.currentTime);
 await page.evaluate(()=>scrollTo({top:document.body.scrollHeight,behavior:'instant'})); await page.waitForTimeout(150);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(400);await paused(page);
 expect(await page.locator('.showcase-video').evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeLessThanOrEqual(before+.1);
});

test('mobile uses the small poster and is also eligible for muted automatic playback', async ({ page }) => {
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'no-preference'});
 await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:Object.assign(new EventTarget(),{saveData:false,effectiveType:'4g',downlink:10})}));
 await page.goto('/');await posterReady(page);expect(await page.locator('.showcase-poster img').evaluate((i:HTMLImageElement)=>i.currentSrc)).toContain('cybersecurity-native-glass-mobile.webp');
 await playing(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

for(const[name,config]of[['Save-Data',{saveData:true,effectiveType:'4g',downlink:10}],['3g',{saveData:false,effectiveType:'3g',downlink:2}],['low downlink',{saveData:false,effectiveType:'4g',downlink:.7}]]as const){
 test(`${name} keeps automatic media source-free and permits explicit play`,async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await page.addInitScript(c=>Object.defineProperty(navigator,'connection',{configurable:true,value:Object.assign(new EventTarget(),c)}),config);
  const requests:string[]=[];page.on('request',r=>{if(r.url().includes(media))requests.push(r.url())});await page.goto('/');await posterReady(page);await page.waitForTimeout(500);
  await expect(page.locator('.showcase-video')).not.toHaveAttribute('src');expect(requests).toEqual([]);await page.getByRole('button',{name:'Play project preview',exact:true}).click();await playing(page);
 });
}

test('automatic playback loops and pauses offscreen/hidden on desktop and touch screens',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:Object.assign(new EventTarget(),{saveData:false,effectiveType:'4g',downlink:10})}));
 await page.goto('/');await playing(page);await page.locator('.showcase-video').evaluate((v:HTMLVideoElement)=>{v.currentTime=17.8});
 await expect.poll(()=>page.locator('.showcase-video').evaluate((v:HTMLVideoElement)=>v.currentTime<2&&!v.paused)).toBe(true);
 await page.evaluate(()=>scrollTo({top:document.body.scrollHeight,behavior:'instant'}));await paused(page);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await playing(page);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});await paused(page);
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))});await playing(page);
});

test('changing motion/data preferences stops and releases the media source',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:Object.assign(new EventTarget(),{saveData:false,effectiveType:'4g',downlink:10})}));await page.goto('/');await playing(page);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.showcase-video')).not.toHaveAttribute('src');await page.emulateMedia({reducedMotion:'no-preference'});await playing(page);
 await page.getByRole('button',{name:'Turn off animations'}).click();await expect(page.locator('.showcase-video')).not.toHaveAttribute('src');await page.getByRole('button',{name:'Turn on animations'}).click();await page.locator('.hero-showcase').scrollIntoViewIfNeeded();await playing(page);
 await page.evaluate(()=>{const c=(navigator as Navigator&{connection:EventTarget&{saveData:boolean}}).connection;c.saveData=true;c.dispatchEvent(new Event('change'))});await expect(page.locator('.showcase-video')).not.toHaveAttribute('src');
});

test('blocked autoplay retains a poster and the tiny explicit control recovers',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.addInitScript(()=>{const original=HTMLMediaElement.prototype.play;const s=window as typeof window&{rejectedPlays:number;restoreHeroPlay:()=>void};s.rejectedPlays=0;s.restoreHeroPlay=()=>{HTMLMediaElement.prototype.play=original};HTMLMediaElement.prototype.play=function(){s.rejectedPlays++;return Promise.reject(new DOMException('Test refusal','NotAllowedError'))}});
 await page.goto('/');await expect.poll(()=>page.evaluate(()=>(window as typeof window&{rejectedPlays:number}).rejectedPlays)).toBeGreaterThan(0);await expect(page.locator('.hero-showcase')).toHaveAttribute('data-state','poster');await posterReady(page);
 await page.evaluate(()=>(window as typeof window&{restoreHeroPlay:()=>void}).restoreHeroPlay());await page.getByRole('button',{name:'Play project preview',exact:true}).click();await playing(page);
});

test('network failure keeps the clean poster, retry control and main portfolio CTA',async({page})=>{
 let blocked=true;await page.route(`**${media}`,r=>blocked?r.abort():r.continue());await page.goto('/');await page.getByRole('button',{name:'Play project preview',exact:true}).click();await expect(page.locator('.hero-showcase')).toHaveAttribute('data-state','fallback');await posterReady(page);
 await expect(page.locator('.hero-showcase button')).toHaveCount(1);await expect(page.locator('.hero-showcase a')).toHaveCount(0);blocked=false;await page.getByRole('button',{name:'Play project preview',exact:true}).click();await playing(page);await page.getByRole('link',{name:'Explore my work'}).click();await expect(page).toHaveURL(/\/projects$/);
});

test('missing poster does not add unwanted placeholder text or break the main CTA',async({page})=>{
 await page.route('**/images/cybersecurity-native-glass-*.webp',r=>r.abort());await page.goto('/');await expect(page.locator('.showcase-image-fallback')).toBeVisible();await expect(page.locator('.showcase-image-fallback')).toHaveText('');await page.getByRole('link',{name:'Explore my work'}).click();await expect(page).toHaveURL(/\/projects$/);
});

test('minimal player passes automated accessibility and has a small visible control with a 44px target',async({page})=>{
 await page.goto('/');await posterReady(page);const result=await new AxeBuilder({page}).include('.hero-showcase').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
 const button=page.locator('.glass-playback');const box=await button.boundingBox();expect(box?.width).toBe(44);expect(box?.height).toBe(44);await expect(button.locator('svg')).toHaveCSS('width','11px');
 await button.focus();await page.keyboard.press('Space');await playing(page);await expect(page.getByRole('button',{name:'Pause project preview'})).toBeFocused();
});
