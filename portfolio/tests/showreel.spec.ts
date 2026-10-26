import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
const film = JSON.parse(readFileSync(new URL('../src/data/showreel.json', import.meta.url), 'utf8')) as { projects: { title: string; slug: string; source: string }[] };
const playing = (page: import('@playwright/test').Page) => expect.poll(() => page.locator('.master-video').evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true);
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  (page as unknown as { filmErrors: string[] }).filmErrors = errors;
});
test.afterEach(async ({ page }) => expect((page as unknown as { filmErrors: string[] }).filmErrors).toEqual([]));

test('full-film route is source-free before explicit play and exposes eight real projects', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/showreel');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('in perspective');
  await expect(page.locator('.master-video')).not.toHaveAttribute('src');
  await expect(page.locator('.film-projects > li')).toHaveCount(8);
  await expect(page.locator('.film-room canvas')).toHaveCount(0);
  await expect(page.locator('#film-scope')).toContainText('not live telemetry');
  for (const project of film.projects) {
    await expect(page.locator('.film-projects h3 a').filter({ hasText: project.title })).toHaveAttribute('href', `/projects/${project.slug}`);
    await expect(page.getByRole('link', { name: `View ${project.title} source`, exact: true })).toHaveAttribute('href', project.source);
  }
  await page.waitForTimeout(600);
  expect(requests.filter(url => /\.mp4|vendor-webgl|three\.module|\/scripts\/showreel\//.test(url))).toEqual([]);
});

test('explicit keyboard play loads the real silent master; hidden/offscreen pauses without automatic restart', async ({ page }) => {
  await page.goto('/showreel');
  const play = page.getByRole('button', { name: /Play the 41-second film/ });
  await play.focus(); await page.keyboard.press('Space');
  await playing(page);
  const details = await page.locator('.master-video').evaluate((v: HTMLVideoElement) => ({ duration: v.duration, muted: v.muted, inline: v.playsInline, controls: v.controls, loop: v.loop }));
  expect(details).toEqual({ duration: 41, muted: true, inline: true, controls: true, loop: false });
  await expect(page.locator('.master-video')).toBeFocused();
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  await expect.poll(() => page.locator('.master-video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.locator('.master-video').evaluate((v: HTMLVideoElement) => v.play());
  await playing(page);
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await expect.poll(() => page.locator('.master-video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.locator('.film-player').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  expect(await page.locator('.master-video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('failed master offers honest feedback and a real retry', async ({ page }) => {
  let blocked = true;
  await page.route('**/media/cybersecurity-showreel.mp4', route => blocked ? route.abort() : route.continue());
  await page.goto('/showreel');
  await page.getByRole('button', { name: /Play the 41-second film/ }).click();
  await expect(page.locator('.film-player')).toHaveAttribute('data-state', 'failed');
  await expect(page.locator('.film-notice')).toContainText('could not load');
  blocked = false;
  await page.getByRole('button', { name: 'Try playback again' }).click();
  await playing(page);
  await expect(page.locator('.film-player')).toHaveAttribute('data-state', 'ready');
});

test('scene-description captions and the complete readable transcript are available', async ({ page }) => {
  await page.goto('/showreel');
  await page.locator('.film-transcript summary').click();
  await expect(page.locator('.film-transcript')).toContainText('There is no audio track or live security feed');
  for (const project of film.projects) await expect(page.locator('.film-transcript')).toContainText(project.title);
  await page.getByRole('button', { name: /Play the 41-second film/ }).click();
  await playing(page);
  await page.locator('.master-video').evaluate((v: HTMLVideoElement) => { v.textTracks[0].mode = 'showing'; });
  await expect.poll(() => page.locator('.master-video').evaluate((v: HTMLVideoElement) => v.textTracks[0].cues?.length || 0)).toBe(10);
});

test('offline hero remains static without pretending to play a missing embedded movie', async ({ page }) => {
  await page.addInitScript(() => { window.__OFFLINE_PREVIEW__ = true; });
  const requests: string[] = []; page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await expect(page.locator('.hero-showcase button')).toHaveCount(0);
  await expect(page.locator('.showcase-video')).not.toHaveAttribute('src');
  expect(requests.filter(url => url.endsWith('.mp4'))).toEqual([]);
});

test('clean hero has no film CTA while the original archived film and evidence route remain intact', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-showcase a')).toHaveCount(0);
  await expect(page.locator('.showcase-caption,.showcase-steps')).toHaveCount(0);
  await page.goto('/showreel');
  await expect(page.locator('.film-projects > li')).toHaveCount(8);
  await page.locator('.film-projects h3 a').filter({ hasText: 'Wireshark Network Traffic Analysis' }).click();
  await expect(page).toHaveURL(/\/projects\/wireshark-traffic-analysis$/);
  await expect(page.locator('.case-boundary')).toBeVisible();
});

test('full-film page passes automated WCAG checks and fits narrow/desktop viewports', async ({ page, isMobile }) => {
  await page.goto('/showreel');
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
  if (!isMobile) for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `${width}px film layout`).toBeLessThanOrEqual(width + 1);
  }
});
