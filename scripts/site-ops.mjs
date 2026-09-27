import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = 'kanno54/ignite-official-site';
const api = `https://api.github.com/repos/${repo}`;
export const sites = { staging: 'https://staging.ignite-official.site', production: 'https://ignite-official.site' };
const routes = ['/', '/campaigns/', '/features/', '/story/', '/discography/'];
const stageRoutes = ['/campaigns/we-burn/', '/discography/we-burn/', '/features/five-directions/', '/features/no-plan/'];
const protectedPaths = ['.github', 'scripts', 'package.json', 'package-lock.json', 'README.md', 'site.cmd'];
export const digest = value => createHash('sha256').update(value).digest('hex');
function run(command, args, cwd = root, capture = false, env = process.env) {
  const result = spawnSync(command, args, { cwd, env, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}): ${capture ? result.stderr : ''}`);
  return capture ? result.stdout.trim() : '';
}
const git = (...args) => run('git', args, root, true);
function npm(script, environment = 'staging') {
  if (!process.env.npm_execpath) throw new Error('Use npm run site -- ... or site.cmd.');
  run(process.execPath, [process.env.npm_execpath, 'run', script], root, false, {
    ...process.env, VITE_STAGING: environment === 'staging' ? 'true' : 'false', VITE_SITE_URL: sites[environment],
  });
}
async function get(url, options = {}) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20000), ...options,
    headers: { 'Cache-Control': 'no-cache', ...options.headers } });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response;
}
async function github(endpoint, options = {}) {
  const headers = { Accept: 'application/vnd.github+json', ...options.headers };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return get(`${api}${endpoint}`, { ...options, headers });
}
export function validateManifest(manifest, environment, expected) {
  if (manifest.environment !== environment || manifest.sha !== expected || !/^[a-f0-9]{40}$/.test(expected)) throw new Error('Wrong environment or stale revision.');
  if (!manifest.files || !manifest.files['/index.html']) throw new Error('Missing entry document hashes.');
  for (const [name, hash] of Object.entries(manifest.files)) {
    if (!/^\/(?:assets\/[\w.-]+|(?:[\w-]+\/)*index\.html)$/.test(name) || !/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid manifest file.');
  }
}
function manifest(environment) {
  const files = {};
  for (const route of [...routes, ...(environment === 'staging' ? stageRoutes : [])]) {
    const file = `${route}index.html`;
    const html = fs.readFileSync(path.join(root, 'dist', file));
    files[file] = digest(html);
    for (const match of html.toString().matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)) {
      files[match[1]] = digest(fs.readFileSync(path.join(root, 'dist', match[1])));
    }
  }
  fs.writeFileSync(path.join(root, 'dist/site-revision.json'), JSON.stringify({ environment, sha: git('rev-parse', 'HEAD'), files }, null, 2));
}
export async function verify(environment, expected) {
  const base = sites[environment];
  const manifest = await (await get(`${base}/site-revision.json?revision=${expected}`)).json();
  validateManifest(manifest, environment, expected);
  for (const route of [...routes, ...(environment === 'staging' ? stageRoutes : [])]) {
    if (!manifest.files[`${route}index.html`]) throw new Error(`Missing route in manifest: ${route}`);
  }
  if (!Object.keys(manifest.files).some(file => file.endsWith('.js'))) throw new Error('Missing application bundle hash.');
  for (const [file, hash] of Object.entries(manifest.files)) {
    const url = file.endsWith('index.html') ? file.slice(0, -10) : file;
    const response = await get(`${base}${url}?revision=${expected}`);
    if (digest(Buffer.from(await response.arrayBuffer())) !== hash) throw new Error(`Stale or damaged file: ${url}`);
  }
  // One existing audio file is sufficient for the routine HTTP/Range smoke check.
  const response = await get(`${base}/media/audio/ignition/02-back-to-the-spark.v1.mp3`, { headers: { Range: 'bytes=0-1' } });
  const reader = response.body.getReader();
  const first = await reader.read();
  await reader.cancel();
  if (!first.value?.length || !/audio|octet-stream/.test(response.headers.get('content-type') || '') ||
      (response.status === 206 && !/^bytes 0-1\/\d+$/.test(response.headers.get('content-range') || '')) ||
      ![200, 206].includes(response.status)) throw new Error('Audio response failed.');
  console.log(`Verified ${environment}: ${expected} (${Object.keys(manifest.files).length} HTML/assets + audio HTTP ${response.status}${response.status === 200 ? '; server ignores Range' : ''})`);
}
async function waitForDeploy(environment, sha, after = 0) {
  const workflow = environment === 'staging' ? 'deploy-staging.yml' : 'deploy.yml';
  const branch = environment === 'staging' ? 'staging' : 'main';
  const deadline = Date.now() + 45 * 60 * 1000;
  let last = '';
  while (Date.now() < deadline) {
    const data = await (await github(`/actions/workflows/${workflow}/runs?branch=${branch}&head_sha=${sha}&per_page=10`)).json();
    const action = data.workflow_runs.find(item => item.head_sha === sha && Date.parse(item.created_at) >= after);
    if (action) {
      const status = `${action.html_url} ${action.status} ${action.conclusion || ''}`;
      if (status !== last) console.log(status);
      last = status;
      if (action.status === 'completed') {
        if (action.conclusion !== 'success') throw new Error(`Deployment ${action.conclusion}; inspect ${action.html_url}. No automatic rollback.`);
        await verify(environment, sha);
        return;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
  throw new Error(`Timed out. Deployment may still be running. Resume: npm run site -- wait ${environment} --sha ${sha}`);
}
function preflight() {
  if (!/^https:\/\/github\.com\/kanno54\/ignite-official-site(?:\.git)?$/.test(git('remote', 'get-url', '--push', 'origin'))) throw new Error('Unexpected push remote.');
  const dirty = git('status', '--porcelain', '--', '.', ':!reports');
  if (dirty) throw new Error('Commit site/operations changes first. Only reports/ may remain dirty.');
}
function remoteHead(branch) {
  const sha = git('ls-remote', 'origin', `refs/heads/${branch}`).split(/\s/)[0];
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error(`Cannot resolve ${branch}`);
  return sha;
}
export function requireProductionConfirmation(sha, confirmation) {
  if (confirmation !== `PRODUCTION:${sha}`) throw new Error(`Explicit confirmation required: --confirm PRODUCTION:${sha}`);
}
async function production(sha, apply, confirmation) {
  if (sha !== remoteHead('main')) throw new Error('Production must use the current remote main commit.');
  // Refuse to dispatch the legacy workflow, even if this local checkout has been updated.
  const installed = await (await get(`https://raw.githubusercontent.com/${repo}/${sha}/.github/workflows/deploy.yml`)).text();
  if (!installed.includes('SITE_OPS_MANUAL_PRODUCTION_V1') || /\n\s+(push|schedule):/.test(installed)) throw new Error('Safe manual workflow is not installed on main. See README installation section.');
  const scheduler = await (await get(`https://raw.githubusercontent.com/${repo}/${sha}/.github/workflows/scheduled-release.yml`)).text();
  if (/cron:|lftp|SFTP_|deploy-site/.test(scheduler)) throw new Error('Legacy scheduled production deployment is still enabled.');
  console.log(`Production target: ${sites.production}, main ${sha}`);
  if (!apply) return;
  requireProductionConfirmation(sha, confirmation);
  if (!process.env.GITHUB_TOKEN) throw new Error('Set a GitHub token with Actions write access, or use the GitHub Actions manual form documented in README.');
  const started = Date.now() - 1000;
  await github('/actions/workflows/deploy.yml/dispatches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ref: 'main', inputs: { confirmation: `PRODUCTION:${sha}` } }) });
  await waitForDeploy('production', sha, started);
}
async function rollback(environment, target, apply, confirmation) {
  preflight();
  if (!/^[a-f0-9]{7,40}$/.test(target || '')) throw new Error('--to requires a commit SHA.');
  const branch = environment === 'staging' ? 'staging' : 'main';
  git('fetch', 'origin', branch);
  const head = git('rev-parse', `origin/${branch}`);
  const good = git('rev-parse', `${target}^{commit}`);
  git('merge-base', '--is-ancestor', good, head);
  if (head === good) throw new Error('Already at requested revision.');
  if (git('diff', '--name-only', good, head, '--', ...protectedPaths)) throw new Error('Rollback crosses operations/dependency changes; automatic rollback refused. Use a reviewed forward fix.');
  console.log(git('diff', '--stat', head, good));
  console.log(`Restore tracked site content to ${good}; preserve history and current working directory.`);
  if (!apply) return;
  if (environment === 'production') requireProductionConfirmation(head, confirmation);
  const sha = createRollbackCommit(root, good, head);
  // Fast-forward push only. Concurrent remote updates fail rather than being overwritten.
  console.log(`Created rollback commit: ${sha}`);
  git('push', 'origin', `${sha}:refs/heads/${branch}`);
  if (environment === 'staging') await waitForDeploy(environment, sha);
  else console.log(`Rollback commit pushed, NOT deployed. Confirm its new SHA separately: npm run site -- production --sha ${sha} --apply --confirm PRODUCTION:${sha}`);
}
export function createRollbackCommit(repository, good, head) {
  const localGit = (...args) => run('git', args, repository, true);
  localGit('merge-base', '--is-ancestor', good, head);
  if (localGit('diff', '--name-only', good, head, '--', ...protectedPaths)) throw new Error('Rollback crosses operations/dependency changes.');
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'ignite-rollback-'));
  const worktree = path.join(parent, 'worktree');
  try {
    localGit('worktree', 'add', '--detach', worktree, head);
    run('git', ['restore', '--source', good, '--staged', '--worktree', '--', '.'], worktree);
    run('git', ['commit', '-m', `Restore site content from ${good}`], worktree);
    return run('git', ['rev-parse', 'HEAD'], worktree, true);
  } finally {
    if (fs.existsSync(worktree)) localGit('worktree', 'remove', worktree);
    fs.rmdirSync(parent);
  }
}
export async function main(args) {
  const [command, ...rest] = args;
  const positional = [];
  const options = {};
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (['--apply', '--full'].includes(arg)) options[arg.slice(2)] = true;
    else if (['--sha', '--to', '--confirm'].includes(arg) && rest[i + 1] && !rest[i + 1].startsWith('--')) options[arg.slice(2)] = rest[++i];
    else if (!arg.startsWith('-')) positional.push(arg);
    else throw new Error(`Unknown/incomplete option: ${arg}`);
  }
  if (positional.length > 1) throw new Error('Too many arguments.');
  const environment = positional[0] || 'staging';
  if (!Object.hasOwn(sites, environment)) throw new Error('Environment must be staging or production.');
  if (command === 'check') {
    if (options.full) { npm('validate', environment); npm(environment === 'staging' ? 'build:staging' : 'build', environment); npm('test:static', environment); npm('assert-public-cutoff', environment); }
    else { npm('validate:data', environment); npm('validate:routes', environment); npm('test:content-selection', environment); }
  } else if (command === 'manifest') manifest(environment);
  else if (['verify', 'wait'].includes(command)) {
    if (!/^[a-f0-9]{40}$/.test(options.sha || '')) throw new Error('--sha requires the full expected commit SHA.');
    await (command === 'verify' ? verify(environment, options.sha) : waitForDeploy(environment, options.sha));
  } else if (command === 'stage') {
    if (environment !== 'staging') throw new Error('stage cannot target production.');
    preflight();
    const sha = git('rev-parse', 'HEAD');
    git('fetch', 'origin', 'staging');
    git('merge-base', '--is-ancestor', 'origin/staging', sha);
    console.log(`Staging target: ${sites.staging}, committed HEAD ${sha}. Checks/build run once in CI.`);
    if (options.apply) { git('push', 'origin', `${sha}:refs/heads/staging`); await waitForDeploy('staging', sha); }
  } else if (command === 'production') await production(options.sha || remoteHead('main'), options.apply, options.confirm);
  else if (command === 'rollback') {
    if (environment === 'production') await production(remoteHead('main'), false);
    await rollback(environment, options.to, options.apply, options.confirm);
  } else throw new Error('Usage: npm run site -- check|stage|production|verify|wait|rollback [staging|production] [--apply] [--sha SHA] [--to SHA] [--confirm PRODUCTION:SHA] [--full]');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
