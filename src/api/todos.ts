import type { Session } from '@supabase/supabase-js'
import type { Todo } from '../types/todo'

function headers(session: Session, init?: HeadersInit): HeadersInit {
  return {
    ...init,
    Authorization: `Bearer ${session.access_token}`,
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { error?: string }
    return j.error ?? res.statusText
  } catch {
    return res.statusText
  }
}

export async function fetchTodos(session: Session): Promise<Todo[]> {
  const res = await fetch('/api/todos', { headers: headers(session) })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<Todo[]>
}

export async function createTodo(
  session: Session,
  text: string,
): Promise<Todo> {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: headers(session, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<Todo>
}

export async function updateTodo(
  session: Session,
  id: number,
  patch: { text?: string; completed?: boolean },
): Promise<Todo> {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: headers(session, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json() as Promise<Todo>
}

export async function deleteTodo(session: Session, id: number): Promise<void> {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
    headers: headers(session),
  })
  if (!res.ok && res.status !== 204) throw new Error(await parseError(res))
}
