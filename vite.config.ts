/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

function claudeFeedbackPlugin(): Plugin {
  const dir = path.resolve(__dirname, '.claude-feedback')
  const file = path.join(dir, 'comments.json')

  const readAll = (): any[] => {
    if (!fs.existsSync(file)) return []
    try {
      const raw = fs.readFileSync(file, 'utf8').trim()
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const writeAll = (items: any[]) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(file, JSON.stringify(items, null, 2))
  }

  const readBody = (req: any): Promise<string> =>
    new Promise((resolve) => {
      let body = ''
      req.on('data', (chunk: Buffer) => { body += chunk })
      req.on('end', () => resolve(body))
    })

  const sendJson = (res: any, status: number, payload: unknown) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(payload))
  }

  return {
    name: 'claude-feedback',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__claude-feedback', async (req, res) => {
        try {
          const url = new URL(req.url || '/', 'http://localhost')
          const id = url.searchParams.get('id')

          if (req.method === 'GET') {
            const items = readAll().filter((c) => c.status !== 'resolved')
            return sendJson(res, 200, items)
          }

          if (req.method === 'POST') {
            const data = JSON.parse(await readBody(req))
            const now = new Date().toISOString()
            const entry = {
              id: `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
              status: 'pending',
              comment: String(data.comment || '').trim(),
              categories: Array.isArray(data.categories) ? data.categories : [],
              target: data.target ?? null,
              url: data.url ?? '',
              viewport: data.viewport ?? null,
              createdAt: now,
              updatedAt: now,
            }
            const items = readAll()
            items.push(entry)
            writeAll(items)
            return sendJson(res, 200, entry)
          }

          if (req.method === 'PATCH') {
            if (!id) return sendJson(res, 400, { error: 'id required' })
            const patch = JSON.parse(await readBody(req))
            const items = readAll()
            const idx = items.findIndex((c) => c.id === id)
            if (idx === -1) return sendJson(res, 404, { error: 'not found' })
            const next = { ...items[idx] }
            if (typeof patch.comment === 'string') next.comment = patch.comment.trim()
            if (typeof patch.status === 'string') {
              next.status = patch.status
              if (patch.status === 'fixed') next.fixedAt = new Date().toISOString()
              if (patch.status === 'resolved') next.resolvedAt = new Date().toISOString()
            }
            next.updatedAt = new Date().toISOString()
            items[idx] = next
            writeAll(items)
            return sendJson(res, 200, next)
          }

          if (req.method === 'DELETE') {
            if (!id) return sendJson(res, 400, { error: 'id required' })
            const items = readAll().filter((c) => c.id !== id)
            writeAll(items)
            return sendJson(res, 200, { ok: true })
          }

          res.statusCode = 405
          res.end()
        } catch (err) {
          sendJson(res, 500, { error: String(err) })
        }
      })
    },
  }
}

// Dev-only endpoint: GET current git branch, POST to switch branches.
// Used by <BranchSwitcher/> so the user can flip main ↔ design-experiment from the UI.
function branchSwitchPlugin(): Plugin {
  const BRANCHES = ['main', 'design-experiment'] as const
  const sendJson = (res: any, status: number, payload: unknown) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(payload))
  }
  const readBody = (req: any): Promise<string> =>
    new Promise((resolve) => {
      let body = ''
      req.on('data', (chunk: Buffer) => { body += chunk })
      req.on('end', () => resolve(body))
    })

  return {
    name: 'branch-switch',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__branch', async (req, res) => {
        try {
          if (req.method === 'GET') {
            const current = execSync('git branch --show-current', { cwd: __dirname }).toString().trim()
            return sendJson(res, 200, { current, branches: BRANCHES })
          }
          if (req.method === 'POST') {
            const { branch } = JSON.parse(await readBody(req))
            // Whitelist — never accept an arbitrary string, prevents command injection.
            if (!BRANCHES.includes(branch)) return sendJson(res, 400, { error: 'unknown branch' })
            try {
              execSync(`git checkout ${branch}`, { cwd: __dirname, stdio: 'pipe' })
              return sendJson(res, 200, { ok: true, current: branch })
            } catch (err: any) {
              // Common cause: uncommitted changes block the checkout.
              return sendJson(res, 409, { error: (err.stderr?.toString() || err.message || String(err)).trim() })
            }
          }
          res.statusCode = 405
          res.end()
        } catch (err) {
          sendJson(res, 500, { error: String(err) })
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), claudeFeedbackPlugin(), branchSwitchPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined // Упрощаем - пусть Vite сам решает
      }
    }
  },
  // Правильная настройка для SPA роутинга в dev режиме
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 3000,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
}) 