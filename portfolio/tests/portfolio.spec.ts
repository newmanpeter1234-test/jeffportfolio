import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { projects } from '../src/data/content';

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /Encountered two children|not a function|Uncaught|React error/i.test(message.text())) errors.push(message.text()); });
  (page as unknown as { runtimeErrors: string[] }).runtimeErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as unknown as { runtimeErrors: string[] }).runtimeErrors, 'No client-side runtime errors').toEqual([]);
});

test('overview contains the real identity, qualifications, and working CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Beyond');
  await expect(page.locator('.hero-name')).toContainText('JEFRINE CORREYA');
  await expect(page.locator('.hero-credential')).toContainText('Certified SOC Analyst');
  await expect(page.locator('.hero-facts')).toContainText('DOHA, QATAR');
  await expect(page.getByRole('link', { name: 'Explore my work' })).toHaveAttribute('href', '/projects');
  await expect(page.locator('.header-cta')).toHaveText('Contact');
  await expect(page.locator('.header-cta')).toHaveAttribute('href', '/contact');
  await expect(page.locator('.featured-project-grid .project-card')).toHaveCount(4);
});

test('archive filters, searches, empty states, and resets work', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('.archive-project-grid .project-card')).toHaveCount(19);
  await page.getByRole('button', { name: /Security tools/ }).click();
  await expect(page.locator('.archive-project-grid .project-card')).toHaveCount(3);
  await page.getByRole('button', { name: /All work/ }).click();
  await page.getByRole('textbox', { name: 'Search projects' }).fill('Wazuh');
  await expect(page.locator('.archive-project-grid .project-card')).toHaveCount(2);
  await page.getByRole('textbox', { name: 'Search projects' }).fill('no-such-project-12345');
  await expect(page.getByRole('heading', { name: 'No matching signal.' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.locator('.archive-project-grid .project-card')).toHaveCount(19);
});

test('all 19 case studies have real titles, evidence, and boundaries', async ({ page }) => {
  test.setTimeout(90000);
  for (const project of projects) {
    await page.goto(`/projects/${project.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(project.title);
    await expect(page.locator('.case-boundary')).toContainText(project.boundary);
    await expect(page.locator('.evidence-links a')).toHaveCount(project.evidence.length);
    if (project.repo) await expect(page.getByRole('link', { name: /View source/ })).toHaveAttribute('href', project.repo);
  }
});

test('public repository index expands and preserves all 26 repository links', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: /Public repository index/ }).click();
  await expect(page.locator('.repository-index a')).toHaveCount(26);
  await expect(page.locator('.repository-index a[href="https://github.com/jeff-1217/URL-Phishing-Detector2"]')).toBeVisible();
  await page.getByRole('button', { name: /Public repository index/ }).click();
  await expect(page.locator('.repository-index')).toHaveCount(0);
});

test('keyboard quick access focuses the input and navigates to a case study', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const input = page.getByRole('textbox', { name: 'Search pages and projects' });
  await expect(input).toBeFocused();
  await input.fill('Wazuh');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/wazuh-siem-lab$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Wazuh SIEM Lab');
});

test('quick access closes with Escape and restores scrolling', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search portfolio, Control K' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('mobile menu is accessible and closes after navigation', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation only');
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const menu = page.getByRole('dialog', { name: 'Navigation' });
  await expect(menu).toBeVisible();
  await menu.getByRole('link', { name: /Journey/ }).click();
  await expect(page).toHaveURL(/\/journey$/);
  await expect(menu).toHaveCount(0);
});

test('local investigation completes, explains its scope, and can be reset', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Run investigation' }).click();
  await expect(page.getByRole('button', { name: 'Reset scenario' })).toBeVisible();
  await expect(page.locator('.verdict')).toContainText('Repeated authentication failures');
  await expect(page.locator('.verdict a')).toHaveAttribute('href', '/projects/wazuh-siem-lab');
  await page.getByRole('button', { name: 'Reset scenario' }).click();
  await page.getByRole('button', { name: /Suspicious URL/ }).click();
  await expect(page.locator('.raw-logs')).toContainText('no API request made');
  await page.getByRole('button', { name: 'Run investigation' }).click();
  await expect(page.locator('.verdict')).toContainText('without checking or opening any URL');
});

test('toolkit tabs and original self-reported proficiency levels are interactive', async ({ page }) => {
  await page.goto('/journey');
  await page.getByRole('tab', { name: /Assess & test/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('OWASP');
  await expect(page.getByRole('button', { name: /OWASP Advanced/ })).toBeVisible();
  await page.getByRole('button', { name: /OWASP Advanced/ }).click();
  await expect(page.getByRole('button', { name: /OWASP Advanced/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('tab', { name: /Build & automate/ }).click();
  await expect(page.getByRole('button', { name: /JavaScript Basic/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /PHP Experienced/ })).toBeVisible();
});

test('confirmed experience and earned-versus-pursuing credentials remain accurate', async ({ page }) => {
  await page.goto('/journey');
  await expect(page.locator('.timeline')).toContainText('Wahy Lab Solutions');
  await expect(page.locator('.timeline')).toContainText('SEP 2025 — MAY 2026');
  await expect(page.locator('.timeline')).not.toContainText('Elevate Labs');
  await expect(page.locator('.human-skills-grid')).toContainText('Tamil');
  await page.goto('/credentials');
  await expect(page.locator('.credential-full-card')).toHaveCount(2);
  await expect(page.locator('#csa')).toContainText('27 July 2025');
  await expect(page.locator('#cicsa')).toContainText('11 July 2025');
  await expect(page.locator('.pursuing-card')).toContainText('Not yet an earned qualification');
});

test('new résumé previews first and downloads only by explicit choice', async ({ page, request }) => {
  const response = await request.get('/documents/jefrine-correya-resume.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
  const downloads: string[] = [];
  page.on('download', download => downloads.push(download.suggestedFilename()));
  await page.goto('/');
  await page.getByRole('button', { name: 'View my résumé', exact: true }).click();
  const viewer = page.getByRole('dialog');
  await expect(viewer).toBeVisible();
  await expect(viewer.getByRole('heading', { name: 'Jefrine Correya — Résumé' })).toBeVisible();
  await expect(viewer.locator('.document-paper img')).toBeVisible();
  expect(downloads).toEqual([]);
  const download = page.waitForEvent('download');
  await viewer.getByRole('link', { name: 'Download PDF', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('Jefrine-Correya-Resume.pdf');
});

test('reduced-motion preference is respected and the manual control works', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.getByRole('button', { name: 'Turn on animations' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await page.getByRole('button', { name: 'Turn off animations' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
});

test('unknown routes and case studies have useful recovery paths', async ({ page }) => {
  for (const path of ['/unknown', '/projects/not-a-real-project']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('off the radar');
    await expect(page.getByRole('link', { name: 'Return to overview' })).toHaveAttribute('href', '/');
  }
});

test('primary pages pass automated WCAG A / AA checks', async ({ page }) => {
  test.setTimeout(90000);
  for (const path of ['/', '/projects', '/projects/astra-monitor', '/journey', '/credentials', '/contact', '/sources']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations, `Accessibility violations on ${path}`).toEqual([]);
  }
});

test('layouts fit phone, tablet, and desktop widths without horizontal scroll', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Viewport sweep is run once on desktop Chromium');
  test.setTimeout(90000);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/projects', '/projects/soc-threat-detection-assistant', '/journey', '/credentials', '/contact']) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth, `${path} at ${width}px`).toBeLessThanOrEqual(width + 1);
    }
  }
});
