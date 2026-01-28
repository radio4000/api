import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './config'

import root from './root'
import embed from './embed'
import oembed from './oembed'
import youtube from './youtube'
import searchYoutube from './search-youtube'
import v2Index from './v2/index'
import v2Backup from './v2/backup'
import v2Embed from './v2/embed'

const app = new Hono<{ Bindings: Env }>()

// CORS middleware - matches existing Next.js config
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'OPTIONS', 'PATCH', 'DELETE', 'POST', 'PUT'],
  allowHeaders: [
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Content-Type',
    'Date',
    'X-Api-Version',
  ],
  credentials: true,
}))

// V1 endpoints (under /api/)
app.route('/api/', root)
app.route('/api/embed', embed)
app.route('/api/oembed', oembed)
app.route('/api/youtube', youtube)
app.route('/api/search-youtube', searchYoutube)
app.route('/api/backup', v2Backup)

// V2 endpoints (under /api/v2/)
app.route('/api/v2', v2Index)
app.route('/api/v2/backup', v2Backup)
app.route('/api/v2/embed', v2Embed)

// 404 handler
app.notFound((c) => {
  return c.json({ message: 'Not found' }, 404)
})

export default app
