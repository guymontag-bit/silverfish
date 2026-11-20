import 'server-only'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error(
    'Missing Supabase environment variables. Check .env.local (local) or Vercel settings (deployed).'
  )
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})