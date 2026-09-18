import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const virtualId = 'virtual:character-images';
const resolvedId = `\0${virtualId}`;
const portraitRoot = path.resolve('public/characters');

function portraitManifest() {
  const manifest = {};
  if (!fs.existsSync(portraitRoot)) return manifest;
  for (const entry of fs.readdirSync(portraitRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const folder = path.join(portraitRoot, entry.name);
    manifest[entry.name] = fs.readdirSync(folder, { withFileTypes: true })
      .filter(file => file.isFile() && !file.name.startsWith('.') && !/\.(txt|md)$/i.test(file.name))
      .map(file => `/characters/${encodeURIComponent(entry.name)}/${encodeURIComponent(file.name)}`);
  }
  return manifest;
}

function characterPortraits() {
  return {
    name: 'character-portraits',
    resolveId(id) { if (id === virtualId) return resolvedId; },
    load(id) {
      if (id === resolvedId) return `export const characterImages = ${JSON.stringify(portraitManifest())};`;
    },
    configureServer(server) {
      server.watcher.add(portraitRoot);
      const refresh = file => {
        if (!file.startsWith(portraitRoot) || /\.(txt|md)$/i.test(file)) return;
        const mod = server.moduleGraph.getModuleById(resolvedId);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
    }
  };
}

export default defineConfig({
  plugins: [characterPortraits()],
  // Vite's default port. strictPort makes a clash fail loudly rather than
  // silently moving to the next free one — the vote QR encodes whatever
  // origin the page is served from, so a surprise port is worth knowing about.
  server: { port: 5173, strictPort: true },
  // Two entry points: the reader and the phone vote page. Building
  // `vote/index.html` as a real file (rather than relying on an SPA
  // fallback) means /vote/ resolves the same way in dev, in the production
  // build, and on Cloudflare's asset layer.
  build: {
    rollupOptions: {
      input: {
        main: path.resolve('index.html'),
        vote: path.resolve('vote/index.html')
      }
    }
  }
});
