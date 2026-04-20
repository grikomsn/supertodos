import { Router, type Request, type Response } from 'express'
import type { AuthedRequest } from '../auth/middleware'
import { authMiddleware } from '../auth/middleware'
import { pool } from '../db/pool'
import { mapRow } from './map-row'

export const todoRouter = Router()

todoRouter.use(authMiddleware)

todoRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest
  try {
    const result = await pool.query(
      `select id, created_at, text, completed, author
       from public.todos
       where author = $1
       order by created_at desc`,
      [userId],
    )
    res.json(result.rows.map((r) => mapRow(r as Record<string, unknown>)))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to list todos' })
  }
})

todoRouter.post('/', async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
  if (!text) {
    res.status(400).json({ error: 'text is required' })
    return
  }
  try {
    const result = await pool.query(
      `insert into public.todos (text, author)
       values ($1, $2)
       returning id, created_at, text, completed, author`,
      [text, userId],
    )
    const row = result.rows[0]
    res.status(201).json(mapRow(row as Record<string, unknown>))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create todo' })
  }
})

todoRouter.patch('/:id', async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest
  const id = Number.parseInt(req.params.id, 10)
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: 'Invalid id' })
    return
  }
  const body = req.body as { text?: unknown; completed?: unknown }
  const updates: string[] = []
  const values: unknown[] = []
  let n = 1
  if (typeof body.text === 'string') {
    updates.push(`text = $${n++}`)
    values.push(body.text.trim())
  }
  if (typeof body.completed === 'boolean') {
    updates.push(`completed = $${n++}`)
    values.push(body.completed)
  }
  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' })
    return
  }
  const idParam = n++
  const authorParam = n++
  values.push(id, userId)
  try {
    const result = await pool.query(
      `update public.todos
       set ${updates.join(', ')}
       where id = $${idParam} and author = $${authorParam}
       returning id, created_at, text, completed, author`,
      values,
    )
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Todo not found' })
      return
    }
    res.json(mapRow(result.rows[0] as Record<string, unknown>))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to update todo' })
  }
})

todoRouter.delete('/:id', async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest
  const id = Number.parseInt(req.params.id, 10)
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: 'Invalid id' })
    return
  }
  try {
    const result = await pool.query(
      `delete from public.todos where id = $1 and author = $2`,
      [id, userId],
    )
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Todo not found' })
      return
    }
    res.status(204).send()
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete todo' })
  }
})
