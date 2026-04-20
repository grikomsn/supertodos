import { createRemoteJWKSet } from 'jose'
import { env } from '../env'

export const jwks = createRemoteJWKSet(
  new URL(`${env.supabaseUrl}/auth/v1/.well-known/jwks.json`),
)

export const jwtIssuer = `${env.supabaseUrl}/auth/v1`
