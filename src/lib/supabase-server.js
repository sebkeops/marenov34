import { createClient } from '@supabase/supabase-js'

// Client serveur pour les Server Components (lecture publique uniquement)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
