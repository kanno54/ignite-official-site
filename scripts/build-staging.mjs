import { spawnSync } from 'node:child_process';

const npmCli = process.env.npm_execpath;
const environment = {
  ...process.env,
  VITE_STAGING: 'true',
  VITE_SITE_URL: process.env.VITE_SITE_URL || 'https://staging.ignite-official.site',
};

if (!npmCli) throw new Error('npm_execpath is unavailable; run this script through npm run build:staging.');

const run = (script) => {
  const result = spawnSync(process.execPath, [npmCli, 'run', script], {
    env: environment,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run('build');
run('prepare:staging');
