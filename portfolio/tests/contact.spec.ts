import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const endpoint = 'https://formsubmit.co/ajax/jefrincorreya@gmail.com';
const errors = new WeakMap<object, string[]>();
test.beforeEach(({ page }) => {
  const found: string[] = []; errors.set(page, found);
  page.on('pageerror', error => found.push(error.message));
});
test.afterEach(({ page }) => { expect(errors.get(page)).toEqual([]); });

const cors = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type, accept' };

async function fillForm(page: import('@playwright/test').Page) {
  await page.getByLabel('Your name', { exact: true }).fill('Test Recruiter');
  await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('recruiter@example.com');
  await page.getByLabel('Your message', { exact: true }).fill('I would like to discuss a SOC analyst opportunity.');
}

test('Overview says Contact, Contact has no phone, and the cursor is slightly smaller', async ({ page, isMobile }) => {
  await page.goto('/');
  await expect(page.locator('.header-cta')).toHaveText('Contact');
  await expect(page.locator('.header-cta')).toHaveAttribute('href', '/contact');
  await expect(page.getByRole('link', { name: 'Hire me', exact: true })).toHaveCount(0);
  const cursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
  if (!isMobile) {
    const url = cursor.match(/url\("([^"]+)"\)/)?.[1];
    expect(url).toContain('data:image/svg+xml,');
    const svg = decodeURIComponent(url!.slice('data:image/svg+xml,'.length));
    expect(svg).toContain('width="24"');
    expect(svg).toContain('height="30"');
  } else expect(cursor).not.toContain('data:image/svg+xml');
  await page.goto('/contact');
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('.contact-page')).not.toContainText('8113064878');
  await expect(page.getByRole('button', { name: 'Send mail', exact: true })).toBeVisible();
  await expect(page.locator('.form-privacy')).toContainText('FormSubmit');
});

test('empty, malformed, whitespace-only and honeypot submissions never send a request', async ({ page }) => {
  let calls = 0;
  await page.route(endpoint, async route => { calls++; await route.abort(); });
  await page.goto('/contact');
  const send = page.getByRole('button', { name: 'Send mail', exact: true });
  await send.click();
  expect(calls).toBe(0);
  await fillForm(page);
  await page.getByRole('textbox', { name: 'Email address', exact: true }).fill('not-an-email');
  await send.click();
  expect(calls).toBe(0);
  await fillForm(page);
  await page.getByLabel('Your name', { exact: true }).fill('   ');
  await send.click();
  await expect(page.getByRole('alert')).toContainText('not just spaces');
  expect(calls).toBe(0);
  await fillForm(page);
  await page.locator('input[name="company_website"]').evaluate(element => { (element as HTMLInputElement).value = 'spam.example'; });
  await send.click();
  await expect(page.getByRole('alert')).toContainText('could not be accepted');
  expect(calls).toBe(0);
});

test('direct submission waits for confirmation, prevents duplicates, then clears fields on success only', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let calls = 0;
  let body: Record<string, string> = {};
  await page.route(endpoint, async route => {
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    calls++;
    body = route.request().postDataJSON();
    await gate;
    await route.fulfill({ status: 200, headers: cors, json: { success: 'true', message: 'Email sent successfully.' } });
  });
  await page.goto('/contact');
  await fillForm(page);
  await page.getByRole('button', { name: 'Project collaboration', exact: true }).click();
  await page.getByRole('button', { name: 'Send mail', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sending…', exact: true })).toBeDisabled();
  await expect(page.locator('.contact-send-status.success')).toHaveCount(0);
  await expect.poll(() => calls).toBe(1);
  await page.locator('form').evaluate(form => { (form as HTMLFormElement).requestSubmit(); (form as HTMLFormElement).requestSubmit(); });
  expect(calls).toBe(1);
  release();
  await expect(page.locator('.contact-send-status.success')).toContainText('Message sent.');
  expect(body).toMatchObject({ name: 'Test Recruiter', email: 'recruiter@example.com', interest: 'Project collaboration', _honey: '' });
  expect(body._subject).toContain('Project collaboration');
  expect(body).not.toHaveProperty('_captcha');
  await expect(page.getByLabel('Your name', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Your message', { exact: true })).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Send mail', exact: true })).toBeEnabled();
  expect(page.url()).toContain('/contact');
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test('activation, rejected, malformed, and rate-limited responses never claim success or lose the message', async ({ page }) => {
  const cases = [
    { status: 200, json: { success: 'false', message: 'Please activate your form using the email sent to you.' }, notice: 'one-time activation' },
    { status: 200, json: { success: 'false', message: 'Submission rejected.' }, notice: 'couldn’t confirm' },
    { status: 200, json: {}, notice: 'couldn’t confirm' },
    { status: 429, json: { success: false, message: 'Too many requests.' }, notice: 'Too many attempts' },
    { status: 502, json: { success: true }, notice: 'couldn’t confirm' },
  ];
  for (const fixture of cases) {
    await page.route(endpoint, async route => route.fulfill({ status: fixture.status, headers: cors, json: fixture.json }));
    await page.goto('/contact');
    await fillForm(page);
    await page.getByRole('button', { name: 'Send mail', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText(fixture.notice);
    await expect(page.locator('.contact-send-status.success')).toHaveCount(0);
    await expect(page.getByLabel('Your message', { exact: true })).toHaveValue('I would like to discuss a SOC analyst opportunity.');
    await expect(page.getByRole('button', { name: 'Send mail', exact: true })).toBeEnabled();
    await page.unroute(endpoint);
  }
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test('network failure keeps text and exposes an honest direct-email fallback', async ({ page }) => {
  await page.route(endpoint, route => route.abort('failed'));
  await page.goto('/contact');
  await fillForm(page);
  await page.getByRole('button', { name: 'Send mail', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('couldn’t confirm');
  await expect(page.getByRole('link', { name: 'Email Jefrine directly', exact: true })).toHaveAttribute('href', 'mailto:jefrincorreya@gmail.com');
  await expect(page.getByLabel('Your name', { exact: true })).toHaveValue('Test Recruiter');
  await expect(page.locator('.contact-send-status.success')).toHaveCount(0);
});

test('offline preview never pretends to send and links to the live form', async ({ page }) => {
  await page.addInitScript(() => { window.__OFFLINE_PREVIEW__ = true; });
  let calls = 0;
  await page.route(endpoint, async route => { calls++; await route.abort(); });
  await page.goto('/');
  await page.getByRole('link', { name: 'Contact', exact: true }).last().click();
  await fillForm(page);
  await page.getByRole('button', { name: 'Send mail', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('offline preview');
  await expect(page.getByRole('link', { name: 'Open the live contact page', exact: true })).toHaveAttribute('href', 'https://jefrine-correya-portfolio.vercel.app/contact');
  expect(calls).toBe(0);
});
