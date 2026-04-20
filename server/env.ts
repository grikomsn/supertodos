const DATABASE_URL = process.env.DATABASE_URL
/** Same project URL as Vite; used for JWKS (ES256 access tokens). */
const supabaseUrl = (
  process.env.SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  ''
).replace(/\/$/, '')

if (!DATABASE_URL || !supabaseUrl) {
  console.error(
    'Missing DATABASE_URL or SUPABASE_URL (or VITE_SUPABASE_URL for JWKS). See .env.example.',
  )
  process.exit(1)
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  DATABASE_URL,
  supabaseUrl,
} as const
