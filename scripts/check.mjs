#!/usr/bin/env node
/**
 * Package consistency checks for dsh-turn-timeline. Zero dependencies.
 * Usage: `npm test` (or `node scripts/check.mjs`). Exits 1 on any failure.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
let passed = 0;

/** Records one check: counts it as passed, or stores `message` as a failure. */
function check(ok, message) {
  if (ok) passed += 1;
  else failures.push(message);
}

/** Reads a repository file as UTF-8 text. */
const read = (path) => readFileSync(join(root, path), 'utf8');

/** Runs `fn`, turning a thrown error into a failure prefixed with `label`. */
async function attempt(label, fn) {
  try {
    await fn();
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
  }
}

/** Lists files matching a `files` entry; supports a plain path or `dir/*suffix`. */
function matchFiles(pattern) {
  const star = pattern.indexOf('*');
  if (star === -1) return existsSync(join(root, pattern)) ? [pattern] : [];
  const dir = pattern.slice(0, pattern.lastIndexOf('/', star) + 1);
  const suffix = pattern.slice(star + 1);
  if (!existsSync(join(root, dir))) return [];
  return readdirSync(join(root, dir)).filter((f) => f.endsWith(suffix)).map((f) => dir + f);
}

const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?$/i;
let pkg = {};

// --- package.json --------------------------------------------------------
await attempt('package.json', () => {
  pkg = JSON.parse(read('package.json'));
  for (const key of ['name', 'version', 'description']) check(Boolean(pkg[key]), `package.json: missing "${key}"`);
  check(SEMVER.test(pkg.version ?? ''), `package.json: version "${pkg.version}" is not valid SemVer`);
  check(pkg.license === 'MIT', `package.json: license must be "MIT", got "${pkg.license}"`);
  check(Boolean(pkg.repository?.url), 'package.json: missing repository.url');
  check(pkg.type === 'module', 'package.json: "type" must be "module"');
  check(Boolean(pkg.dsh?.bundle?.patch), 'package.json: missing dsh.bundle.patch');
  check(pkg.dsh?.client?.platform === 'web', 'package.json: dsh.client.platform must be "web"');
  check(pkg.publishConfig?.access === 'public', 'package.json: publishConfig.access must be "public"');

  const targets = [pkg.main, ...Object.values(pkg.exports ?? {})].filter(Boolean);
  for (const target of targets) {
    check(matchFiles(target.replace(/^\.\//, '')).length > 0, `package.json: "${target}" (main/exports) does not exist`);
  }
  for (const entry of pkg.files ?? []) {
    check(matchFiles(entry).length > 0, `package.json: "files" entry "${entry}" matches no file`);
  }
});

// --- plugin id consistency -----------------------------------------------
const client = read('client.js');
await attempt('plugin id', () => {
  const patch = read('cordis.patch.yml');
  const inserts = patch.match(/^\s*-\s*insert:/gm) ?? [];
  const rows = patch.match(/^\s*-\s*id:\s*turn-timeline\s*$/gm) ?? [];
  check(inserts.length === 1 && rows.length === 1, 'cordis.patch.yml: expected exactly one insert row with id: turn-timeline');
  const rowName = patch.match(/^\s*name:\s*(?:'([^']*)'|"([^"]*)"|(\S+))\s*$/m);
  const patchName = rowName && (rowName[1] ?? rowName[2] ?? rowName[3]);
  check(patchName === pkg.name, `cordis.patch.yml: row name "${patchName}" does not match package name "${pkg.name}"`);
  const pluginId = client.match(/const PLUGIN_ID = ['"]([^'"]+)['"]/)?.[1];
  check(pluginId === pkg.name, `client.js: PLUGIN_ID "${pluginId}" does not match package name "${pkg.name}"`);
  check(/\bid:\s*PLUGIN_ID\b/.test(client), 'client.js: module must be loaded with `id: PLUGIN_ID`');
});

// --- client.js runs as a classic script ----------------------------------
await attempt('client.js', () => {
  const script = new vm.Script(client, { filename: 'client.js' });
  passed += 1;
  const attached = [];
  const document = {
    head: { appendChild: (tag) => attached.push(tag) },
    createElement: (tagName) => {
      const tag = { tagName, dataset: {}, textContent: '' };
      tag.remove = () => attached.includes(tag) && attached.splice(attached.indexOf(tag), 1);
      return tag;
    },
    querySelectorAll: (selector) => {
      const plugin = selector.match(/data-plugin="([^"]+)"/)?.[1];
      return attached.filter((tag) => tag.dataset.plugin === plugin);
    },
  };
  let mod;
  const window = { __ModuleLoader__: { load: (m) => { mod = m; } } };
  script.runInContext(vm.createContext({ window, document }));
  check(mod?.id === pkg.name, `client.js: loaded module id "${mod?.id}" does not match "${pkg.name}"`);
  if (!mod) return;
  const disposers = [];
  const ctx = { effect: (fn, label) => { disposers.push(fn()); check(Boolean(label), 'client.js: effect has no label'); } };
  mod.factory().apply(ctx);
  mod.factory().apply(ctx);
  check(attached.length === 1, `client.js: expected exactly 1 style tag after two mounts, found ${attached.length}`);
  check(attached.every((tag) => tag.tagName === 'style' && tag.textContent.trim()), 'client.js: style tag is empty');
  for (const dispose of disposers) dispose?.();
  check(attached.length === 0, `client.js: ${attached.length} style tag(s) left after dispose`);
});

// --- index.js parses as ESM ----------------------------------------------
await attempt('index.js', async () => {
  const host = await import(pathToFileURL(join(root, 'index.js')).href);
  check(typeof host.apply === 'function', 'index.js: must export an apply() function');
});

// --- locales -------------------------------------------------------------
for (const locale of ['en', 'zh']) {
  await attempt(`locale/${locale}.json`, () => {
    const { meta } = JSON.parse(read(`locale/${locale}.json`));
    check(Boolean(meta?.title?.trim()), `locale/${locale}.json: meta.title is empty`);
    check(Boolean(meta?.description?.trim()), `locale/${locale}.json: meta.description is empty`);
  });
}

// --- packed file set -----------------------------------------------------
await attempt('npm pack', () => {
  // npm is a .cmd shim on Windows, so it needs a shell there; pass one command
  // string in that case (args + shell is deprecated in Node 24).
  const win = process.platform === 'win32';
  const options = { cwd: root, encoding: 'utf8', shell: win };
  const result = win
    ? spawnSync('npm pack --dry-run --json', options)
    : spawnSync('npm', ['pack', '--dry-run', '--json'], options);
  if (result.status !== 0) throw new Error(`npm pack --dry-run failed: ${result.stderr || result.error?.message}`);
  const packed = new Set(JSON.parse(result.stdout)[0].files.map((f) => f.path));
  const expected = ['LICENSE', 'README.md', 'package.json', 'index.js', 'client.js', 'cordis.patch.yml', 'icon.svg', 'locale/en.json', 'locale/zh.json'];
  const missing = expected.filter((f) => !packed.has(f));
  const extra = [...packed].filter((f) => !expected.includes(f) && f !== 'CHANGELOG.md');
  check(missing.length === 0, `npm pack: missing ${missing.join(', ')}`);
  check(extra.length === 0, `npm pack: unexpected ${extra.join(', ')}`);
});

// --- changelog -----------------------------------------------------------
await attempt('CHANGELOG.md', () => {
  const heading = `## [${pkg.version}]`;
  check(read('CHANGELOG.md').split('\n').some((line) => line.startsWith(heading)), `CHANGELOG.md: no "${heading}" heading`);
});

for (const message of failures) console.error(`✖ ${message}`);
if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed, ${passed} passed`);
  process.exit(1);
}
console.log(`✔ ${passed} checks passed`);
