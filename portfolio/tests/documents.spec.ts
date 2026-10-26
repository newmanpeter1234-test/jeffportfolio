import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
const documents: { id: string; label: string; title: string; pdf: string; downloadName: string; sha256: string; pages: { image: string }[] }[] = JSON.parse(readFileSync(new URL('../src/data/documents.json', import.meta.url), 'utf8'));

test('all four documents preview without auto-download and optional downloads preserve the originals', async ({ page, request }) => {
  const errors: string[] = [], downloads: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('download', download => downloads.push(download.suggestedFilename()));
  await page.goto('/credentials');
  await page.getByRole('button', { name: 'View CSA certificate', exact: true }).click();
  const viewer = page.getByRole('dialog');
  for (const [index, document] of documents.entries()) {
    await viewer.getByRole('button', { name: `View ${document.label}`, exact: true }).click();
    await expect(viewer.getByRole('heading', { name: document.title, exact: true })).toBeVisible();
    const image = viewer.locator('.document-paper img').first();
    await expect(image).toHaveAttribute('src', document.pages[0].image);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    expect(downloads, 'Opening or switching previews does not download anything').toHaveLength(index);
    const response = await request.get(document.pdf);
    expect(response.status()).toBe(200);
    expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(document.sha256);
    const downloadPromise = page.waitForEvent('download');
    await viewer.getByRole('link', { name: 'Download PDF', exact: true }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(document.downloadName);
    expect(createHash('sha256').update(await readFile((await download.path())!)).digest('hex')).toBe(document.sha256);
  }
  expect(errors).toEqual([]);
});

test('document room has keyboard focus containment, accessible text, zoom, and Escape recovery', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'View my résumé', exact: true });
  await trigger.click();
  const viewer = page.getByRole('dialog');
  await expect(viewer.getByRole('button', { name: 'Close document viewer' })).toBeFocused();
  await viewer.getByRole('link', { name: 'Download PDF', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(viewer.getByRole('button', { name: 'Close document viewer' })).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toHaveCount(1);
  await viewer.getByRole('button', { name: 'Fit preview to width' }).click();
  await viewer.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(viewer.getByRole('button', { name: 'Fit preview to width' })).toHaveText('125%');
  await viewer.getByRole('button', { name: 'Fit preview to width' }).click();
  await expect(viewer.getByRole('button', { name: 'Fit preview to width' })).toHaveText('100%');
  await viewer.getByRole('button', { name: 'Readable text', exact: true }).click();
  await expect(viewer.locator('.document-readable')).toContainText('SOC & Security Platform Engineer');
  await expect(viewer.getByRole('button', { name: 'Zoom in', exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(viewer).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  expect(await page.locator('.portfolio-app').getAttribute('inert')).toBeNull();
});

test('all document previews pass accessibility checks and fit narrow screens', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/credentials');
  await page.getByRole('button', { name: 'View my experience', exact: true }).click();
  for (const document of documents) {
    await page.getByRole('dialog').getByRole('button', { name: `View ${document.label}`, exact: true }).click();
    await expect.poll(() => page.locator('.document-paper img').first().evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations, `Document accessibility: ${document.id}`).toEqual([]);
  }
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    const rect = await page.locator('.document-viewer').boundingBox();
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 1);
    await expect(page.getByRole('dialog').getByRole('link', { name: 'Download PDF', exact: true })).toBeVisible();
  }
});

test('Doha location and Qatar time are consistent; desktop uses the themed arrow without a trailing ring', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('.hero-credential')).toContainText('Doha, Qatar');
  await expect(page.locator('.hero-facts')).toContainText('DOHA, QATAR');
  await expect(page.locator('.hero-facts')).toContainText('AST');
  await expect(page.locator('.footer-identity-role')).toContainText('DOHA, QATAR');
  await expect(page.locator('.custom-cursor')).toHaveCount(0);
  const cursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
  if (!isMobile) expect(cursor).toContain('data:image/svg+xml');
  else expect(cursor).not.toContain('data:image/svg+xml');
  await page.goto('/contact');
  await expect(page.locator('.contact-location')).toContainText('Doha, Qatar');
  await expect(page.locator('.contact-location')).toContainText('UTC +03:00');
  expect(await page.getByRole('textbox', { name: 'Email address', exact: true }).evaluate(element => getComputedStyle(element).cursor)).toBe('text');
  await page.goto('/journey');
  await expect(page.locator('.journey-portrait-meta')).toContainText('DOHA');
  await expect(page.locator('.timeline')).toContainText('Kochi');
});

test('old résumé URL still returns the original bytes without a duplicate stored PDF', async ({ request }) => {
  const response = await request.get('/assets/jeffresume%20.pdf');
  expect(response.ok()).toBe(true);
  const crypto = await import('node:crypto');
  expect(crypto.createHash('sha256').update(await response.body()).digest('hex')).toBe('8872b51f624a402369ff9887d2651dbd6768e0bbd37027ff654596053eb6322d');
});
