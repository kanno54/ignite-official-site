import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'node:fs';
const weBurnIsStaging = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'content/public/campaigns.json'), 'utf8'))
  .some((campaign: {id:string;status:string}) => campaign.id === 'we-burn' && campaign.status === 'staging');

// Staging campaign content must never be shipped merely because JSON is imported.
const weBurnStagingGate = () => ({
  name: 'we-burn-staging-gate',
  enforce: 'pre' as const,
  apply: 'build' as const,
  load(id: string) {
    if (!weBurnIsStaging || process.env.VITE_STAGING === 'true' || !id.replaceAll('\\', '/').includes('/content/public/') || !id.endsWith('.json')) return null;
    const name = path.basename(id);
    if (!['articles.json','campaigns.json','discography.json','asset-manifest.json','image-derivatives.json','we-burn.json'].includes(name)) return null;
    const data = JSON.parse(fs.readFileSync(id, 'utf8'));
    if (name === 'articles.json') return JSON.stringify(data.filter((a: {relatedCampaignId?: string})=>a.relatedCampaignId!=='we-burn'));
    if (name === 'campaigns.json') return JSON.stringify(data.filter((a: {id: string})=>a.id!=='we-burn'));
    if (name === 'discography.json') return JSON.stringify({...data,releases:data.releases.filter((a: {id:string})=>a.id!=='we-burn'),recordings:data.recordings.filter((a: {releaseId:string})=>a.releaseId!=='we-burn')});
    if (name === 'asset-manifest.json') return JSON.stringify({...data,images:Object.fromEntries(Object.entries(data.images).filter(([key])=>!key.startsWith('wb25-')))});
    if (name === 'image-derivatives.json') return JSON.stringify({...data,assets:Object.fromEntries(Object.entries(data.assets).filter(([key])=>!key.startsWith('wb25-')))});
    return JSON.stringify({releaseMarkdown:'',closingMarkdown:'',seoDescription:'',ogDescription:'',tracks:[]});
  },
  closeBundle() {
    if (!weBurnIsStaging || process.env.VITE_STAGING === 'true') return;
    const outputRoot = path.resolve(__dirname, 'dist');
    for (const relative of ['assets/images/we-burn','media/audio/we-burn']) {
      const target = path.resolve(outputRoot, relative);
      if (!target.startsWith(outputRoot + path.sep)) throw new Error('Unsafe staging asset cleanup path');
      fs.rmSync(target, {recursive:true,force:true});
    }
  },
});

export default defineConfig({
  plugins: [weBurnStagingGate(), react()],
  base: process.env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    watch: {
      ignored: ['**/data/**', '**/public/media/**'],
    },
  },
});
