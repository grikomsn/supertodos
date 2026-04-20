/** Matches `public.todos` in Supabase (author → auth.users). */
export type Todo = {
  id: number
  created_at: string
  text: string
  completed: boolean | null
  author: string | null
}
