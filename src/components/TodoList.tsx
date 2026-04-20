import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../auth/useAuth'
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from '../api/todos'
import type { Todo } from '../types/todo'

export function TodoList() {
  const { session, signOut } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!session) return
    let cancelled = false
    fetchTodos(session)
      .then((list) => {
        if (!cancelled) {
          setTodos(list)
          setError(null)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load todos')
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [session])

  async function addTodo(e: FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !session) return
    setBusy(true)
    setError(null)
    try {
      const created = await createTodo(session, text)
      setTodos((prev) => [created, ...prev])
      setDraft('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add todo')
    } finally {
      setBusy(false)
    }
  }

  async function toggle(todo: Todo) {
    if (!session) return
    const next = !(todo.completed ?? false)
    setBusy(true)
    setError(null)
    try {
      const updated = await updateTodo(session, todo.id, { completed: next })
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update')
    } finally {
      setBusy(false)
    }
  }

  async function remove(todo: Todo) {
    if (!session) return
    setBusy(true)
    setError(null)
    try {
      await deleteTodo(session, todo.id)
      setTodos((prev) => prev.filter((t) => t.id !== todo.id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete')
    } finally {
      setBusy(false)
    }
  }

  if (!session) return null

  return (
    <div className="todo-app">
      <header className="todo-header">
        <h1 className="auth-title">Supertodos</h1>
        <button
          type="button"
          className="btn ghost"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      </header>

      <form className="todo-add" onSubmit={addTodo}>
        <input
          className="todo-input"
          placeholder="Add a task…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={busy}
          aria-label="New task"
        />
        <button type="submit" className="btn primary" disabled={busy || !draft.trim()}>
          Add
        </button>
      </form>

      {error ? <p className="auth-message">{error}</p> : null}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : todos.length === 0 ? (
        <p className="muted">No tasks yet. Add one above.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-row">
              <label className="todo-check">
                <input
                  type="checkbox"
                  checked={Boolean(todo.completed)}
                  onChange={() => void toggle(todo)}
                  disabled={busy}
                />
                <span className={todo.completed ? 'done' : ''}>{todo.text}</span>
              </label>
              <button
                type="button"
                className="btn danger"
                onClick={() => void remove(todo)}
                disabled={busy}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
