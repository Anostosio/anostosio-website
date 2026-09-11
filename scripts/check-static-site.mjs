import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'tmp') continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(target));
    else files.push(target);
  }
  return files;
}

function localTarget(value, source) {
  const clean = value.split('#')[0].split('?')[0];
  if (!clean || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  const resolved = clean.startsWith('/') ? path.join(root, clean) : path.resolve(path.dirname(source), clean);
  return clean.endsWith('/') ? path.join(resolved, 'index.html') : resolved;
}

const htmlFiles = (await filesIn(root)).filter((file) => file.endsWith('.html'));
const missing = [];
const markupIssues = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(root, file);
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) markupIssues.push(`${relative}: duplicate ids ${[...new Set(duplicateIds)].join(', ')}`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) markupIssues.push(`${relative}: expected exactly one h1`);
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt=["'][^"']*["']/i.test(match[0])) markupIssues.push(`${relative}: image without alt`);
  }
  for (const match of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
    if (!/rel=["'][^"']*noopener/i.test(match[0])) markupIssues.push(`${relative}: target=_blank without noopener`);
  }
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)) {
    const target = localTarget(match[1], file);
    if (!target) continue;
    try { await access(target); } catch { missing.push(`${path.relative(root, file)} -> ${match[1]}`); }
  }
}

if (missing.length || markupIssues.length) {
  console.error([...missing, ...markupIssues].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML files: links, assets and core markup pass.`);
}
