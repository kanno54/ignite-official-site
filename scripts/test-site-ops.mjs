import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { digest, validateManifest, requireProductionConfirmation, main, verify, createRollbackCommit } from './site-ops.mjs';
const sha = 'a'.repeat(40);
test('revision verification rejects stale SHA, wrong environment and unsafe file paths', () => {
  const value = { environment: 'staging', sha, files: { '/index.html': digest('html') } };
  validateManifest(value, 'staging', sha);
  assert.throws(() => validateManifest(value, 'production', sha));
  assert.throws(() => validateManifest(value, 'staging', 'b'.repeat(40)));
  assert.throws(() => validateManifest({ ...value, files: { '//external.test/x': digest('x') } }, 'staging', sha));
  assert.throws(() => validateManifest({ ...value, files: {} }, 'staging', sha));
});
test('production confirmation is bound to the exact full commit SHA', () => {
  requireProductionConfirmation(sha, `PRODUCTION:${sha}`);
  for (const value of [undefined, 'yes', 'PRODUCTION', `PRODUCTION:${'b'.repeat(40)}`]) assert.throws(() => requireProductionConfirmation(sha, value));
});
test('invalid CLI inputs fail before mutation', async () => {
  for (const args of [['stage', 'production'], ['verify'], ['stage', '--aply'], ['rollback', 'unknown'], ['check', '--to']]) await assert.rejects(main(args));
});
test('production uses main push, retired scheduler cannot deploy, confirmation precedes push', () => {
  const production = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');
  assert.ok(production.includes('SITE_OPS_PUSH_PRODUCTION_V1'));
  assert.ok(production.includes("if: github.ref == 'refs/heads/main'"));
  assert.ok(production.includes('branches: [ main ]'));
  assert.ok(production.includes('secrets.SFTP_PROD_PATH || secrets.SFTP_REMOTE_PATH'));
  assert.doesNotMatch(production, /\n\s+(workflow_dispatch|schedule):/);
  const cli = fs.readFileSync('scripts/site-ops.mjs', 'utf8').split('async function production(')[1].split('async function rollback(')[0];
  assert.ok(cli.indexOf('requireProductionConfirmation(sha, confirmation)') < cli.indexOf("git('push'"));
  assert.doesNotMatch(cli, /dispatches|GITHUB_TOKEN/);
  const scheduler = fs.readFileSync('.github/workflows/scheduled-release.yml', 'utf8');
  assert.doesNotMatch(scheduler, /cron:|lftp|SFTP_|deploy-site/);
  const transport = fs.readFileSync('scripts/deploy-site.sh', 'utf8');
  assert.doesNotMatch(transport, /--delete|> deploy\.lftp/);
});
test('HTTP smoke rejects stale asset, missing route, wrong SHA and broken audio Range', async () => {
  const original = globalThis.fetch;
  const files = Object.fromEntries(['/', '/campaigns/', '/features/', '/story/', '/discography/', '/campaigns/we-burn/', '/discography/we-burn/', '/features/five-directions/', '/features/no-plan/'].map(route => [`${route}index.html`, digest('html')]));
  files['/assets/app.js'] = digest('js');
  let mode = 'good';
  globalThis.fetch = async url => {
    const pathname = new URL(url).pathname;
    if (pathname === '/site-revision.json') {
      const manifest = { environment: 'staging', sha: mode === 'stale' ? 'b'.repeat(40) : sha, files: { ...files } };
      if (mode === 'missing') delete manifest.files['/story/index.html'];
      return Response.json(manifest);
    }
    if (pathname.endsWith('.mp3')) return new Response('01', { status: mode === 'no-range' ? 200 : 206, headers: { 'Content-Range': mode === 'audio' ? 'bytes 3-4/100' : 'bytes 0-1/100', 'Content-Type': 'audio/mpeg' } });
    return new Response(pathname.endsWith('.js') ? (mode === 'asset' ? 'old' : 'js') : 'html');
  };
  try {
    await verify('staging', sha);
    mode = 'no-range';
    await verify('staging', sha);
    for (mode of ['stale', 'missing', 'asset', 'audio']) await assert.rejects(verify('staging', sha));
  } finally { globalThis.fetch = original; }
});
test('rollback creates a descendant commit and preserves current files; tooling rollback is refused', () => {
  const repository = fs.mkdtempSync(path.join(os.tmpdir(), 'ignite-ops-test-'));
  const git = (...args) => execFileSync('git', args, { cwd: repository, encoding: 'utf8', windowsHide: true }).trim();
  try {
    git('init');
    git('config', 'user.name', 'Operations Test');
    git('config', 'user.email', 'test@example.invalid');
    fs.writeFileSync(path.join(repository, 'index.html'), 'good');
    fs.writeFileSync(path.join(repository, 'package.json'), '{}');
    git('add', '.'); git('commit', '-m', 'good');
    const good = git('rev-parse', 'HEAD');
    fs.writeFileSync(path.join(repository, 'index.html'), 'bad');
    git('commit', '-am', 'bad');
    const head = git('rev-parse', 'HEAD');
    const restored = createRollbackCommit(repository, good, head);
    assert.equal(git('show', `${restored}:index.html`), 'good');
    assert.equal(git('rev-parse', `${restored}^`), head);
    assert.equal(git('rev-parse', 'HEAD'), head);
    assert.equal(fs.readFileSync(path.join(repository, 'index.html'), 'utf8'), 'bad');
    fs.writeFileSync(path.join(repository, 'package.json'), '{"changed":true}');
    git('commit', '-am', 'dependency change');
    assert.throws(() => createRollbackCommit(repository, good, git('rev-parse', 'HEAD')), /operations\/dependency/);
  } finally {
    // Only this newly created, fixed-prefix temp directory is removed.
    assert.ok(path.resolve(repository).startsWith(path.resolve(os.tmpdir()) + path.sep + 'ignite-ops-test-'));
    fs.rmSync(repository, { recursive: true, force: true });
  }
});
