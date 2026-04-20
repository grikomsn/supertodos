import { useAuth } from './auth/useAuth'
import { LoginForm } from './components/LoginForm'
import { TodoList } from './components/TodoList'
import './App.css'

function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-shell">
        <p className="app-loading">Loading…</p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {session ? <TodoList /> : <LoginForm />}
    </div>
  )
}

export default App
