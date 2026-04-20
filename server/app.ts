import cors from 'cors'
import express from 'express'
import { todoRouter } from './todos/router'

export function createApp() {
  const app = express()
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    }),
  )
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/todos', todoRouter)

  return app
}
