import { defineConfig, type Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import react from '@vitejs/plugin-react';

// Preserve old résumé links without storing a duplicate PDF.
function legacyResume(req: IncomingMessage, res: ServerResponse, next: () => void) {
  let pathname = (req.url || '').split('?')[0];
  try { pathname = decodeURIComponent(pathname); } catch { next(); return; }
  if (/^\/assets\/jeffresume.*\.pdf$/i.test(pathname)) { res.writeHead(302, { Location: '/documents/jefrine-correya-resume.pdf' }); res.end(); return; }
  next();
}
const legacyAlias: Plugin = { name: 'canonical-document-alias', configureServer(server) { server.middlewares.use(legacyResume); }, configurePreviewServer(server) { server.middlewares.use(legacyResume); } };
export default defineConfig({
  plugins: [react(), legacyAlias],
  server: { host: '0.0.0.0', port: 5173, strictPort: true, allowedHosts: ['.e2b.app', 'localhost'] },
  preview: { host: '0.0.0.0', port: 4173, strictPort: true, allowedHosts: ['.e2b.app', 'localhost'] },
  build: {
    target: 'es2022', sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'vendor-webgl';
          if (id.includes('/node_modules/gsap/')) return 'vendor-motion';
        },
      },
    },
  },
});
