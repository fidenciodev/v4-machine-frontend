import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

export default defineConfig({
  ...(isGitHubPages ? {
    site: 'https://fidenciodev.github.io',
    base: '/v4-machine-frontend',
  } : {}),
  output: 'static',
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
