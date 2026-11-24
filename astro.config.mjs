import { defineConfig } from 'astro/config';
import { dailyReader } from './src/server/daily-reading.ts';
import { localTutor } from './src/server/local-ai.ts';

// GitHub Actions supplies the repository name; local development stays at /.
const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const base = process.env.SITE_BASE ?? (repository && repository !== `${owner}.github.io` ? `/${repository}/` : '/');
export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || (owner ? `https://${owner}.github.io` : undefined),
  base,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  vite: { plugins: [localTutor(), dailyReader()] },
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
