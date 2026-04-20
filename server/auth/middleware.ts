import type { NextFunction, Request, Response } from 'express'
import { jwtVerify } from 'jose'
import { jwks, jwtIssuer } from './jwt'

export type AuthedRequest = Request & { userId: string }

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    res.status(401).json({ error: 'Missing Authorization Bearer token' })
    return
  }
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: jwtIssuer,
      audience: 'authenticated',
    })
    const sub = payload.sub
    if (!sub || typeof sub !== 'string') {
      res.status(401).json({ error: 'Invalid token payload' })
      return
    }
    ;(req as AuthedRequest).userId = sub
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
