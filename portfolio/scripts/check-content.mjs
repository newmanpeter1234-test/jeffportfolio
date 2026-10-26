import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { transform } from 'esbuild';

const { code } = await transform(await readFile('src/data/content.ts', 'utf8'), { loader: 'ts', format: 'esm' });
const { projects, certifications, journey, profile, skillGroups } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const required = ['slms', 'url-phishing-detector', 'passchecker', 'web-vulnerability-scanner', 'astra-monitor', 'soc-threat-detection-assistant', 'splunk-soc-lab', 'wazuh-siem-lab', 'netflix-clone'];
assert.equal(projects.length, 19);
assert.equal(new Set(projects.map(p => p.slug)).size, projects.length, 'Unique case-study routes');
for (const slug of required) assert(projects.some(p => p.slug === slug), `Original project preserved: ${slug}`);
for (const p of projects) {
  assert(p.evidence.length > 0, `Evidence exists for ${p.slug}`);
  assert(p.boundary.length > 30, `Scope is explicit for ${p.slug}`);
  assert.equal(p.workflow.length, 3);
  for (const e of p.evidence) assert.equal(new URL(e.url).protocol, 'https:');
  if (p.image) await access(`public${p.image}`);
}
assert.equal(profile.name, 'Jefrine Correya');
assert.equal(profile.location, 'Doha, Qatar');
assert.equal(profile.experience, '1+');
assert.equal(certifications.filter(c => c.status === 'Earned').length, 2);
assert.equal(certifications.find(c => c.id === 'security-plus').status, 'Pursuing');
assert.equal(certifications.find(c => c.id === 'csa').date, 'July 2025');
assert.equal(certifications.find(c => c.id === 'cicsa').date, 'July 2025');
assert(journey[0].subtitle.includes('Wahy Lab Solutions'));
assert.equal(journey[0].period, 'SEP 2025 — MAY 2026');
assert(!journey.some(j => j.subtitle.includes('Elevate')));
assert.equal(skillGroups.flatMap(g => g.skills).filter(s => s.level).length, 20, 'All 20 original self-rated skills preserved');
const repos = JSON.parse(await readFile('src/data/repository-index.json', 'utf8'));
assert.equal(repos.length, 26);
const resume = await readFile(`public${profile.resume}`);
assert.equal(resume.subarray(0, 4).toString(), '%PDF');
assert.equal(createHash('sha256').update(resume).digest('hex'), '8872b51f624a402369ff9887d2651dbd6768e0bbd37027ff654596053eb6322d', 'Updated uploaded résumé preserved byte-for-byte');

assert.equal(profile.timeZone, 'Asia/Qatar');
const documents = JSON.parse(await readFile('src/data/documents.json', 'utf8'));
const expectedDocuments = {
  resume: '8872b51f624a402369ff9887d2651dbd6768e0bbd37027ff654596053eb6322d',
  cicsa: 'e545bb08920e10d5f2b7ef6a119cacc4f94a8400ca80c349b5cb6bcfdf1af2ec',
  csa: 'b621e75367fd10b2ebb3e69525a68b8b3b3ece5b6797b5bf29c9798b6363d8a8',
  experience: '3d6fae5e6dfc767b04c3fc9c50b7898dc2905916acb4d1c0c87d42b7d107f741',
};
assert.equal(documents.length, 4);
for (const document of documents) {
  const bytes = await readFile(`public${document.pdf}`);
  assert.equal(bytes.subarray(0, 4).toString(), '%PDF');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), expectedDocuments[document.id], `${document.id}: original uploaded PDF retained`);
  assert.equal(document.sha256, expectedDocuments[document.id]);
  assert(document.text.length > 100, `Readable document text for ${document.id}`);
  assert(document.pages.length > 0);
  for (const page of document.pages) await access(`public${page.image}`);
  await access(`public${document.thumbnail}`);
}
const hosting = JSON.parse(await readFile('vercel.json', 'utf8'));
assert(hosting.rewrites.some(r => r.source === '/assets/jeffresume(.*)' && r.destination === profile.resume), 'Legacy résumé URL points to the one canonical original PDF');
await access('public/images/cursor-arrow.svg');

const css = await readFile('src/styles.css', 'utf8');
for (const [, path] of css.matchAll(/url\(['"]?(\/fonts\/[^)'"\s]+)/g)) await access(`public${path}`);
const manifest = { documents: documents.length, location: profile.location, projects: projects.length, publicRepositories: repos.length, earnedCredentials: 2, pursuingCredentials: 1, originalSelfRatedSkills: 20, resumeSha256: createHash('sha256').update(resume).digest('hex') };
console.log('Content integrity checks passed.');
console.log(JSON.stringify(manifest, null, 2));
