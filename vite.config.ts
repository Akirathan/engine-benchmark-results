import vue from '@vitejs/plugin-vue'
import serveStatic from 'serve-static'
import { ViteDevServer, defineConfig, type Plugin } from 'vite'
import vuetify from 'vite-plugin-vuetify'

const LOCAL_FS_PORT = 5179
const REPO_NAME = '/engine-benchmark-results/'
const REPO_URL = 'https://akirathan.github.io/engine-benchmark-results/'
const FS_URL = isDevBuild() ? `http://localhost:${LOCAL_FS_PORT}` : REPO_URL

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify({ autoImport: true }), fsServer()],
  define: {
    FS_URL: JSON.stringify(FS_URL),
    DEFAULT_DAYS_TO_FETCH: 30,
    MAX_LABELS: 10,
  },
  base: isDevBuild() ? '/': REPO_NAME,
  server: {
    port: LOCAL_FS_PORT,
    strictPort: true,
  },
})

function fsServer(): Plugin {
  return {
    name: 'fs-server',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/cache', serveStatic('/cache'))
    },
  }
}

function isDevBuild(): boolean {
  return process.env.NODE_ENV === 'development'
}
